// controllers/survey/publishSurvey.controller.js
const publishService = require("../../services/survey/publishService");
const Logger = require("../../utils/auditLog");

exports.publishSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    const tenantId = req.user.tenant;
    const userId = req.user._id;

    const result = await publishService.publish(surveyId, tenantId, userId);

    await Logger.info("Survey published successfully", {
      surveyId,
      invitesCreated: result.invitesCreated,
      userId
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};