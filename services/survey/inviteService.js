// services/survey/inviteService.js
const SurveyInvite = require("../../models/SurveyInvite");
const generateSurveyToken = require("../../utils/generateSurveyToken");

module.exports.bulkCreateInvites = async (survey, recipients) => {

  let created = 0;

  for (const r of recipients) {
    const exists = await SurveyInvite.findOne({
      survey: survey._id,
      tenant: survey.tenant,
      $or: [
        { "contact.email": r.email },
        { "contact.phone": r.phone }
      ]
    });

    if (exists) continue;

    await SurveyInvite.create({
      survey: survey._id,
      tenant: survey.tenant,
      contact: r,
      token: generateSurveyToken()
    });

    created++;
  }

  return created;
};