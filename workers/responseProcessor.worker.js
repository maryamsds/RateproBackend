// workers/responseProcessor.worker.js
const responseEvents = require("../utils/events/responseEvents");
const SurveyResponse = require("../models/SurveyResponse");
const Survey = require("../models/Survey");
const { analyzeFeedbackSentiment } = require("../services/ai/feedbackAI.service");
const { createActionFromFeedback } = require("../services/actions/actionService");

responseEvents.on("response.created", async (data) => {
  try {
    const response = await SurveyResponse.findById(data.responseId);
    const survey = await Survey.findById(data.surveyId);

    if (!response || !survey) return;

    const analysis = await analyzeFeedbackSentiment(response, survey);

    if (!analysis.shouldGenerateAction) return;

    await createActionFromFeedback({
      analysis,
      response,
      survey,
      tenantId: data.tenantId,
    });

  } catch (err) {
    console.error("Response pipeline failed:", err.message);
  }
});