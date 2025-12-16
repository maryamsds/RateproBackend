// services/notifications/notificationService.js
exports.notifyUrgentAction = async (action) => {
  // future: email, sms, push, slack
  console.log("🚨 URGENT ACTION:", action.title);
};
