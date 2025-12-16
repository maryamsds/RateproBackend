// controllers/analytics/getAnalytics.controller.js
const Logger = require("../../utils/auditLog");
const { analyticsValidator } = require("../../validators/analyticsValidator");
const { getAnalyticsService } = require("../../services/analytics/analyticsService");

exports.getAnalytics = async (req, res, next) => {
  try {
    // Validation
    const { error } = analyticsValidator.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { surveyId } = req.params;

    // Service layer
    const analytics = await getAnalyticsService(surveyId);

    await Logger.info("Analytics generated", {
      surveyId,
      totalResponses: analytics.totalResponses
    });

    res.json(analytics);
  } catch (err) {
    await Logger.error("Analytics error", {
      message: err.message,
      stack: err.stack,
    });
    next(err);
  }
};