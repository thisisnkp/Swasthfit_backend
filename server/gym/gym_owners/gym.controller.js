// const GymOwner = require("./gym.Owner.model");
// const Role = require("./role.model");
// const ManageRoles = require("./manage_role.model");
// const Account = require("./account.model");
// const UserManagement = require("./user_management.model");
// const UserMembershipPlan = require("./user_membership.model");
// const CreateGym = require("./create_gym.model");
const GymAbout = require("../gym_about/gymabout.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const GymOwner = require("./gym.Owner.model");
const Role = require("./role.model");
const ManageRoles = require("./manage_role.model");
const Account = require("./account.model");
const UserManagement = require("./user_management.model");
const UserMembershipPlan = require("./user_membership.model");
const CreateGym = require("./create_gym.model");

const Gym = require("./gym.model");
const GymSchedule = require("../model/gymSchedule.model");

const { fileUploaderSingle } = require("../../../fileUpload");

exports.Register = async (req, res) => {
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
      user_role,
      market,
      verify,
      staff_id,
      staff_access_level,

      gym_name,
      gym_logo,
      address,
      latitude,
      longitude,
      facilities,
      msme_certificate_number,
      msme_certificate_photo,
      shop_certificate,
      shop_certificate_photo,
      about_us,
      ratings,
      gst_number,
      bank_name,
      account_holder_name,
      account_number,
      ifsc_code,
      cancel_cheque_photo,
      workout_details,
    } = req.body;

    // Check duplicate
    const existing = await GymOwner.findOne({ where: { mobile } });
    if (existing) {
      return res.status(406).json({
        success: false,
        message: "User already registered with this mobile number.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = profile_image || "";
    if (req.files?.profile_photo) {
      const upload = await fileUploaderSingle(
        "./uploads/gym/",
        req.files.profile_photo
      );
      profileImage = upload.newFileName;
    }

    // ✅ Insert into gym_owners
    const gymOwner = await GymOwner.create({
      name,
      mobile,
      alternate_mobile,
      email,
      profile_image: profileImage,
      pancard_name,
      pancard_no,
      password: hashedPassword,
      market,
      verify: verify || 0,
      staff_id: staff_id || null,
      staff_access_level: staff_access_level || null,
      user_role,
    });

    // 🔸 If gym staff, create role records only
    if (user_role === "gym staff") {
      const role = await Role.create({
        staff_id: gymOwner.id,
        gym_id: 10,
        role_name: "Accountant",
      });

      await ManageRoles.create({
        role_id: role.role_id,
        accounting: 1,
        user_management: 1,
        user_membership_plans: 1,
        create_gym: 1,
      });

      await Account.create({
        role_name: "Account",
        read: 1,
        update: 2,
        create: 3,
        delete: 4,
      });
      await UserManagement.create({
        role_name: "User Management",
        read: 1,
        update: 2,
        create: 3,
        delete: 4,
      });
      await UserMembershipPlan.create({
        role_name: "User Membership",
        read: 1,
        update: 2,
        create: 3,
        delete: 4,
      });
      await CreateGym.create({
        role_name: "Create Gym",
        read: 1,
        update: 2,
        create: 3,
        delete: 4,
      });
    }

    let gym = null;
    if (user_role === "gym owner") {
      gym = await Gym.create({
        owner_id: gymOwner.id,
        gym_name,
        gym_logo,
        gym_address: address,
        gym_geo_location: JSON.stringify({ latitude, longitude }),
        facilities: Array.isArray(facilities) ? facilities : [],
        msme_certificate_number,
        msme_certificate_photo,
        shop_certificate,
        shop_certificate_photo,
        about_us,
        ratings,
        gst_details: gst_number,
        bank_details: JSON.stringify({
          bank_name,
          account_holder_name,
          account_number,
          ifsc_code,
          cancel_cheque: cancel_cheque_photo,
        }),
      });

      // Create entry in gym_about table
      await GymAbout.create({
        gym_name,
        gym_owner_id: gymOwner.id,
        gym_profile_picture: gym_logo,
        gym_id: gym.id,
        about_us,
        services: Array.isArray(facilities) ? facilities.join(", ") : "",
        gym_contect_mobile: mobile,
        gym_contect_alt_mobile: alternate_mobile,
        gym_contect_email_id: email,
        gym_address: address,
        gym_location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        created_at: new Date(),
        updated_at: new Date(),
      });

      await GymSchedule.create({
        gym_id: gym.id,
        workout_details: Array.isArray(workout_details)
          ? JSON.stringify(workout_details)
          : JSON.stringify([]),
        timings: "",
        alternate_closing_time: "",
      });
    }

    const token = jwt.sign(
      { id: gymOwner.id, mobile: gymOwner.mobile, email: gymOwner.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        owner: gymOwner,
        gym: gym || null,
        token,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.gymLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Request Body:", req.body); // Debug log

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Mobile and password are required" });
    }

    // Check if the user exists
    const gymOwner = await GymOwner.findOne({ where: { email } });
    if (!gymOwner) {
      return res.status(404).json({ message: "Gym owner not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, gymOwner.password);
    console.log("Password Match:", isPasswordMatch); // Debug log
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: gymOwner.id,
        mobile: gymOwner.mobile,
        email: gymOwner.email,
        vendor_id: gymOwner.id,
        module_type: "gym",
        user_role: gymOwner.user_role,
        gym_id: "4",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.status(200).json({
      message: "Login successful",
      token,
      gymOwner: {
        id: gymOwner.id,
        name: gymOwner.name,
        email: gymOwner.email,
        mobile: gymOwner.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// exports.gymLogin = async (req, res) => {
//   try {
//     const { mobile, password } = req.body;
//     console.log("Login Request Body:", req.body); // Debug log

//     const gymOwner = await GymOwner.findOne({ where: { mobile } });

//     if (!gymOwner) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, gymOwner.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: gymOwner.id, mobile: gymOwner.mobile },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       data: gymOwner,
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err.message });
//   }
// };

/**
 * Get Gym Details by Owner Email
 */
exports.getGymByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    console.log("Request Email:", email);

    // Validate input
    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required",
      });
    }

    // Find gym owner by email
    const gymOwner = await GymOwner.findOne({ where: { email } });
    console.log("Gym Owner:", gymOwner.user_role); // Debug log

    if (!gymOwner) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No gym owner found with the provided email",
      });
    }

    if (gymOwner.user_role !== "gym staff") {
      console.log("hii1");
      // Find gyms by owner ID
      const gyms = await Gym.findAll({
        where: { owner_id: gymOwner.id },
      });
      if (!gyms || gyms.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "No gyms found for this gym owner",
        });
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: "Gym(s) and owner fetched successfully",
        data: {
          gymOwner: gymOwner, // send complete gymOwner object
          gyms: gyms, // send gym array
        },
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Gym(s) and owner fetched successfully",
        data: {
          gymOwner: gymOwner, // send complete gymOwner object
          // gyms: gyms, // send gym array
        },
      });
    }
  } catch (error) {
    console.error("Error in getGymByEmail:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while fetching gym details",
      error: error.message,
    });
  }
};
// Get all gym owners
exports.getAllGymStaff = async (req, res) => {
  try {
    const gymStaff = await GymOwner.findAll({
      where: {
        user_role: "gym staff",
      },
    });

    return res.status(200).json({ data: gymStaff });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get gym owner by ID
exports.getGymStaffById = async (req, res) => {
  try {
    const owner = await GymOwner.findOne({
      where: {
        id: req.params.id,
        user_role: "gym staff",
      },
    });

    if (!owner) {
      return res.status(404).json({ message: "Gym Staff not found" });
    }

    return res.status(200).json({ data: owner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all gym owners
exports.getAllGymOwners = async (req, res) => {
  try {
    const owners = await GymOwner.findAll();
    return res.status(200).json({ data: owners });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get gym owner by ID
exports.getGymOwnerById = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    return res.status(200).json({ data: owner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update gym owner
exports.updateGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    await owner.update(req.body);
    return res
      .status(200)
      .json({ message: "Updated successfully", data: owner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete gym owner
exports.deleteGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });

    // Remove associated roles
    await Role.destroy({ where: { staff_id: owner.id } });

    // Remove gym owner
    await owner.destroy();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
