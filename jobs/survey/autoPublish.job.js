// jobs/survey/autoPublish.job.js
const Survey = require("../../models/Survey");
const resolveSurveyRecipients = require("../../utils/resolveSurveyRecipients");
const generateSurveyToken = require("../../utils/generateSurveyToken");
const SurveyInvite = require("../../models/SurveyInvite");
const { sendSurveyWhatsApp } = require("../../controllers/distributionController");
const Logger = require("../../utils/auditLog");

exports.autoPublishScheduledSurveys = async () => {
  try {
    const now = new Date();

    const surveys = await Survey.find({
      status: "scheduled",
      "schedule.startDate": { $lte: now },
      "schedule.autoPublish": true
    }).lean();

    if (!surveys.length) return;

    for (const s of surveys) {
      try {
        const survey = await Survey.findById(s._id);

        // Make active
        survey.status = "active";
        survey.schedule.publishedAt = now;

        // Resolve recipients
        const recipients = await resolveSurveyRecipients(survey);

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

        survey.publishLog.push({
          publishedBy: null,
          method: "cron-auto",
          recipientsCount: created
        });

        await survey.save();

        if (recipients.length) {
          sendSurveyWhatsApp({
            body: { surveyId: survey._id.toString(), recipients },
            tenantId: survey.tenant,
            user: { _id: "cron-system" }
          }).catch(console.error);
        }

        Logger.info("autoPublishCron", "Survey auto-published via CRON", {
          context: { surveyId: survey._id, recipients: created },
          req
        });

      } catch (err) {

        Logger.error("autoPublishCron", "Auto publish failed for one survey", {
          error: err,
          req
        });
      }
    }

  } catch (err) {
    Logger.error("autoPublishCron", "CRON crashed", {
      error: err,
      req
    });
  }
};
