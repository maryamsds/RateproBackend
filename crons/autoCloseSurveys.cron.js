// crons/autoCloseSurveys.cron.js
const Survey = require("../models/Survey");
const Logger = require("../utils/auditLog");

exports.autoCloseSurveys = async () => {
  const now = new Date();

  const result = await Survey.updateMany(
    {
      status: "active",
      "schedule.endDate": { $lte: now },
      deleted: false
    },
    {
      $set: { status: "closed" }
    }
  );

  if (result.modifiedCount > 0) {
    Logger.info("autoCloseSurveys", `Auto-closed ${result.modifiedCount} surveys`, {
      context: { closedCount: result.modifiedCount }
    });
  }
};