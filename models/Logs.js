const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
    default: 'INFO',
    index: true
  },

  functionName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  message: {
    type: String,
    required: true
  },

  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },

  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    index: true
  },

  ipAddress: String,
  userAgent: String,

  stackTrace: String

}, { timestamps: true });

module.exports = mongoose.model('AuditLog', logSchema);
