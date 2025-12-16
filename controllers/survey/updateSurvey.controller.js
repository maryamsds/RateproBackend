// controllers/survey/updateSurvey.controller.js
const Survey = require("../../models/Survey");
const { validateSurveyUpdate } = require("../../validators/surveyValidator");
const Logger = require("../../utils/auditLog");

module.exports = async function updateSurvey(req, res, next) {
  try {
    const { surveyId } = req.params;

    const { error } = validateSurveyUpdate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const survey = await Survey.findOne({
      _id: surveyId,
      tenant: req.user.tenant,
      deleted: false,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    // Prevent editing published surveys unless it's draft/scheduled
    if (survey.status === "active") {
      return res.status(400).json({
        message: "Published surveys cannot be edited",
      });
    }

    Object.assign(survey, req.body);

    await survey.save();

    await Logger.info("survey_update", "Survey updated successfully", {
      surveyId,
      tenant: req.user.tenant,
      updatedBy: req.user._id,
    });

    res.json({
      message: "Survey updated",
      survey,
    });

  } catch (err) {
    await Logger.error("survey_update_error", "Survey update failed", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};
