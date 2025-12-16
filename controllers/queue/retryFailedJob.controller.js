// controllers/queue/retryFailedJob.controller.js
const { retryFailedJob } = require("../../services/queue/retryJob.service");

exports.retryJob = async (req, res) => {
  await retryFailedJob(req.params.jobId);
  res.json({ message: "Job retried successfully" });
};