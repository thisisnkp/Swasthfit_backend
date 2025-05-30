const crypto = require("crypto");
const admin = require("../config/firebase");

// Generate ZEGOCLOUD RTC token
exports.getZegoToken = (req, res) => {
  //   const { userId } = req.user;  // userId from JWT payload
  const userId = req.user?.userId || req.query.userId || "test_user"; // Fallback for testing
  const appId = process.env.ZEGO_APP_ID;
  const serverSecret = process.env.ZEGO_SERVER_SECRET;
  const effectiveTimeInSeconds = 3600; // 1 hour

  if (!userId) {
    return res.status(400).json({ message: "User ID missing in token" });
  }

  // ZEGOCLOUD token generation logic
  const payload = {
    app_id: Number(appId),
    user_id: userId,
    nonce: Math.floor(Math.random() * 1000000),
    ctime: Math.floor(Date.now() / 1000),
    expire: effectiveTimeInSeconds,
  };
  const payloadStr = JSON.stringify(payload);
  const hash = crypto
    .createHmac("sha256", serverSecret)
    .update(payloadStr)
    .digest("hex");
  const token = Buffer.from(`${payloadStr}.${hash}`).toString("base64");

  res.json({ token });
};

// Send a chat message (store in Firebase)
exports.sendMessage = async (req, res) => {
  const { id, user_type } = req.user || {};

  if (!id) {
    return res.status(400).json({ message: "User ID missing in token" });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ message: "Recipient and message required" });
  }

  // Set user_type explicitly to 'user' or 'trainer'
  let safeUserType = "user";
  if (
    user_type &&
    (user_type.toLowerCase() === "trainer" || user_type === "trainer")
  ) {
    safeUserType = "trainer";
  }

  const chatRef = admin.database().ref("chats").push();
  const chatMessage = {
    from: id,
    to,
    message,
    user_type: safeUserType,
    timestamp: Date.now(),
  };

  try {
    await chatRef.set(chatMessage);
    res.json({ status: "Message sent", chatId: chatRef.key });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  const userId = req.user?.id || req.user?.userId;
  const toUserId = req.query.to;

  if (!toUserId) {
    return res.status(400).json({ message: "'to' query param required" });
  }

  try {
    const snapshot = await admin
      .database()
      .ref("chats")
      .orderByChild("timestamp")
      .once("value");

    const chats = [];
    snapshot.forEach((child) => {
      const chat = child.val();
      if (
        (chat.from === userId && chat.to === toUserId) ||
        (chat.from === toUserId && chat.to === userId)
      ) {
        chats.push(chat);
      }
    });

    res.json({ chats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

// Schedule a meeting
exports.endMeeting = async (req, res) => {
  const { channelName } = req.body;
  const channel = await Channel.findOne({ where: { channelName } });

  if (!channel || channel.status !== "active") {
    return res
      .status(400)
      .json({ success: false, message: "Meeting not active or not found" });
  }

  channel.status = "completed";
  await channel.save();

  res.json({ success: true, message: "Meeting marked as completed" });
};

// Cancel a meeting
exports.cancelMeeting = async (req, res) => {
  const { channelName } = req.body;
  const channel = await Channel.findOne({ where: { channelName } });
  if (!channel || channel.status === "cancelled") {
    return res.status(404).json({
      success: false,
      message: "Meeting not found or already cancelled",
    });
  }
  channel.status = "cancelled";
  await channel.save();

  // Optionally notify participants
  await sendInAppNotification(
    channel.participant1,
    `Meeting ${channel.channelName} has been cancelled`
  );
  await sendInAppNotification(
    channel.participant2,
    `Meeting ${channel.channelName} has been cancelled`
  );

  res.json({ success: true, message: "Meeting cancelled" });
};
