// queues/postResponse.dlq.js
const { Queue } = require("bullmq");
const redis = require("../config/redis");

const POST_RESPONSE_DLQ = "post-response-dlq";

const postResponseDLQ = new Queue(POST_RESPONSE_DLQ, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: false
  }
});

module.exports = {
  postResponseDLQ,
  POST_RESPONSE_DLQ
};
