// controllers/survey/deleteSurvey.controller.js
const Survey = require("../../models/Survey");
const Logger = require("../../utils/auditLog");

module.exports = async function deleteSurvey(req, res, next) {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findOne({
      _id: surveyId,
      tenant: req.user.tenant,
      deleted: false,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    survey.deleted = true;
    survey.status = "inactive";

    await survey.save();

    await Logger.info("survey_delete", "Survey deleted (soft)", {
      surveyId,
      tenant: req.user.tenant,
      deletedBy: req.user._id,
    });

    res.json({ message: "Survey deleted" });

  } catch (err) {
    await Logger.error("survey_delete_error", "Survey delete failed", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};