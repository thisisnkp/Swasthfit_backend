const Trainer = require("./trainer.model");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Otp = require("./otp.model")(
  require("../../sequelize"),
  require("sequelize").DataTypes
);
const sequelize = require("../../sequelize");
const axios = require("axios");

// Function to send OTP via Otpless API
async function sendOtpViaOtpless(user_mobile, otpCode) {
  try {
    const otplessApiUrl = process.env.OTPLESS_API_URL;
    const apiKey = process.env.OTPLESS_CLIENT_SECRET;

    const response = await axios.post(
      otplessApiUrl,
      {
        mobile: user_mobile,
        otp: otpCode,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending OTP via Otpless API:", error);
    throw error;
  }
}

// Existing functions
exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    return res.status(200).json({ data: trainer });
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    return res.status(200).json({ data: trainers });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// New trainer registration function with OTP integration
exports.trainerRegistration = async (req, res) => {
  try {
    const { user_email, user_mobile, password, user_type } = req.body;

    // Validate required fields
    if (!user_email || !user_mobile || !password || user_type !== "trainer") {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Email, mobile number, password, and user_type (trainer) are required.",
      });
    }

    // Check if user already exists by email or mobile
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_email }, { user_mobile }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User with this email or mobile number already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with user_type trainer
    const newUser = await User.create({
      user_name: user_email, // Set user_name to email to satisfy not-null constraint
      user_email,
      user_mobile,
      password: hashedPassword,
      user_type,
    });

    // Create empty Trainer record for this user
    await Trainer.create({
      user_id: newUser.id,
      firstname: "",
      lastname: "",
      expertise: "",
      experience: "",
      address: "",
      bank_account_no: "",
      ifsc_code: "",
      days: JSON.stringify([]),
      time_slot: JSON.stringify([]),
      trainerType: "",
      client_bio: "",
      client_price: "",
      client_quote: "",
      diet_and_workout_details: JSON.stringify({}),
      profile_photo: "",
      transformation_photos: JSON.stringify([]),
      aadhar_details: "",
      pan_details: "",
      commission_earned: 0,
      ratings: 0,
      wallet_id: generateWalletId(),
    });

    // Generate OTP code (6 digit random number)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration time (e.g., 10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP in database
    await Otp.create({
      user_id: newUser.id.toString(),
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false,
    });

    // TODO: Integrate Otpless API to send OTP to user_mobile or user_email
    // Placeholder for sending OTP via Otpless API
    // sendOtpViaOtpless(user_mobile, otpCode);
    console.log(
      `Send OTP ${otpCode} to user ${user_mobile} or ${user_email} via Otpless API`
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response with token and message about OTP sent
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Trainer registered successfully. OTP sent for verification.",
      data: newUser,
      token,
    });
  } catch (error) {
    console.error("Error in trainer registration:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
      stack: error.stack,
    });
  }
};

// OTP verification endpoint
// OTP verification endpoint that extracts user_id from token
exports.verifyOtp = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid token",
      });
    }

    const user_id = decoded.userId;
    const { otp_code } = req.body;

    if (!otp_code) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "otp_code is required",
      });
    }

    const otpRecord = await Otp.findOne({
      where: {
        user_id: user_id.toString(),
        otp_code,
        verified: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await otpRecord.update({ verified: true });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

function generateWalletId() {
  // Generates a 10-digit random number as a string
  return Math.floor(1000000000 + Math.random() * 90000000).toString();
}
