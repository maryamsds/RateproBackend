// controllers/survey/publishSurvey.controller.js
const publishService = require("../../services/survey/publishService");
const Logger = require("../../utils/auditLog");

exports.publishSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params; // For draft publish
    
    // ✅ FIX: Accept survey data directly from body (not req.body.survey)
    // Frontend sends complete survey object in body
    const surveyData = req.body && Object.keys(req.body).length > 0 ? req.body : null;
    
    const tenantId = req.user.tenant?._id || req.user.tenant;
    const userId = req.user._id;

    console.log("🚀 [PUBLISH START]", { 
      surveyId, 
      hasSurveyData: !!surveyData,
      bodyKeys: surveyData ? Object.keys(surveyData) : [],
      tenantId: tenantId?.toString(), 
      userId: userId?.toString() 
    });

    // Validate: at least one must be provided
    if (!surveyId && !surveyData) {
      return res.status(400).json({ 
        message: "Either surveyId (in URL) or survey data (in body) is required" 
      });
    }

    const result = await publishService.publish({
      surveyId,
      surveyData,
      tenantId,
      userId
    });

    Logger.info("survey_publish", "Survey published successfully", {
      context: {
        surveyId: result.surveyId,
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