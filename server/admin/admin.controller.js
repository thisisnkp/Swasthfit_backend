const bcrypt = require("bcrypt");
const config = require("../../config");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const Admin = require("./admin.model"); // Ensure this path is correct
=======
const Admin = require("./admin.model");
>>>>>>> restaurent_backend
const nodemailer = require("nodemailer");
const User = require("../user/user.model");
const GymOwner = require("../admin/models/GymOwners");
require("dotenv").config();
<<<<<<< HEAD
const FoodRestaurant = require("../food/models/Restaurant"); // Keep this if used elsewhere, but not for admin reset
=======
const FoodRestaurant= require("../food/models/Restaurant");
>>>>>>> restaurent_backend
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

exports.signup = async (req, res) => {
  try {
    const { name, email, password, admin_type, status, image } = req.body;

<<<<<<< HEAD
    if (!gmailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Only Gmail email addresses are allowed!" });
=======

    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: "Only Gmail email addresses are allowed!" });
>>>>>>> restaurent_backend
    }
    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email is already registered!" });
    }

    const admin = await Admin.create({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      admin_type: admin_type || 0,
      status: status || 1,
      image: image || null,
      email_verified_at: null,
      forget_password_token: null,
    });

    res.status(201).json({ success: "Admin user created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { email: req.body.email },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      admin.password,
    );
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token,
      admin_type: admin.admin_type,
      status: admin.status,
      image: admin.image,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD
// send reset password link for Admin
=======
// send reset password link 
>>>>>>> restaurent_backend
exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
<<<<<<< HEAD
    // Check if email exists in Admin DB
    const admin = await Admin.findOne({ where: { email: email } }); // Changed to Admin model

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found with this email." }); // Changed message
=======
    // Check if email exists in DB (assuming username = email)
    const restaurant = await FoodRestaurant.findOne({ where: { username: email } });

    if (!restaurant) {
      return res.status(404).json({ message: "Email is not registered" });
>>>>>>> restaurent_backend
    }

    // Email exists — send reset link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
<<<<<<< HEAD
        user: "shweta.ladne.averybit@gmail.com", // Use your actual Gmail email
        pass: "poai mggb pklw likw", // Use your generated App Password for Gmail
=======
        user: "shweta.ladne.averybit@gmail.com",
        pass: "poai mggb pklw likw",
>>>>>>> restaurent_backend
      },
    });

    const mailOptions = {
<<<<<<< HEAD
      from: "your-email@gmail.com", // This should be your actual sending email
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Admin Password Reset</h2>
        <p>You requested a password reset for your admin account.</p>
        <p>Click <a href="http://localhost:5173/reset-password-link">here</a> to reset your password</p>
        <p>If you did not request this, please ignore this email.</p>
=======
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click <a href="http://localhost:5173/reset-password-link">here</a> to reset your password</p>
>>>>>>> restaurent_backend
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
<<<<<<< HEAD
      message: "Admin password reset link has been sent to your email", // Changed message
    });
  } catch (error) {
    console.error("Admin Password Reset Email Error:", error); // Specific error log
    return res
      .status(500)
      .json({ message: "Server error sending reset link. Try again later." });
  }
};

// set new password for Admin
exports.handlePasswordReset = async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body; // username here typically refers to email
=======
      message: "Reset password link has been sent to your email",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};

// set new pasword 
exports.handlePasswordReset = async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;
>>>>>>> restaurent_backend

  if (!username)
    return res.status(400).json({ message: "Username (email) is required" });

  if (!newPassword || !confirmPassword)
<<<<<<< HEAD
    return res
      .status(400)
      .json({ message: "Both password fields are required" });
=======
    return res.status(400).json({ message: "Both password fields are required" });
>>>>>>> restaurent_backend

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
<<<<<<< HEAD
    // Find admin by username (which holds email)
    const admin = await Admin.findOne({ where: { email: username } }); // Changed to Admin model

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found with this username (email)." }); // Changed message
=======
    // Find restaurant by username (which holds email)
    const restaurant = await FoodRestaurant.findOne({ where: { username } });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found with this username" });
>>>>>>> restaurent_backend
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
<<<<<<< HEAD
    admin.password = hashedPassword;
    await admin.save();

    return res.json({ message: "Admin password has been successfully reset" }); // Changed message
  } catch (err) {
    console.error("Admin Password Update Error:", err); // Specific error log
    return res
      .status(500)
      .json({ message: "Server error resetting password. Please try again." });
  }
};

// NEW FUNCTION TO GET ADMIN PROFILE BY ID
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: {
        exclude: ["password", "forget_password_token", "remember_token"],
      }, // Exclude sensitive data
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    return res.status(200).json({ user: admin }); // Keep 'user' key for frontend compatibility
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return res.status(500).json({ message: "Server error fetching profile." });
  }
};
=======
    restaurant.password = hashedPassword;
    await restaurant.save();

    return res.json({ message: "Password has been successfully reset" });
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

>>>>>>> restaurent_backend

const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const SHORT_CODE = "12314347712";

exports.sendSMS = async (req, res) => {
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,

      from: SHORT_CODE,
      to: "+918305906963",
    });

    res.json({ success: true, sid: response.sid });
  } catch (err) {
    console.error("SMS send error:", err);
    res.status(500).json({ success: false, message: "Failed to send SMS" });
  }
};

exports.sendEmail = async (req, res) => {
  const { host, port, user, pass, to, subject, text } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
    });

    const mailOptions = {
      from: `"Mailer App" <${user}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);

    res.status(200).json({ success: true, message: "Email sent", info });
  } catch (error) {
    console.error("Email sending failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

// staff register
exports.registerGymOwner = async (req, res) => {
  try {
    const {
      name,
      mobile,
      alternate_mobile,
      email,
      profile_image,
      pancard_name,
      pancard_no,
      password,
      market,
      verify,
      staff_id,
      staff_access_level,
      user_role,
    } = req.body;

    if (!name || !mobile || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing." });
    }

    const existing = await GymOwner.findOne({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const newStaff = await GymOwner.create({
      name,
      mobile,
      alternate_mobile,
      email,
      profile_image,
      pancard_name,
      pancard_no,
      password,
      market,
      verify,
      staff_id,
      staff_access_level,
      user_role,
    });

    return res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error registering staff:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
