// services/responses/invitedResponseService.js
const SurveyInvite = require("../../models/SurveyInvite");
const SurveyResponse = require("../../models/SurveyResponse");
const responseEvents = require("../../utils/events/responseEvents");

exports.handleInvitedResponse = async ({ token, payload }) => {
  const invite = await SurveyInvite.findOne({ token }).populate("survey");

  if (!invite) {
    throw { status: 404, message: "Invalid or expired survey link" };
  }

  if (invite.status === "responded") {
    throw { status: 409, message: "Survey already submitted" };
  }

  const response = await SurveyResponse.create({
    survey: invite.survey._id,
    tenant: invite.tenant,
    user: invite.user || null,
    answers: payload.answers,
    review: payload.review,
    rating: payload.rating,
    score: payload.score,
    isAnonymous: false,
    createdBy: invite.user || null,
  });

  responseEvents.emit("response.created", {
    responseId: response._id,
    surveyId: response.survey,
    tenantId: response.tenant,
    isAnonymous: response.isAnonymous,
  });

  invite.status = "responded";
  invite.respondedAt = new Date();
  await invite.save();

  return response;
};
