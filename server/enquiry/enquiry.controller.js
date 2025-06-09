const EnquiryMessage = require("./enquiryMessages.model");
const Trainer = require("../user/models/trainer.model");
const Gym = require("../gym/gym_owners/gym.model");

// Send a new enquiry message (user or vender)
exports.sendEnquiryMessage = async (req, res) => {
  try {
    const { vender_type, vender_id, message } = req.body;
    const user_id = req.user.id ?? req.user.userId;
    const user_type = req.user.user_type ?? req.user.userType;

    if (!vender_type || vender_id === undefined || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: vender_type, vender_id, or message.",
      });
    }

    // Validate vender_id based on vender_type
    if (vender_type.toLowerCase() === "trainer") {
      const trainer = await Trainer.findOne({ where: { user_id: vender_id } });
      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer not found with the given vender_id.",
        });
      }
    } else if (vender_type.toLowerCase() === "gym") {
      const gym = await Gym.findOne({ where: { id: vender_id } });
      if (!gym) {
        return res.status(404).json({
          success: false,
          message: "Gym not found with the given vender_id.",
        });
      }
    }

    // Determine send and is_reply flags based on user_type
    // If user_type is 'user' or similar, send=1, is_reply=0
    // If user_type is vender (gym, trainer, dietitian), send=0, is_reply=1
    let sendFlag = 1;
    let isReplyFlag = 0;
    if (
      user_type &&
      (user_type.toLowerCase() === "gym" ||
        user_type.toLowerCase() === "trainer" ||
        user_type.toLowerCase() === "dietitian")
    ) {
      sendFlag = 0;
      isReplyFlag = 1;
    }

    const newMessage = await EnquiryMessage.create({
      user_id,
      vender_type,
      vender_id,
      send: sendFlag,
      is_reply: isReplyFlag,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending enquiry message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending enquiry message.",
    });
  }
};

// Get enquiry messages for a user or vender
exports.getEnquiryMessages = async (req, res) => {
  try {
    const { user_id, vender_type, vender_id } = req.query;

    if (user_id === undefined && (!vender_type || vender_id === undefined)) {
      return res.status(400).json({
        success: false,
        message:
          "Provide user_id or vender_type and vender_id to fetch messages.",
      });
    }

    const whereClause = {};

    if (user_id !== undefined) {
      whereClause.user_id = user_id;
    }

    if (vender_type && vender_id !== undefined) {
      whereClause.vender_type = vender_type;
      whereClause.vender_id = vender_id;
    }

    const messages = await EnquiryMessage.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching enquiry messages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching enquiry messages.",
    });
  }
};

exports.replyEnquiryMessage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing in request.",
      });
    }

    console.log("User info from token:", req.user);
    console.log("Request body:", req.body);

    const { vender_type, vender_id, message } = req.body;
    const user_id = req.user.id ?? req.user.userId;
    const user_type = req.user.user_type ?? req.user.userType;

    if (!vender_type || vender_id === undefined || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: vender_type, vender_id, or message.",
      });
    }

    // Validate vender_id based on vender_type
    if (vender_type.toLowerCase() === "trainer") {
      const trainer = await Trainer.findOne({ where: { user_id: vender_id } });
      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer not found with the given vender_id.",
        });
      }
    } else if (vender_type.toLowerCase() === "gym") {
      const gym = await Gym.findOne({ where: { id: vender_id } });
      if (!gym) {
        return res.status(404).json({
          success: false,
          message: "Gym not found with the given vender_id.",
        });
      }
    }

    // When replying, send = 0, is_reply = 1 if sender is vender
    // send = 1, is_reply = 0 if sender is user
    let sendFlag = 0;
    let isReplyFlag = 1;
    if (
      user_type &&
      (user_type.toLowerCase() === "user" ||
        user_type.toLowerCase() === "customer")
    ) {
      sendFlag = 1;
      isReplyFlag = 0;
    }

    try {
      const newReply = await EnquiryMessage.create({
        user_id,
        vender_type,
        vender_id,
        send: sendFlag,
        is_reply: isReplyFlag,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Reply sent successfully.",
        data: newReply,
      });
    } catch (dbError) {
      console.error("Sequelize create error:", dbError);
      res.status(500).json({
        success: false,
        message: "Database error while replying to enquiry message.",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Error replying to enquiry message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while replying to enquiry message.",
    });
  }
};
