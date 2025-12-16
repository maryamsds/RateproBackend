// services/survey/responsePipelines/sentimentPipeline.js
const SurveyResponse = require("../../../models/SurveyResponse");
const Survey = require("../../../models/Survey");
const aiClient = require("../../../utils/aiClient");
const Logger = require("../../../utils/auditLog");

module.exports.start = async (responseId) => {
  const response = await SurveyResponse.findById(responseId);
  const survey = await Survey.findById(response.survey);

  if (!response) return;

  const feedbackText = (response.answers || [])
    .map(a => a.answer)
    .join(" ");

  if (!feedbackText.trim()) return;

  await Logger.info("AI sentiment analysis started", {
    responseId,
    surveyId: survey._id
  });

  const ai = await aiClient.complete({
    contents: [{ parts: [{ text: feedbackText }]}],
    maxTokens: 300
  });

  let analysis = {};

  try {
    analysis = JSON.parse(ai.text);
  } catch (e) {
    analysis = { sentiment: "neutral" };
  }

  response.sentiment = analysis.sentiment || "neutral";
  response.sentimentMeta = analysis;
  await response.save();

  await Logger.info("AI sentiment updated", {
    responseId,
    sentiment: response.sentiment
  });
};