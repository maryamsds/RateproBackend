// controllers/survey/submitResponse.controller.js
const responseService = require("../../services/survey/responseService");
const Logger = require("../../utils/auditLog");

exports.submitSurveyResponse = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { answers } = req.body;

    const result = await responseService.processResponse(token, answers);

    await Logger.info("Survey response submitted successfully", {
      token,
      responseId: result.responseId
    });

    res.status(200).json({
      message: "Response submitted successfully",
      ...result
    });

  } catch (err) {
    next(err);
  }
};