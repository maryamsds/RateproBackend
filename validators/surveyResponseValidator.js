// /validators/surveyResponseValidator.js
const Joi = require("joi");

exports.submitResponseSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        answer: Joi.any().required(),
        media: Joi.array().optional()
      })
    )
    .min(1)
    .required(),

  review: Joi.string().allow("", null),
  rating: Joi.number().min(1).max(5).optional(),
  score: Joi.number().min(0).max(100).optional(),
  isAnonymous: Joi.boolean().default(false)
});
