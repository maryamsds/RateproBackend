// services/survey/toggleSurveyStatus.service.js
const Survey = require("../../models/Survey");

exports.toggleSurveyStatusService = async ({ surveyId, tenantId }) => {
  const survey = await Survey.findOne({
    _id: surveyId,
    tenant: tenantId,
    deleted: false,
  });

  if (!survey) return null;

  survey.status = survey.status === "active" ? "inactive" : "active";
  await survey.save();

  return survey;
};