// crons/systemSegments.cron.js
const AudienceSegment = require("../models/AudienceSegment");

const SYSTEM_SEGMENTS = [
  {
    key: "inactive_30",
    name: "Inactive (30 Days)",
    query: {
      lastActivity: {
        $lte: new Date(Date.now() - 30 * 86400000),
      },
    },
  },
  {
    key: "new_users",
    name: "New Users (7 Days)",
    query: {
      createdAt: {
        $gte: new Date(Date.now() - 7 * 86400000),
      },
    },
  },
  {
    key: "vip_users",
    name: "VIP Users",
    query: {
      autoTags: { $in: ["VIP"] },
    },
  },
];

async function syncSystemSegments() {
  for (const seg of SYSTEM_SEGMENTS) {
    await AudienceSegment.findOneAndUpdate(
      { key: seg.key, isSystem: true },
      {
        name: seg.name,
        query: seg.query,
        isSystem: true,
      },
      { upsert: true, new: true }
    );
  }
}

module.exports = { syncSystemSegments };