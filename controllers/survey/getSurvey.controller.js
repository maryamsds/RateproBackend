// controllers/survey/getSurvey.controller.js
const { getSurveyByIdService } = require("../../services/survey/getSurveyService");
const Logger = require("../../utils/auditLog");

exports.getSurveyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Logger.info("getSurveyById: request received", {
      surveyId: id,
      userId: req.user?._id,
      tenantId: req.user?.tenant,
    });

    const survey = await getSurveyByIdService({
      surveyId: id,
      tenantId: req.user.tenant,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({ survey });
  } catch (err) {
    await Logger.error("getSurveyById: error", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};
