// /validators/surveyValidators.js
const Joi = require("joi");

exports.validateSurveyCreate = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    category: Joi.string().allow(""),
    questions: Joi.array().items(Joi.object()).default([]),
    settings: Joi.object().default({}),
    sections: Joi.array().default([]),
    translations: Joi.object().default({}),
  });

  return schema.validate(data);
};

exports.validateSurveyUpdate = (data) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().allow("").optional(),
    category: Joi.string().optional(),
    questions: Joi.array().items(Joi.object()).optional(),
    settings: Joi.object().optional(),
    sections: Joi.array().optional(),
    translations: Joi.object().optional(),
  });

  return schema.validate(data);
};