"use strict";
const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Get user by ID
exports.getUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all users with count
exports.getAllUsersController = async (req, res) => {
  try {
    const users = await User.findAll();
    const count = await User.count();

    return res.status(200).json({
      count,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Create user
exports.createUserController = async (req, res) => {
  try {
    const {
      trainer_id, user_name, user_mobile, user_email, password,
      user_dob, user_age, user_height, user_weight, user_aadhar,
      user_pan, user_bank, user_address, user_earned_coins,
      user_gullak_money_earned, user_gullak_money_used, user_competitions,
      user_type, user_social_media_id, user_downloads, user_ratings,
      user_qr_code, is_signup, otpless_token, is_approved,
      email_verified_at, remember_token, forget_password_token,
      status, provider_id, provider, provider_avatar, image,
      country_id, state_id, city_id, zip_code, is_vendor,
      verify_token, email_verified, agree_policy
    } = req.body;

    if (!trainer_id || !user_name || !user_mobile || !user_email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUser = await User.create({
      trainer_id, user_name, user_mobile, user_email, password,
      user_dob, user_age, user_height, user_weight, user_aadhar,
      user_pan, user_bank, user_address, user_earned_coins,
      user_gullak_money_earned, user_gullak_money_used, user_competitions,
      user_type, user_social_media_id, user_downloads, user_ratings,
      user_qr_code, is_signup, otpless_token, is_approved,
      email_verified_at, remember_token, forget_password_token,
      status, provider_id, provider, provider_avatar, image,
      country_id, state_id, city_id, zip_code, is_vendor,
      verify_token, email_verified, agree_policy
    });

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all orders of a specific user
exports.getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [{ model: Order, as: "orders" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderCount = user.orders.length;
    return res.status(200).json({ userId: user.id, orderCount, orders: user.orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
