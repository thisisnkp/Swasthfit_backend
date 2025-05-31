const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const User = require('../../user/user.model'); //user model
// const Gym = require('../model/gym.model');
// const GymOwners = require('../model/GymOwners.model')
// const gymSchedule = require('../model/gymSchedule.model');
// const {Gym, GymOwners, GymSchedule} = require('../models');
const Gym = require("../gym_owners/gym.model");
const GymOwners = require("../gym_owners/gym.Owner.model");
const GymSchedule = require("../model/gymSchedule.model");
const { fileUploaderSingle } = require("../../../fileUpload");
const Membership = require("../../membership/membership/membership.model");
const User = require("../../user/user.model");
const { Op } = require("sequelize");

exports.gymsList = async (req, res) => {
  try {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const { rows, count } = await Gym.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        {
          model: GymOwners,
        },
      ],
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "List of all gyms",
      total: count,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.gymLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    console.log("Login Request Body:", req.body); // Debug log

    // Validate input
    if (!mobile || !password) {
      return res
        .status(400)
        .json({ message: "Mobile and password are required" });
    }

    // Check if the user exists
    const gymOwner = await GymOwners.findOne({ where: { mobile } });
    if (!gymOwner) {
      return res.status(404).json({ message: "Gym owner not found" });
    }

    // Compare passwords
    console.log("hii", gymOwner.password);
    const isPasswordMatch = await bcrypt.compare(password, gymOwner.password);
    console.log("Password Match:", isPasswordMatch); // Debug log
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: gymOwner.id, mobile: gymOwner.mobile, email: gymOwner.email },
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

/**
 * Login Gym API with OTPless Login
 */

// create GYM
exports.createGym = async (req, res) => {
  try {
    const {
      ownerId,
      business_type,
      gym_name,
      gym_address,
      gym_geo_location,
      facilities, // JSON format
      msme_certificate_number,
      about_us,
      gst_details,
      bank_details, // JSON format
    } = req.body;

    // Validate required fields
    if (!ownerId || !gym_name || !gym_address || !gym_geo_location) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Missing required fields",
      });
    }

    // Define upload paths
    const uploadPaths = {
      gymLogo: "./uploads/gym/logos/",
      msmePhoto: "./uploads/gym/msme/",
      shopCertPhoto: "./uploads/gym/certificates/",
      cancelCheque: "./uploads/gym/cheques/",
    };

    // Upload files if provided
    const uploadedGymLogo = req.files?.gym_logo
      ? await fileUploaderSingle(uploadPaths.gymLogo, req.files.gym_logo)
      : null;

    const uploadedMsmePhoto = req.files?.msme_certificate_photo
      ? await fileUploaderSingle(
          uploadPaths.msmePhoto,
          req.files.msme_certificate_photo
        )
      : null;

    const uploadedShopCertPhoto = req.files?.shop_certificate_photo
      ? await fileUploaderSingle(
          uploadPaths.shopCertPhoto,
          req.files.shop_certificate_photo
        )
      : null;

    const uploadedCancelCheque = req.files?.cancel_cheque
      ? await fileUploaderSingle(
          uploadPaths.cancelCheque,
          req.files.cancel_cheque
        )
      : null;

    // Create a new gym record in the database
    const newGym = await Gym.create({
      owner_id: ownerId,
      business_type: business_type || "",
      gym_name: gym_name,
      gym_logo: uploadedGymLogo ? uploadedGymLogo.newFileName : null,
      gym_address: gym_address,
      gym_geo_location: JSON.stringify(gym_geo_location),
      facilities: facilities ? JSON.stringify(facilities) : null,
      msme_certificate_number: msme_certificate_number || "",
      msme_certificate_photo: uploadedMsmePhoto
        ? uploadedMsmePhoto.newFileName
        : null,
      shop_certificate_photo: uploadedShopCertPhoto
        ? uploadedShopCertPhoto.newFileName
        : null,
      about_us: about_us || "",
      gst_details: gst_details || "",
      bank_details: bank_details ? JSON.stringify(bank_details) : null,
      cancel_cheque: uploadedCancelCheque
        ? uploadedCancelCheque.newFileName
        : null,
    });

    // Send success response
    res.status(201).json({
      status: 201,
      success: true,
      message: "Gym created successfully",
      data: newGym,
    });
  } catch (error) {
    console.error("Error during gym creation:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while creating the gym",
      error: error.message,
    });
  }
};

