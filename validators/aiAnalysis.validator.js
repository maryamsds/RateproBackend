// validators/aiAnalysis.validator.js
const Joi = require("joi");

exports.analyzeResponseSchema = Joi.object({
  responseId: Joi.string().required()
});
