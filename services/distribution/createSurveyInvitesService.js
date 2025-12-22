// services/distribution/createSurveyInvitesService.js
const crypto = require("crypto");
const SurveyInvite = require("../../models/SurveyInvite");

const INVITE_EXPIRY_DAYS = 30;

const createSurveyInvites = async ({
  surveyId,
  tenantId,
  distributionId, // optional, future use
  contacts = [],
}) => {
  const invites = [];
  console.log("📝 [createSurveyInvites] Starting", { surveyId, tenantId, contactCount: contacts.length });


  for (const contact of contacts) {
    const token = crypto.randomBytes(32).toString("hex");

    console.log(`📝 [createSurveyInvites] Creating invite for: ${contact.email}`);

    const invite = await SurveyInvite.create({
      survey: surveyId,
      tenant: tenantId,
      contact: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
      },
      token,
      expiresAt: new Date(
        Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ),
    });

    invites.push(invite);
  }
  console.log("📝 [createSurveyInvites] Total invites created:", invites.length);
  return invites;
};

module.exports = createSurveyInvites;