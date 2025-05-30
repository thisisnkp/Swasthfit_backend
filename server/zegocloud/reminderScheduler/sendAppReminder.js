const admin = require("../../config/firebase");

module.exports = async function sendInAppNotification(userId, message) {
  const notifRef = admin.database().ref("notifications").push();
  await notifRef.set({
    userId,
    message,
    timestamp: Date.now(),
  });
};
