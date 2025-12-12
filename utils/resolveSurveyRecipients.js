// /utils/resolveSurveyRecipients.js
const Contact = require("../models/ContactManagement");
const User = require("../models/User");

const resolveSurveyRecipients = async (survey) => {
  const { audienceType, categories = [], users = [], contacts = [] } = survey.targetAudience;

  let resolved = [];

  // ✅ CASE 1: ALL
  if (audienceType === "all") {
    const allContacts = await Contact.find({
      tenantId: survey.tenant,
      status: "Active"
    }).lean();

    resolved = allContacts.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone
    }));
  }

  // ✅ CASE 2: CATEGORY
  if (audienceType === "category") {
    const categoryContacts = await Contact.find({
      tenantId: survey.tenant,
      contactCategories: { $in: categories }
    }).lean();

    resolved = categoryContacts.map(c => ({
      name: c.name,
      email: c.email,
      phone: c.phone
    }));
  }

  // ✅ CASE 3: CUSTOM
  if (audienceType === "custom") {
    // internal users
    if (users.length) {
      const internalUsers = await User.find({
        _id: { $in: users },
        tenant: survey.tenant
      }).select("name email").lean();

      resolved.push(
        ...internalUsers.map(u => ({
          name: u.name,
          email: u.email
        }))
      );
    }

    // external contacts
    if (contacts.length) {
      resolved.push(...contacts);
    }
  }

  // ✅ Remove duplicates (email / phone based)
  const uniqueMap = new Map();
  resolved.forEach(r => {
    const key = r.email || r.phone;
    if (key) uniqueMap.set(key, r);
  });

  return [...uniqueMap.values()];
};

module.exports = resolveSurveyRecipients;