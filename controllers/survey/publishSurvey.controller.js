// controllers/survey/publishSurvey.controller.js
const publishService = require("../../services/survey/publishService");
const Logger = require("../../utils/auditLog");

exports.publishSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    const tenantId = req.user.tenant;
    const userId = req.user._id;

    const result = await publishService.publish(surveyId, tenantId, userId);

    Logger.info("survey_publish", "Survey published successfully", {
      context: {
        surveyId,
        invitesCreated: result.invitesCreated,
        userId
      },
      req
    });

    res.status(200).json(result);
  } catch (err) {
    Logger.error("survey_publish", "Error publishing survey", {
      error: err,
      context: { surveyId: req.params.surveyId, tenantId: req.user.tenant },
      req
    });
    next(err);
  }
};