// validators/analyticsValidator.js
const Joi = require("joi");

exports.analyticsValidator = Joi.object({
  surveyId: Joi.string().hex().length(24).required(),
});