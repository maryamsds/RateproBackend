// utils/ai/actionExecutor.util.js
const Action = require("../../models/Action");

exports.execute = async ({
  actions,
  insight,
  response,
  survey,
  tenantId
}) => {
  const results = [];

  for (const action of actions) {
    if (action === "CREATE_ACTION") {
      const created = await Action.create({
        title: "Customer Feedback Issue",
        description: insight.summary || "Issue detected via AI",
        priority: insight.urgency === "high" ? "high" : "medium",
        tenant: tenantId,
        metadata: {
          surveyId: survey._id,
          responseId: response._id
        },
        tags: ["ai", "survey"]
      });

      results.push({ action, status: "done", id: created._id });
    }

    if (action === "SEND_ALERT") {
      // future: email / slack / webhook
      results.push({ action, status: "queued" });
    }

    if (action === "DASHBOARD_FLAG") {
      results.push({ action, status: "flagged" });
    }
  }

  return results;
};
