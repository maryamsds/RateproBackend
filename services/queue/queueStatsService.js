// services/queue/queueStatsServices.js
const { postResponseQueue } = require("../../queues/postResponse.queue");

exports.getPostResponseQueueStats = async () => {
  const counts = await postResponseQueue.getJobCounts();

  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
    delayed: counts.delayed
  };
};
