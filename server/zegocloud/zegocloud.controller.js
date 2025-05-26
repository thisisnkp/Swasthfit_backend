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
  //   const { userId, role } = req.user; // userId and role from JWT payload

  // Fallback for testing
  const userId = req.user?.userId || req.body.from || "test_user";
  const role = req.user?.role || req.body.role || "user";

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ message: "Recipient and message required" });
  }

  const chatRef = admin.database().ref("chats").push();
  const chatMessage = {
    from: userId,
    to,
    message,
    role,
    timestamp: Date.now(),
  };

  await chatRef.set(chatMessage);
  res.json({ status: "Message sent", chatId: chatRef.key });
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  //   const { userId } = req.user; // userId from JWT payload

  // Fallback for testing
  const userId = req.user?.userId || req.query.userId || "test_user";
  const { withUser } = req.query;

  if (!withUser) {
    return res.status(400).json({ message: "withUser query param required" });
  }

  const snapshot = await admin
    .database()
    .ref("chats")
    .orderByChild("timestamp")
    .once("value");
  const chats = [];
  snapshot.forEach((child) => {
    const chat = child.val();
    // Only include messages between these two users (in either direction)
    if (
      (chat.from === userId && chat.to === withUser) ||
      (chat.from === withUser && chat.to === userId)
    ) {
      chats.push(chat);
    }
  });

  res.json({ chats });
};
