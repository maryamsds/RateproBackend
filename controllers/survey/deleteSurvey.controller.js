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

    Logger.info("survey_delete", "Survey soft-deleted", {
      context: {
        surveyId,
        tenantId: req.user.tenant,
        deletedBy: req.user._id
      },
      req
    });

    res.json({ message: "Survey deleted" });

  } catch (err) {
    Logger.error("survey_delete", "Survey delete failed", {
      error: err,
      context: { tenantId: req.user.tenant },
      req
    });
    next(err);
  }
};