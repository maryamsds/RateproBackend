// controllers/responses/submitAnonymousResponse.controller.js
const { submitResponseSchema } = require("../../validators/responseValidator");
const { handleAnonymousResponse } = require("../../services/responses/anonymousResponseService");

exports.submitAnonymousResponse = async (req, res, next) => {
  try {
    const { error, value } = submitResponseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const response = await handleAnonymousResponse({
      surveyId: req.params.surveyId,
      payload: value,
      ip: req.ip,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      responseId: response._id,
    });
  } catch (err) {
    next(err);
  }
};