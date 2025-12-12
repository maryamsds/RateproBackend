// RateproBackend/models/SurveyInvites.js
const mongoose = require("mongoose");

const surveyInviteSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
    index: true
  },

  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  // Recipient (only ONE will be filled)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  contact: {
    name: String,
    email: String,
    phone: String
  },

  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  status: {
    type: String,
    enum: ["sent", "opened", "responded"],
    default: "sent"
  },

  respondedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("SurveyInvite", surveyInviteSchema);
