const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const Trainer = require("./models/trainer.model");
const { Op } = require("sequelize");
const {
  fileUploaderSingle,
  fileUploaderMultiple,
} = require("../../fileUpload");

const nodemailer = require("nodemailer");
const otpModel = require("./models/otp.model");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");
const Otp = otpModel(sequelize, DataTypes);

// New trainer registration function
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

    // Create new user with user_type trainer and set is_signup to true
    const newUser = await User.create({
      user_name: user_email, // Set user_name to email to satisfy not-null constraint
      user_email,
      user_mobile,
      password: hashedPassword,
      user_type,
      is_signup: true,
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

    // Generate 4-digit OTP
    const otp_code = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP expiration time (5 minutes from now)
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP record in database
    await Otp.create({
      user_id: newUser.id,
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

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success response indicating OTP sent
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Trainer registered successfully. OTP sent to email.",
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

function generateWalletId() {
  // Generates a 10-digit random number as a string
  return Math.floor(1000000000 + Math.random() * 90000000).toString();
}

// Update trainer profile
exports.updateTrainerProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Set by verifyJWT middleware

    // Find the trainer by user_id
    const trainer = await Trainer.findOne({ where: { user_id: userId } });
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    // Prepare update data
    const updateData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      expertise: req.body.expertise,
      experience: req.body.experience,
      address: req.body.address,
      bank_account_no: req.body.bank_account_no,
      ifsc_code: req.body.ifsc_code,
      days: Array.isArray(req.body.days)
        ? req.body.days.join(",")
        : req.body.days, // store as comma-separated string if needed
      time_slot: Array.isArray(req.body.time_slot)
        ? req.body.time_slot.join(",")
        : req.body.time_slot,
      trainerType: req.body.trainerType,
      client_bio: req.body.client_bio,
      client_price: req.body.client_price,
      client_quote: req.body.client_quote,
      diet_and_workout_details: req.body.diet_and_workout_details
        ? JSON.stringify(req.body.diet_and_workout_details)
        : null,
      profile_photo: req.body.profile_photo,
      transformation_photos: Array.isArray(req.body.transformation_photos)
        ? req.body.transformation_photos.join(",")
        : req.body.transformation_photos,
      aadhar_details: req.body.aadhar_details,
      pan_details: req.body.pan_details,
    };

    // Remove undefined fields (so only provided fields are updated)
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    // Update the trainer
    await trainer.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Trainer profile updated successfully",
      data: trainer,
    });
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all trainers or dietitians
exports.getAllTrainers = async (req, res) => {
  try {
    const { trainerType } = req.query; // "trainer" or "dietitian"
    // Exclude trainers with trainerType "junior trainer"
    const where = trainerType
      ? { trainerType: trainerType, trainerType: { [Op.ne]: "junior trainer" } }
      : { trainerType: { [Op.ne]: "junior trainer" } };
    const trainers = await Trainer.findAll({ where });
    // Include trainerType in the response explicitly if missing
    const trainersWithType = trainers.map((trainer) => {
      return {
        ...trainer.dataValues,
        trainerType: trainer.trainerType || "",
      };
    });
    return res.status(200).json({ success: true, data: trainersWithType });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add this new endpoint to get trainer photos
exports.getTrainerPhotos = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const trainer = await Trainer.findOne({
      where: { user_id: trainerId },
      attributes: ["profile_photo", "transformation_photos"],
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Construct full URLs for the photos
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Parse transformation_photos if it exists
    const transformationPhotos = trainer.transformation_photos
      ? JSON.parse(trainer.transformation_photos)
      : [];

    const response = {
      profile_photo: trainer.profile_photo
        ? `${baseUrl}/uploads/trainers/profile/${trainer.profile_photo}`
        : null,
      transformation_photos: transformationPhotos.map(
        (photo) => `${baseUrl}/uploads/trainers/transformations/${photo}`
      ),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching trainer photos:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    return res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
    });
  }
};
