// utils/ai/insightBuilder.util.js
exports.buildInsight = (aiResult, response) => {
  return {
    sentiment: aiResult.sentiment,
    urgency: aiResult.urgency,
    summary: aiResult.summary,
    responseId: response._id,
    createdAt: new Date()
  };
};
