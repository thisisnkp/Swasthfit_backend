// const GymOwner = require("./gym.Owner.model");
// const Role = require("./role.model");
// const ManageRoles = require("./manage_role.model");
// const Account = require("./account.model");
// const UserManagement = require("./user_management.model");
// const UserMembershipPlan = require("./user_membership.model");
// const CreateGym = require("./create_gym.model");

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
    // Assuming 'role_id' is not relevant for this specific 'findOne' or it's a new user check.
    // If this also errors, the workaround would be needed here too.
    const existing = await GymOwner.findOne({
      where: { mobile },
      // attributes: { exclude: ['role_id'] } // Add if this line also causes the error
    });
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
        gym_id: 10, // Consider making this dynamic or configurable
        role_name: "Accountant", // Consider making this dynamic
      });

      await ManageRoles.create({
        // role_id: role.role_id, // Ensure 'role_id' exists on 'role' object if uncommented
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
    console.error("Error in Register:", err); // Added context to error log
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.gymLogin = async (req, res) => {
  try {
    const { email, password, user_role, staff_id } = req.body;

    console.log("Login Request Body:", req.body);

    if (!email || !password || !user_role) {
      return res.status(400).json({
        message: "Email, password, and user_role are required",
      });
    }

    if (user_role === "staff" && !staff_id) {
      return res.status(400).json({
        message: "Staff ID is required for staff login",
      });
    }

    if (user_role === "owner") {
      const gymOwner = await GymOwner.findOne({
        where: { email },
        attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
      });

      if (!gymOwner) {
        return res.status(404).json({ message: "Gym owner not found" });
      }

      const isPasswordMatch = await bcrypt.compare(password, gymOwner.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: gymOwner.id,
          mobile: gymOwner.mobile,
          email: gymOwner.email,
          vendor_id: gymOwner.id,
          module_type: "gym",
          user_role: "owner",
          staff_id: "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        message: "Owner login successful",
        token,
        user: {
          id: gymOwner.id,
          name: gymOwner.name,
          email: gymOwner.email,
          mobile: gymOwner.mobile,
        },
        gymOwner, // Be mindful of sending the whole gymOwner object if it contains sensitive data
      });
    }

    if (user_role === "staff") {
      const staff = await GymOwner.findOne({
        where: { email, staff_id },
        attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
      });

      if (!staff) {
        return res.status(404).json({ message: "Gym staff not found" });
      }

      const isPasswordMatch = await bcrypt.compare(password, staff.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: staff.id,
          email: staff.email,
          vendor_id: staff.id, // Should this be the owner's ID or staff's ID?
          module_type: "gym",
          user_role: "staff",
          staff_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        message: "Staff login successful",
        token,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
        },
      });
    }

    return res.status(400).json({ message: "Invalid user_role" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get Gym Details by Owner Email
 */
exports.getGymByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    console.log("Request Email:", email);

    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email is required",
      });
    }

    const gymOwner = await GymOwner.findOne({
      where: { email },
      attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
    });

    if (!gymOwner) {
      // This check can now be performed safely
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No gym owner found with the provided email",
      });
    }
    console.log("Gym Owner user_role:", gymOwner.user_role); // Debug log

    if (gymOwner.user_role !== "gym staff") {
      console.log("hii1");
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
          gymOwner: gymOwner,
          gyms: gyms,
        },
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Gym staff details fetched successfully", // Adjusted message
        data: {
          gymOwner: gymOwner,
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

exports.getAllGymStaff = async (req, res) => {
  try {
    const gymStaff = await GymOwner.findAll({
      where: {
        user_role: "gym staff",
      },
      attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
    });

    return res.status(200).json({ data: gymStaff });
  } catch (error) {
    console.error("Error in getAllGymStaff:", error); // Added console.error
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymStaffById = async (req, res) => {
  try {
    const owner = await GymOwner.findOne({
      where: {
        id: req.params.id,
        user_role: "gym staff",
      },
      attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
    });

    if (!owner) {
      return res.status(404).json({ message: "Gym Staff not found" });
    }

    return res.status(200).json({ data: owner });
  } catch (error) {
    console.error("Error in getGymStaffById:", error); // Added console.error
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllGymOwners = async (req, res) => {
  try {
    const owners = await GymOwner.findAll({
      attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
    });
    return res.status(200).json({ data: owners });
  } catch (error) {
    console.error("Error in getAllGymOwners:", error); // Added console.error
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymOwnerById = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id, {
      attributes: { exclude: ["role_id"] }, // WORKAROUND APPLIED
    });
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    return res.status(200).json({ data: owner });
  } catch (error) {
    console.error("Error in getGymOwnerById:", error); // Added console.error
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id, {
      // attributes: { exclude: ['role_id'] } // Not strictly needed for the find before update, but harmless
    });
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });

    // If role_id is part of req.body and you don't want to update it, handle req.body
    // delete req.body.role_id; // Example if role_id should never be updated this way

    await owner.update(req.body);
    return res
      .status(200)
      .json({ message: "Updated successfully", data: owner });
  } catch (error) {
    console.error("Error in updateGymOwner:", error); // Added console.error
    // Check if the error is specifically about 'role_id' during update
    if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("role_id")
    ) {
      return res
        .status(500)
        .json({
          message:
            "Update failed. The 'role_id' column might be causing issues. Please check model and database schema.",
          error: error.message,
        });
    }
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id, {
      // attributes: { exclude: ['role_id'] } // Not strictly needed for findByPk before delete
    });
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });

    // Remove associated roles
    // This assumes Role model is correctly defined and staff_id is the foreign key.
    await Role.destroy({ where: { staff_id: owner.id } });

    // Remove gym owner
    await owner.destroy();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGymOwner:", error); // Added console.error
    return res.status(500).json({ message: error.message });
  }
};
