// controllers/queue/getQueueStats.controller.js
const { getPostResponseQueueStats } = require("../../services/queue/queueStats.service");

exports.getQueueStats = async (req, res) => {
  const stats = await getPostResponseQueueStats();
  res.json({ queue: "post-response", stats });
};