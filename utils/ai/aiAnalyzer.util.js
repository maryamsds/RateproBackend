// utils/ai/aiAnalyzer.util.js
const aiClient = require("../aiClient");

exports.analyzeResponse = async (response) => {
  const text = [
    response.review,
    ...(response.answers || []).map(a => a.answer)
  ]
    .filter(Boolean)
    .join(" ");

  if (!text) {
    return {
      sentiment: "neutral",
      urgency: "low",
      summary: ""
    };
  }

  const aiResult = await aiClient.complete({
    prompt: `
Analyze customer feedback and return JSON:

{
  "sentiment": "positive|neutral|negative",
  "urgency": "low|medium|high",
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
      urgency: "low",
      summary: ""
    };
  }
};
