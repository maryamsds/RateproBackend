// services/distribution/resolveAudienceService.js
const Contact = require("../../models/ContactManagement");
const Segment = require("../../models/AudienceSegment");

/**
 * Resolve target audience into final unique contact list
 * @param {Object} payload
 * @param {Array} payload.contactIds
 * @param {Array} payload.segmentIds
 * @param {String} payload.tenantId
 */
const resolveAudience = async ({ contactIds = [], segmentIds = [], tenantId }) => {
  console.log("🎯 [resolveAudience] Input:", { contactIds: contactIds.length, segmentIds: segmentIds.length, tenantId });

  const contactsMap = new Map();

  // 1️⃣ Resolve direct contacts
  if (contactIds.length > 0) {
    const contacts = await Contact.find({
      _id: { $in: contactIds },
      tenantId,
      isActive: true,
      email: { $exists: true },
    }).select("_id name email");
    console.log("📇 [resolveAudience] Direct contacts found:", contacts.length);


    contacts.forEach(contact => {
      contactsMap.set(contact.email, contact);
    });
  }

  // 2️⃣ Resolve segment based contacts
  if (segmentIds.length > 0) {
    const segments = await Segment.find({
      _id: { $in: segmentIds },
      tenantId,
    });

    console.log("📊 [resolveAudience] Segments found:", segments.length);


    for (const segment of segments) {
      const segmentContacts = await Contact.find({
        tenantId,
        ...segment.filterCriteria, // dynamic query
        isActive: true,
        email: { $exists: true },
      }).select("_id name email");

      console.log(`📊 [resolveAudience] Segment "${segment.name}" contacts:`, segmentContacts.length);

      segmentContacts.forEach(contact => {
        contactsMap.set(contact.email, contact);
      });
    }
  }
  console.log("🎯 [resolveAudience] Final unique contacts:", contactsMap.size);
  return Array.from(contactsMap.values());
};

module.exports = resolveAudience;