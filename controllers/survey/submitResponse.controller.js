// controllers/survey/submitResponse.controller.js
const responseService = require("../../services/survey/responseService");
const Logger = require("../../utils/auditLog");

exports.submitSurveyResponse = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { answers } = req.body;

    const result = await responseService.processResponse(token, answers);

    Logger.info("surveyResponse", "Survey response submitted successfully", {
      context: { token, responseId: result.responseId },
      req
    });

    res.status(200).json({
      message: "Response submitted successfully",
      ...result
    });

  } catch (err) {
    Logger.error("surveyResponse", "Error submitting survey response", {
      error: err,
      context: { token: req.params.token },
      req
    });
    next(err);
  }
};