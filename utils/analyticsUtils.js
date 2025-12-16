// utils/analyticsUtils.js
exports.calculateNPS = (responses) => {
  if (!responses.length) return { score: 0, promoters: 0, detractors: 0, passives: 0 };

  let promoters = 0, detractors = 0, passives = 0;

  responses.forEach(r => {
    const score = Number(r.npsScore);
    if (score >= 9) promoters++;
    else if (score <= 6) detractors++;
    else passives++;
  });

  const nps = ((promoters - detractors) / responses.length) * 100;

  return {
    score: Number(nps.toFixed(2)),
    promoters,
    detractors,
    passives
  };
};

exports.generateSentimentHeatmap = (responses) => {
  // Example simplified version
  return responses.map(r => ({
    questionId: r.questionId,
    sentiment: r.sentiment || "neutral",
    score: r.sentimentScore || 0
  }));
};

exports.generateTrendline = (responses) => {
  const data = {};

  responses.forEach(r => {
    const date = r.createdAt.toISOString().split("T")[0];
    if (!data[date]) data[date] = 0;
    data[date]++;
  });

  return Object.entries(data).map(([date, count]) => ({ date, count }));
};