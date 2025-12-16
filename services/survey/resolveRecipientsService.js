// services/survey/resolveRecipientsService.js
const User = require("../../models/User");

module.exports.resolve = async (survey) => {
  const audience = survey.targetAudience;
  let recipients = [];

  if (!audience) return [];

  switch (audience.audienceType) {

    case "all":
      recipients = await User.find({ tenant: survey.tenant })
        .select("email phone")
        .lean();
      break;

    case "category":
      recipients = await User.find({
        tenant: survey.tenant,
        category: { $in: audience.categories }
      }).select("email phone").lean();
      break;

    case "custom":
      const users = await User.find({
        _id: { $in: audience.users },
        tenant: survey.tenant
      }).select("email phone").lean();

      const contacts = audience.contacts || [];

      recipients = [...users, ...contacts];
      break;

    default:
      return [];
  }

  // Normalize format
  return recipients
    .map(r => ({
      email: r.email || null,
      phone: r.phone || null
    }))
    .filter(r => r.email || r.phone);
};