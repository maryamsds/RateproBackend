// jobs/retagInactiveContacts.job.js

const Contact = require("../models/ContactManagement");
const { deriveAutoTags } = require("../services/audience/taggingService");

const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

async function retagInactiveContacts() {
  const cutoff = new Date(Date.now() - DAYS_30);

  const cursor = Contact.find({
    lastActivity: { $lte: cutoff },
  }).cursor();

  let processed = 0;

  for await (const contact of cursor) {
    const autoTags = deriveAutoTags(contact);

    const merged = new Set([
      ...(contact.tags || []),
      ...autoTags,
    ]);

    contact.tags = Array.from(merged);
    contact.autoTags = autoTags;

    await contact.save();
    processed++;
  }

  console.log(`🔁 Retagged inactive contacts: ${processed}`);
}

module.exports = retagInactiveContacts;
