// controllers/responses/verifyToken.controller.js
const SurveyInvite = require("../../models/SurveyInvite");
const Survey = require("../../models/Survey");
const Logger = require("../../utils/auditLog");
const mongoose = require("mongoose");

/**
 * Verify invite token and return survey for respondent to take.
 * Route: GET /api/responses/verify/:token
 */
exports.verifyInviteToken = async (req, res, next) => {
  const token = req.params.token;
  const requesterIp = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
  const userAgent = req.headers["user-agent"] || "";

  try {
    if (!token || typeof token !== "string") {
      await Logger.warning("verifyInviteToken: missing token", { ip: requesterIp });
      return res.status(400).json({ message: "Invalid request" });
    }

    // Try both possible field names just in case (token vs inviteToken)
    const invite = await SurveyInvite.findOne({
      $or: [{ token }, { inviteToken: token }]
    }).populate({
      path: "survey",
      select: "title description questions settings themeColor thankYouPage status schedule deleted tenant"
    }).lean();

    if (!invite) {
      await Logger.warning("verifyInviteToken: invite not found", { token, ip: requesterIp });
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    // If invite already responded, return 410 Gone
    if (invite.status === "responded" || invite.respondedAt) {
      await Logger.info("verifyInviteToken: invite already responded", { inviteId: invite._id, token, ip: requesterIp });
      return res.status(410).json({ message: "This survey link has already been used." });
    }

    // Basic tenant / survey guard
    const survey = invite.survey;
    if (!survey) {
      await Logger.error("verifyInviteToken: invite has no survey attached", { inviteId: invite._id });
      return res.status(404).json({ message: "Survey not found for this link" });
    }

    if (survey.deleted) {
      await Logger.warning("verifyInviteToken: survey deleted", { surveyId: survey._id, inviteId: invite._id });
      return res.status(410).json({ message: "Survey is no longer available" });
    }

    // Survey must be active (or scheduled but publishedAt <= now)
    const now = new Date();
    if (survey.status !== "active") {
      // allow access if scheduled and publishedAt already set and <= now
      const publishedAt = survey.schedule?.publishedAt;
      if (!publishedAt || new Date(publishedAt) > now) {
        await Logger.warning("verifyInviteToken: survey not active yet", { surveyId: survey._id, status: survey.status, inviteId: invite._id });
        return res.status(403).json({ message: "Survey is not active" });
      }
    }

    // If invite has an expiry concept (optional), check here (example field: expiresAt)
    if (invite.expiresAt && new Date(invite.expiresAt) < now) {
      await Logger.info("verifyInviteToken: invite expired", { inviteId: invite._id, token, ip: requesterIp });
      return res.status(410).json({ message: "This survey link has expired" });
    }

    // Update invite: mark opened + capture ip and userAgent (idempotent)
    const update = {
      status: invite.status !== "opened" ? "opened" : invite.status,
      openedAt: invite.openedAt || new Date(),
      lastAccessIp: requesterIp,
      lastAccessUserAgent: userAgent,
      updatedAt: new Date()
    };

    await SurveyInvite.updateOne({ _id: invite._id }, { $set: update }).catch(err => {
      // non-fatal, log and continue — we still return the survey
      Logger.warning("verifyInviteToken: failed to update invite opened metadata", { inviteId: invite._id, error: err.message });
    });

    // Build safe survey object to return (avoid leaking tenant internal fields)
    const safeSurvey = {
      _id: survey._id,
      title: survey.title,
      description: survey.description,
      questions: survey.questions || [],
      settings: survey.settings || {},
      themeColor: survey.themeColor || null,
      thankYouPage: survey.thankYouPage || null,
      estimatedTime: survey.estimatedTime || null,
      isPasswordProtected: survey.settings?.isPasswordProtected || false
    };

    await Logger.info("verifyInviteToken: invite verified and survey returned", {
      inviteId: invite._id,
      surveyId: survey._id,
      ip: requesterIp
    });

    return res.status(200).json({
      success: true,
      inviteId: invite._id,
      survey: safeSurvey
    });

  } catch (err) {
    await Logger.error("verifyInviteToken: unexpected error", { error: err.message, stack: err.stack });
    return next(err);
  }
};