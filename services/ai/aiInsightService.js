// services/ai/aiInsightService.js
const aiClient = require("../../utils/aiClient");

exports.analyzeResponse = async ({ response, survey }) => {
  const text = [
    response.review,
    ...(response.answers || []).map(a => a.answer)
  ]
    .filter(Boolean)
    .join(" ");

  if (!text) {
    return {
      sentiment: "neutral",
      shouldGenerateAction: false,
      urgency: "low"
    };
  }

  const aiResult = await aiClient.complete({
    prompt: `
Analyze customer feedback and return JSON:

{
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
  "shouldGenerateAction": boolean,
  "summary": "short issue summary"
}

Feedback:
"${text}"
    `,
    maxTokens: 200
  });

  try {
    return JSON.parse(aiResult.text);
  } catch {
    return {
      sentiment: "neutral",
      shouldGenerateAction: false,
      urgency: "low"
    };
  }
};