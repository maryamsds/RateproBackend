// validators/survey/scheduleValidator.js
const Joi = require("joi");

exports.scheduleValidator = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
  timezone: Joi.string().optional(),
  autoPublish: Joi.boolean().optional(),
  repeat: Joi.object({
    enabled: Joi.boolean().default(false),
    frequency: Joi.string().valid("none", "daily", "weekly", "monthly").default("none")
  }).optional()
});