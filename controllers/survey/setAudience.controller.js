// controllers/survey/setAudience.controller.js
const audienceService = require("../../services/survey/audienceService");
const { validateAudiencePayload } = require("../../validators/audienceValidator");
const Logger = require("../../utils/auditLog");

module.exports = async function setAudience(req, res, next) {
  try {
    const { surveyId } = req.params;
    const payload = req.body;

    // 1) Joi validation
    const { error } = validateAudiencePayload(payload);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 2) Delegate logic to service layer
    const updated = await audienceService.updateSurveyAudience({
      tenantId: req.user.tenant,
      userId: req.user._id,
      surveyId,
      payload,
    });

    Logger.info("audience_set", "Survey target audience set", {
      context: {
        surveyId,
        tenantId: req.user.tenant,
        updatedBy: req.user._id
      },
      req
    });

    res.json({
      message: "Target audience updated",
      targetAudience: updated.targetAudience,
    });

  } catch (err) {
    Logger.error("audience_set", "Failed to set audience", {
      error: err,
      context: { surveyId, tenantId: req.user.tenant },
      req
    });
    next(err);
  }
};