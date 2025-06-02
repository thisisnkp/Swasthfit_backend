<<<<<<< HEAD
"use strict";
const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs"); //
const jwt = require("jsonwebtoken");
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
=======
'use strict';
const User = require('../models/user');
const Order = require('../models/order');
exports.getUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
>>>>>>> restaurent_backend
};
// exports.getAllUsersController = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         return res.status(200).json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };
exports.getAllUsersController = async (req, res) => {
<<<<<<< HEAD
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

exports.createUserController = async (req, res) => {
  try {
    const {
      trainer_id,
      user_name,
      user_mobile,
      user_email,
      password,
      user_dob,
      user_age,
      user_height,
      user_weight,
      user_aadhar,
      user_pan,
      user_bank,
      user_address,
      user_earned_coins,
      user_gullak_money_earned,
      user_gullak_money_used,
      user_competitions,
      user_type,
      user_social_media_id,
      user_downloads,
      user_ratings,
      user_qr_code,
      is_signup,
      otpless_token,
      is_approved,
      email_verified_at,
      remember_token,
      forget_password_token,
      status,
      provider_id,
      provider,
      provider_avatar,
      image,
      country_id,
      state_id,
      city_id,
      zip_code,
      is_vendor,
      verify_token,
      email_verified,
      agree_policy,
    } = req.body;

    // Check required fields
    if (!trainer_id || !user_name || !user_mobile || !user_email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new user
    const newUser = await User.create({
      trainer_id,
      user_name,
      user_mobile,
      user_email,
      password,
      user_dob,
      user_age,
      user_height,
      user_weight,
      user_aadhar,
      user_pan,
      user_bank,
      user_address,
      user_earned_coins,
      user_gullak_money_earned,
      user_gullak_money_used,
      user_competitions,
      user_type,
      user_social_media_id,
      user_downloads,
      user_ratings,
      user_qr_code,
      is_signup,
      otpless_token,
      is_approved,
      email_verified_at,
      remember_token,
      forget_password_token,
      status,
      provider_id,
      provider,
      provider_avatar,
      image,
      country_id,
      state_id,
      city_id,
      zip_code,
      is_vendor,
      verify_token,
      email_verified,
      agree_policy,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id; // URL se User ID le rahe hain

    // ✅ User ke saare orders fetch karna
    const user = await User.findByPk(userId, {
      include: [{ model: Order, as: "orders" }], // Ensure alias matches the association
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Calculate the total number of orders
    const orderCount = user.orders.length;
    res.json({ userId: user.id, orderCount: orderCount, orders: user.orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.deleteUser = async (req, res) => {
//   //
//   try {
//     const { id } = req.params; // Get user ID from parameters

//     const userToDelete = await User.findByPk(id); // Find the user by primary key

//     if (!userToDelete) {
//       // If user not found, return 404
//       return res.status(404).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     await userToDelete.destroy(); // Delete the user from the database

//     return res.status(200).json({
//       // Return success message
//       status: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting user:", error); // Log any errors
//     return res.status(500).json({
//       // Return server error
//       status: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };
=======
    try {
        const users = await User.findAll();
        const count = await User.count();

        return res.status(200).json({
            count,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


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

        // Check required fields
        if (!trainer_id || !user_name || !user_mobile || !user_email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new user
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

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.id; // URL se User ID le rahe hain

        // ✅ User ke saare orders fetch karna
        const user = await User.findByPk(userId, {
            include: [{ model: Order, as: "orders" }], // Ensure alias matches the association
        });
        

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  // Calculate the total number of orders
  const orderCount = user.orders.length;
        res.json({ userId: user.id,     orderCount: orderCount, orders: user.orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

>>>>>>> restaurent_backend
