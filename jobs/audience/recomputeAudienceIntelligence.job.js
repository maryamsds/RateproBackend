// jobs/audience/recomputeAudienceIntelligence.job.js
const Contact = require("../../models/ContactManagement");
const { enrichContact } = require("../../services/audience/enrichmentService");
const { deriveAutoTags, mergeTags } = require("../../services/audience/taggingService");
const Logger = require("../../utils/auditLog");

const BULK_SIZE = 500;

async function recomputeAudienceIntelligence() {
  let processed = 0;
  let updated = 0;
  const ops = [];

  try {
    const cursor = Contact.find({}).lean().cursor();

    for await (const contact of cursor) {
      processed += 1;

      const enrichment = enrichContact(contact);
      const autoTags = deriveAutoTags(contact);
      const { mergedString, mergedArray } = mergeTags(contact.tags, autoTags);

      ops.push({
        updateOne: {
          filter: { _id: contact._id },
          update: {
            $set: {
              enrichment,
              autoTags: mergedArray,
              tags: mergedString,
            },
          },
        },
      });

      if (ops.length >= BULK_SIZE) {
        const res = await Contact.bulkWrite(ops);
        updated += res.modifiedCount || 0;
        ops.length = 0;
      }
    }

    if (ops.length) {
      const res = await Contact.bulkWrite(ops);
      updated += res.modifiedCount || 0;
    }

    Logger.info("audienceIntelligenceCron", "Nightly audience intelligence refresh completed", {
      context: { processed, updated },
      req
    });

    return { processed, updated };
  } catch (err) {
    Logger.error("audienceIntelligenceCron", "Nightly audience intelligence refresh failed", {
      error: err,
      req
    });
    throw err;
  }
}

module.exports = {
  recomputeAudienceIntelligence,
};
