// models/AudienceSegment.js
const mongoose = require("mongoose");

const AudienceSegmentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  name: { type: String, required: true },
  description: String,

  // 🔥 This is the brain
  query: {
    type: Object,
    required: true,
  },

  isSystem: {
    type: Boolean,
    default: false, // system vs user-created
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AudienceSegment", AudienceSegmentSchema);
