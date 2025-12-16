// validators/audienceValidator.js
const Joi = require("joi");

exports.validateAudiencePayload = (data) => {
  const schema = Joi.object({
    audienceType: Joi.string()
      .valid("all", "category", "custom")
      .required(),

    categories: Joi.array().items(Joi.string()).optional(),

    users: Joi.array().items(Joi.string()).optional(),

    contacts: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().allow(""),
          phone: Joi.string().allow(""),
        })
      )
      .optional(),
  });

  return schema.validate(data);
};
