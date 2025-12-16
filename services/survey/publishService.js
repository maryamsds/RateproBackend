// services/survey/publishService.js
const Survey = require("../../models/Survey");
const inviteService = require("./inviteService");
const resolveRecipientsService = require("./resolveRecipientsService");

module.exports.publish = async (surveyId, tenantId, userId) => {
  // Load survey
  const survey = await Survey.findOne({
    _id: surveyId,
    tenant: tenantId,
    status: "draft",
    deleted: false
  });

  if (!survey) {
    throw new Error("Survey not found or already published");
  }

  // Resolve recipients
  const recipients = await resolveRecipientsService.resolve(survey);

  if (!recipients.length) {
    throw new Error("No recipients found for this survey");
  }

  // Create invites
  const invitesCreated = await inviteService.bulkCreateInvites(
    survey,
    recipients
  );

  // Update survey data
  survey.status = "active";
  survey.schedule = survey.schedule || {};
  survey.schedule.publishedAt = new Date();

  survey.publishLog.push({
    publishedBy: userId,
    method: "manual",
    recipientsCount: invitesCreated,
    timestamp: new Date()
  });

  await survey.save();

  return {
    message: "Survey published successfully",
    invitesCreated
  };
};