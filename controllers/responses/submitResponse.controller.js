const { submitResponseSchema } = require("../../validators/surveyResponseValidator");
const { submitSurveyResponseService } = require("../../services/responses/submitResponseService");

exports.submitSurveyResponse = async (req, res, next) => {
  try {
    const { token } = req.params;

    // 1️⃣ Validate payload
    const { error, value } = submitResponseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // 2️⃣ Submit response
    await submitSurveyResponseService({
      token,
      payload: value,
      ip: req.ip,
      user: req.user
    });

    res.status(201).json({
      message: "Survey response submitted successfully"
    });

  } catch (err) {
    if (err.message === "INVALID_INVITE_TOKEN") {
      return res.status(404).json({ message: "Invalid or expired survey link" });
    }

    if (err.message === "SURVEY_ALREADY_SUBMITTED") {
      return res.status(409).json({ message: "Survey already submitted" });
    }

    next(err);
  }
};
