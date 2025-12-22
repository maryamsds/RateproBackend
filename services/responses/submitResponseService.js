// /services/responses/submitResponseService.js
const SurveyInvite = require("../../models/SurveyInvite");
const SurveyResponse = require("../../models/SurveyResponse");
const { processPostSurveyResponse } = require("../postResponse/postResponseProcessor");
const { postResponseQueue } = require("../../queues/postResponse.queue");
const Logger = require("../../utils/auditLog");

exports.submitSurveyResponseService = async ({
  token,
  payload,
  ip,
  user
}) => {
  // 1️⃣ Validate invite
  const invite = await SurveyInvite.findOne({ token }).populate("survey");

  if (!invite) {
    throw new Error("INVALID_INVITE_TOKEN");
  }

  if (invite.status === "responded") {
    throw new Error("SURVEY_ALREADY_SUBMITTED");
  }

  // 2️⃣ Save response
  const response = await SurveyResponse.create({
    survey: invite.survey._id,
    tenant: invite.tenant,
    user: payload.isAnonymous ? null : user?._id,
    createdBy: user?._id,
    answers: payload.answers,
    review: payload.review,
    rating: payload.rating,
    score: payload.score,
    isAnonymous: payload.isAnonymous,
    ip
  });

  // 3️⃣ Update invite
  invite.status = "responded";
  invite.respondedAt = new Date();
  await invite.save();

  await postResponseQueue.add("process-response", {
    response,
    survey: invite.survey,
    tenantId: invite.tenant
  });

  processPostSurveyResponse({
    response,
    survey: invite.survey,
    tenantId: invite.tenant
  });

  Logger.info("surveyResponse", "Survey response submitted", {
    context: {
      surveyId: invite.survey._id,
      responseId: response._id,
      inviteId: invite._id
    },
    req
  });

  return response;
};