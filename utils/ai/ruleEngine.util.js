// utils/ai/ruleEngine.util.js
exports.evaluate = (insight) => {
  const actions = [];

  if (insight.sentiment === "negative" && insight.urgency === "high") {
    actions.push("CREATE_ACTION");
    actions.push("SEND_ALERT");
  }

  if (insight.sentiment === "negative") {
    actions.push("DASHBOARD_FLAG");
  }

  return actions;
};