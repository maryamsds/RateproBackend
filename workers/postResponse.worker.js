// workers/postResponse.worker.js
const { postResponseDLQ } = require("../queues/postResponse.dlq");

new Worker(
  POST_RESPONSE_QUEUE,
  async (job) => {
    await processPostSurveyResponse(job.data);
  },
  {
    connection: redis,
    concurrency: 5,
    async onFailed(job, err) {
      await postResponseDLQ.add("failed-response", {
        originalJobId: job.id,
        data: job.data,
        error: err.message,
        failedAt: new Date()
      });

      Logger.error("Job moved to DLQ", {
        jobId: job.id,
        error: err.message
      });
    }
  }
);