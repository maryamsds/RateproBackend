// services/survey/audienceService.js
const Survey = require("../../models/Survey");

exports.updateSurveyAudience = async ({
  tenantId,
  userId,
  surveyId,
  payload
}) => {

  const survey = await Survey.findOne({
    _id: surveyId,
    tenant: tenantId,
    deleted: false
  });

  if (!survey) {
    throw new Error("Survey not found");
  }

  // ❌ Anonymous survey cannot target internal users
  if (survey.settings?.isAnonymous && payload.users?.length > 0) {
    throw new Error("Anonymous surveys cannot target internal users.");
  }

  let finalAudience = {
    audienceType: payload.audienceType,
    categories: [],
    users: [],
    contacts: []
  };

  // 🎯 A) All → No categories, no users, no contacts
  if (payload.audienceType === "all") {
    finalAudience = { audienceType: "all", categories: [], users: [], contacts: [] };
  }

  // 🎯 B) Category-Based
  else if (payload.audienceType === "category") {
    finalAudience.categories = payload.categories || [];
  }

  // 🎯 C) Custom
  else if (payload.audienceType === "custom") {
    finalAudience.users = payload.users || [];
    finalAudience.contacts = payload.contacts || [];
  }

  // Update document
  survey.targetAudience = finalAudience;

  await survey.save();

  return survey;
};