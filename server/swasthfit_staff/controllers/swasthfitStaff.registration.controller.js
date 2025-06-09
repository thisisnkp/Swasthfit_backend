const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../../../sequelize");
const User = require("../../user/models/user.model");
const Trainer = require("../models/trainer")(
  sequelize,
  require("sequelize").DataTypes
);

const DEFAULT_PASSWORD = "Swasthfit@123";

exports.hrAddTrainer = async (req, res) => {
  try {
    const {
      user_email,
      user_mobile,
      user_name,
      password,
      lastname,
      expertise,
      experience,
      address,
      bank_account_no,
      ifsc_code,
      days,
      time_slot,
      client_bio,
      client_price,
      client_quote,
      diet_and_workout_details,
      profile_photo,
      transformation_photos,
      aadhar_details,
      pan_details,
    } = req.body;

    if (!user_email || !user_mobile || !user_name || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email, mobile number, name, and password are required.",
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

    // Hash provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with user_type "swasthfit staff"
    const newUser = await User.create({
      user_name,
      user_email,
      user_mobile,
      password: hashedPassword,
      user_type: "swasthfit staff",
      is_approved: true,
      is_signup: true,
      is_verified: true,
    });

    // Create trainer linked to user
    const newTrainer = await Trainer.create({
      user_id: newUser.id,
      firstname: user_name,
      lastname: lastname || "",
      expertise: expertise || "",
      experience: experience || "",
      address: address || "",
      bank_account_no: bank_account_no || "",
      ifsc_code: ifsc_code || "",
      days: days ? JSON.stringify(days) : JSON.stringify([]),
      time_slot: time_slot ? JSON.stringify(time_slot) : JSON.stringify([]),
      trainerType: "swasthfit staff",
      client_bio: client_bio || "",
      client_price: client_price || "",
      client_quote: client_quote || "",
      diet_and_workout_details: diet_and_workout_details
        ? JSON.stringify(diet_and_workout_details)
        : JSON.stringify({}),
      profile_photo: profile_photo || "",
      transformation_photos: transformation_photos
        ? JSON.stringify(transformation_photos)
        : JSON.stringify([]),
      aadhar_details: aadhar_details || "",
      pan_details: pan_details || "",
      commission_earned: 0,
      ratings: 0,
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Senior trainer added successfully.",
      data: {
        user: newUser,
        trainer: newTrainer,
      },
    });
  } catch (error) {
    console.error("Error in hrAddTrainer:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.hrAddJuniorTrainer = async (req, res) => {
  try {
    const {
      user_email,
      user_mobile,
      user_name,
      password,
      lastname,
      expertise,
      experience,
      address,
      bank_account_no,
      ifsc_code,
      days,
      time_slot,
      client_bio,
      client_price,
      client_quote,
      diet_and_workout_details,
      profile_photo,
      transformation_photos,
      aadhar_details,
      pan_details,
    } = req.body;

    if (!user_email || !user_mobile || !user_name || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email, mobile number, name, and password are required.",
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

    // Hash provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with user_type "junior trainer"
    const newUser = await User.create({
      user_name,
      user_email,
      user_mobile,
      password: hashedPassword,
      user_type: "junior trainer",
      is_approved: true,
      is_signup: true,
      is_verified: true,
    });

    // Create trainer linked to user
    const newTrainer = await Trainer.create({
      user_id: newUser.id,
      firstname: user_name,
      lastname: lastname || "",
      expertise: expertise || "",
      experience: experience || "",
      address: address || "",
      bank_account_no: bank_account_no || "",
      ifsc_code: ifsc_code || "",
      days: days ? JSON.stringify(days) : JSON.stringify([]),
      time_slot: time_slot ? JSON.stringify(time_slot) : JSON.stringify([]),
      trainerType: "junior trainer",
      client_bio: client_bio || "",
      client_price: client_price || "",
      client_quote: client_quote || "",
      diet_and_workout_details: diet_and_workout_details
        ? JSON.stringify(diet_and_workout_details)
        : JSON.stringify({}),
      profile_photo: profile_photo || "",
      transformation_photos: transformation_photos
        ? JSON.stringify(transformation_photos)
        : JSON.stringify([]),
      aadhar_details: aadhar_details || "",
      pan_details: pan_details || "",
      commission_earned: 0,
      ratings: 0,
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Junior trainer added successfully.",
      data: {
        user: newUser,
        trainer: newTrainer,
      },
    });
  } catch (error) {
    console.error("Error in hrAddJuniorTrainer:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.staffTrainerLogin = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      where: {
        user_email,
        user_type: {
          [require("sequelize").Op.or]: ["swasthfit staff", "junior trainer"],
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid password.",
      });
    }

    const jwt = require("jsonwebtoken");
    const config = require("../../../config");

    const payload = {
      id: user.id,
      user_email: user.user_email,
      user_type: user.user_type,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.TOKEN_EXPIRATION,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error in hrTrainerLogin:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
