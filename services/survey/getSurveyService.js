// services/survey/getSurveyService.js
const mongoose = require("mongoose");
const Survey = require("../../models/Survey");

exports.getSurveyByIdService = async ({ surveyId, tenantId }) => {
  if (!mongoose.Types.ObjectId.isValid(surveyId)) {
    return null;
  }

  return Survey.findOne({
    _id: surveyId,
    tenant: tenantId,
    deleted: false,
  })
    .populate("createdBy", "name email")
    .lean();
};
