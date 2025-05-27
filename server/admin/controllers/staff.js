// controllers/staffController.js
const db = require("../models");

exports.registerStaff = async (req, res) => {
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

    const newStaff = await db.User.create({
      name,
      mobile,
      alternate_mobile,
      email,
      profile_image,
      pancard_name,
      pancard_no,
      password, // hash it in production!
      market,
      verify,
      staff_id,
      staff_access_level,
      user_role,
    });

    res.status(201).json({ success: true, data: newStaff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
