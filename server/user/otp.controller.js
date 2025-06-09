const otpModel = require("./models/otp.model");
const User = require("./models/user.model");
const nodemailer = require("nodemailer");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const Otp = otpModel(sequelize, DataTypes);

// Generate and send OTP function
exports.sendOtp = async (req, res) => {
  try {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required to send OTP.",
      });
    }

    // Find user by email to get user_id
    const user = await User.findOne({ where: { user_email } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Generate 6-digit random OTP code
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (e.g., 5 minutes from now)
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP record in database
    await Otp.create({
      user_id: user.id,
      otp_code,
      expires_at,
      verified: false,
    });

    // Send OTP via email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp_code}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const jwt = require("jsonwebtoken");
const config = require("../../config");
const { Op } = require("sequelize");

// Verify OTP function
exports.verifyOtp = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Authorization header missing.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Token missing.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid token.",
      });
    }

    const userId = decoded.userId;
    const { otp_code } = req.body;

    if (!otp_code) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "OTP code is required.",
      });
    }

    // Find user by userId
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Find OTP record for the user and code
    const otpRecord = await Otp.findOne({
      where: {
        user_id: user.id,
        otp_code,
        verified: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Update user verification status here
    user.is_approved = true;
    user.is_verified = true;
    user.email_verified_at = new Date();
    await user.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
