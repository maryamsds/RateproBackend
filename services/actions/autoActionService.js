// services/actions/autoActionService.js
const Action = require("../../models/Action");

exports.createActionFromInsight = async ({
  insight,
  response,
  survey,
  tenantId
}) => {
  return Action.create({
    title: "Customer Feedback Issue",
    description: insight.summary || "Customer issue detected",
    priority: insight.urgency === "high" ? "high" : "medium",
    category: "Survey Feedback",
    tenant: tenantId,
    metadata: {
      surveyId: survey._id,
      responseId: response._id
    },
    tags: ["auto", "survey"]
  });
};