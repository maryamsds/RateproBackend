// controllers/ai/aiAnalysis.controller.js
const aiAnalysisService = require("../../services/ai/aiAnalysisService");

exports.analyzeSurveyResponse = async (req, res, next) => {
  try {
    const { responseId } = req.body;
    const tenantId = req.user.tenantId;

    const result = await aiAnalysisService.processResponse({
      responseId,
      tenantId
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};