// controllers/survey/toggleStatus.controller.js
const { toggleSurveyStatusService } = require("../../services/survey/toggleSurveyStatusService");
const Logger = require("../../utils/auditLog");

exports.toggleSurveyStatus = async (req, res, next) => {
  try {
    const survey = await toggleSurveyStatusService({
      surveyId: req.params.id,
      tenantId: req.user.tenant,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({
      message: `Survey is now ${survey.status}`,
      status: survey.status,
    });
  } catch (err) {
    Logger.error("toggleSurveyStatus", "Error toggling survey status", {
      error: err,
      req
    });
    next(err);
  }
};
