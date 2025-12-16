// services/ai/aiAnalysisService.js
const SurveyResponse = require("../../models/SurveyResponse");
const Survey = require("../../models/Survey");

const aiAnalyzer = require("../../utils/ai/aiAnalyzer.util");
const insightBuilder = require("../../utils/ai/insightBuilder.util");
const ruleEngine = require("../../utils/ai/ruleEngine.util");
const actionExecutor = require("../../utils/ai/actionExecutor.util");

exports.processResponse = async ({ responseId, tenantId }) => {
  const response = await SurveyResponse.findOne({
    _id: responseId,
    tenant: tenantId
  });

  if (!response) {
    throw new Error("Survey response not found");
  }

  const survey = await Survey.findById(response.survey);

  // 1️⃣ AI ANALYSIS
  const aiResult = await aiAnalyzer.analyzeResponse(response);

  // 2️⃣ BUILD INSIGHT
  const insight = insightBuilder.buildInsight(aiResult, response);

  // 3️⃣ RULE EVALUATION
  const actionsToTrigger = ruleEngine.evaluate(insight);

  // 4️⃣ EXECUTE ACTIONS
  const executedActions = await actionExecutor.execute({
    actions: actionsToTrigger,
    insight,
    response,
    survey,
    tenantId
  });

  return {
    aiResult,
    insight,
    actions: executedActions
  };
};
