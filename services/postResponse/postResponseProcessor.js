// services/postResponse/postResponseProcessor.js
const analyticsService = require("../analytics/analyticsService");
const aiInsightService = require("../ai/aiInsightService");
const autoActionService = require("../actions/autoActionService");
const notificationService = require("../notifications/notificationService");
const Logger = require("../../utils/auditLog");

exports.processPostSurveyResponse = async ({
  response,
  survey,
  tenantId
}) => {
  try {
    Logger.info("Post-response processing started", {
      responseId: response._id,
      surveyId: survey._id
    });

    // 🔹 1. Analytics (non-blocking)
    analyticsService
      .updateSurveyAnalytics({ response, survey })
      .catch(err =>
        Logger.error("Analytics update failed", { err: err.message })
      );

    // 🔹 2. AI Insight
    const insight = await aiInsightService.analyzeResponse({
      response,
      survey
    });

    // 🔹 3. Auto Action (conditional)
    if (insight.shouldGenerateAction) {
      const action = await autoActionService.createActionFromInsight({
        insight,
        response,
        survey,
        tenantId
      });

      // 🔹 4. Notify managers if urgent
      if (action.priority === "high") {
        notificationService.notifyUrgentAction(action).catch(() => {});
      }
    }

    Logger.info("Post-response processing completed", {
      responseId: response._id
    });

  } catch (error) {
    Logger.error("Post-response processor crashed", {
      error: error.message,
      stack: error.stack
    });
  }
};
