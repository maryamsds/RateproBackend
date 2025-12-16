// services/queue/retryJobService.js
const { postResponseQueue } = require("../../queues/postResponse.queue");
const { postResponseDLQ } = require("../../queues/postResponse.dlq");

exports.retryFailedJob = async (jobId) => {
  const job = await postResponseDLQ.getJob(jobId);
  if (!job) throw new Error("Job not found in DLQ");

  await postResponseQueue.add("retry-response", job.data);
  await job.remove();

  return true;
};