exports.getUsersByGymId = async (req, res) => {
  try {
    const  gym_id  = req.params.id; // Assuming gym_id comes from URL parameters

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: gym_id",
      });
    }

    // Find all memberships for the given gym_id
    const memberships = await Membership.findAll({
      where: { gym_id },
      attributes: ["user_id"], // Only select user_id
    });

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for this gym",
      });
    }

    // Extract unique user_ids from the memberships
    const userIds = [
      ...new Set(memberships.map((membership) => membership.user_id)),
    ];

    // Fetch user details for the extracted user_ids
    const users = await User.findAll({
      where: { id: userIds },
      attributes: [
        "id",
        "user_name",
        "user_mobile",
        "user_email",
        "user_dob",
        "user_age",
        "user_gender",
        "user_address",
      ], // Specify user attributes to fetch
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user details found for the associated users",
      });
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users by gym ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getGymClientStats = async (req, res) => {
  const { gym_id } = req.params;
  const now = new Date(); // Current date and time for active/inactive check

  // Define start and end of today for sales calculation
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  if (!gym_id) {
    return res.status(400).json({ message: "Gym ID is required." });
  }

  try {
    // 1. Fetch all memberships for the given gym_id
    //    Order by user_id and then by end_date descending
    //    to easily find the latest membership for each user for active/inactive status.
    const allMembershipsForGym = await Membership.findAll({
      where: { gym_id: gym_id },
      order: [
        ["user_id", "ASC"],
        ["end_date", "DESC"],
      ],
      // It's good practice to select only necessary attributes if performance is a concern
      // attributes: ['user_id', 'end_date', 'price', 'created_at'],
    });

    let active_clients = 0;
    let inactive_clients = 0;
    const uniqueUserIds = new Set();
    const processedUserIdsForStatus = new Set(); // To count each user once for active/inactive status
    let total_collected_payments = 0;

    if (!allMembershipsForGym || allMembershipsForGym.length === 0) {
      // If no memberships are found at all for the gym
      return res.status(200).json({
        gym_id: gym_id,
        total_clients: 0,
        active_clients: 0,
        inactive_clients: 0,
        todays_sales: 0, // No sales if no memberships
        total_collected_payments: 0, // No payments if no memberships
        message: "No memberships found for this gym.",
      });
    }

    // 2. Calculate client stats (active/inactive, total unique)
    //    and sum up all payments for total_collected_payments
    for (const membership of allMembershipsForGym) {
      uniqueUserIds.add(membership.user_id); // For total unique clients count

      // Summing up price for ALL memberships of this gym
      total_collected_payments += parseFloat(membership.price);

      // Determine active/inactive status based on the latest membership for each user
      if (!processedUserIdsForStatus.has(membership.user_id)) {
        const endDate = new Date(membership.end_date);
        if (endDate >= now) {
          // Compare with the current moment
          active_clients++;
        } else {
          inactive_clients++;
        }
        processedUserIdsForStatus.add(membership.user_id);
      }
    }

    const total_clients = uniqueUserIds.size;

    // 3. Calculate Today's Sales
    //    Sum 'price' for memberships of the given gym_id created today.
    //    The 'created_at' field is used as per your model's timestamp configuration.
    const todaysSalesResult = await Membership.sum("price", {
      where: {
        gym_id: gym_id,
        created_at: {
          // Assuming 'created_at' is the column name for creation timestamp
          [Op.gte]: startOfToday,
          [Op.lte]: endOfToday,
        },
      },
    });

    const todays_sales = todaysSalesResult || 0;

    res.status(200).json({
      gym_id: gym_id,
      total_clients: total_clients,
      active_clients: active_clients,
      inactive_clients: inactive_clients,
      todays_sales: parseFloat(todays_sales.toFixed(2)), // Ensure two decimal places
      total_collected_payments: parseFloat(total_collected_payments.toFixed(2)), // Ensure two decimal places
    });
  } catch (error) {
    console.error("Error fetching gym client stats and sales:", error);
    res.status(500).json({
      message: "Failed to retrieve statistics and sales.",
      error: error.message,
    });
  }
};

// Controller function to create a new gym associated with an owner
exports.createGymWithOwnerVerification = async (req, res) => {
  const { email, password, gym_name } = req.body;

  if (!email || !password || !gym_name) {
    return res
      .status(400)
      .json({ message: "Email, password, and gym name are required." });
  }

  try {
    // 1. Find the gym owner by email
    const owner = await GymOwners.findOne({ where: { email: email } });

    if (!owner) {
      return res
        .status(404)
        .json({ message: "Gym owner not found with this email." });
    }

    // 2. Verify the password
    // Assuming you are using bcrypt for password hashing when owner is created/updated.
    // If you are storing plain text passwords (not recommended!), you can directly compare:
    // const isPasswordMatch = password === owner.password;
    const isPasswordMatch = await bcrypt.compare(password, owner.password); // owner.password should be the hashed password from DB

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password for the gym owner." });
    }

    // 3. Create the new gym
    const newGym = await Gym.create({
      owner_id: owner.id, //
      gym_name: gym_name, //
      // business_type will use its default value "direct" if not provided
      // Other fields like gym_logo, gym_address, etc., can be added here if provided
      // or updated later through a different endpoint.
      // For now, only essential fields are added.
    });

    res.status(201).json({ message: "Gym created successfully!", gym: newGym });
  } catch (error) {
    console.error("Error creating gym:", error);
    // Check for Sequelize validation errors or other specific errors
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((err) => err.message);
      return res
        .status(409)
        .json({ message: "Conflict - Data already exists", errors: messages });
    }
    res.status(500).json({ message: "Server error while creating gym." });
  }
};
