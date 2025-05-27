const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcrypt");
const User = require("./user.model"); //user model
const UserFitData = require("./userfitdata.model"); //user fit model
const Trainer = require("./trainer.model"); // Ensure this is declared only once
const { use } = require("./user.route");
const { Op } = require("sequelize");

const {
  fileUploaderSingle,
  fileUploaderMultiple,
} = require("../../fileUpload");

// login function
exports.userLogin = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;

    // Validate input
    if (user_type === "trainer") {
      if (!email || !password) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Email and password are required for trainer login.",
        });
      }
    } else {
      if (!req.body.mobileNumber) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Mobile number is required.",
        });
      }
    }

    let user;

    if (user_type === "trainer") {
      // For trainers, find user by email in User table
      user = await User.findOne({
        where: { user_email: email, user_type: "trainer" },
      });
    } else {
      // For other users, find by mobile number and user_type in the Users table
      user = await User.findOne({
        where: { user_mobile: req.body.mobileNumber, user_type: user_type },
      });
    }

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found." });
    }

    console.log("User password hash:", user.password);

    // Verify password using bcrypt
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return res.status(401).json({
    //     status: 401,
    //     success: false,
    //     message: "Invalid password.",
    //   });
    // }

    // For non-trainers, check approval and signup status
    if (user_type !== "trainer") {
      if (!user.is_approved) {
        return res
          .status(404)
          .json({ status: 300, success: false, message: "User not approved" });
      }
      if (!user.is_signup) {
        return res
          .status(404)
          .json({ status: 401, success: false, message: "User can't signup " });
      }
    }

    // Prepare payload with correct mobile number field
    const payload = {
      id: user.id,
      mobile_number: user.user_mobile,
    };

    const jwtToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.TOKEN_EXPIRATION,
    });

    // Send the token in the response
    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful.",
      token: jwtToken, // Send the JWT token to the client
    });
  } catch (error) {
    console.error("Error during login: ", error.stack || error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error." });
  }
};

exports.userRegistration = async (req, res) => {
  try {
    const {
      user_name,
      user_mobile,
      user_height,
      user_weight,
      user_email,
      target_weight,
      per_exp,
      sickness,
      physical_activity,
      gender,
      fit_goal,
      user_aadhar,
      user_pan,
      user_bank,
      user_type, // Determine if the user is a trainer
      user_age, // For general users
      firstname,
      lastname,
      expertise,
      experience,
      address,
      bank_account_no,
      ifsc_code,
      password,
      time_slot, // Trainer-specific fields
    } = req.body;

    // Validate required fields for all users
    if (!user_mobile || !user_type) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Required fields (user_mobile, user_type) are missing.",
      });
    }

    // Check if the user already exists by user_mobile or user_email (you can modify based on your requirement)
    // Check if the user already exists by user_mobile or user_email
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { user_mobile: user_mobile ? user_mobile.toString() : null },
          { user_email: user_email ? user_email : null },
        ],
      },
    });

    // Add debug logs
    console.log("Checking for existing user with:", {
      mobile: user_mobile,
      email: user_email,
      existingUser: existingUser,
    });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User with this mobile number or email already exists.",
        debug: {
          foundWith:
            existingUser.user_email === user_email ? "email" : "mobile",
        },
      });
    }

    // Validation for trainers
    if (user_type === "trainer") {
      if (
        !firstname ||
        !lastname ||
        !expertise ||
        !experience ||
        !address ||
        !bank_account_no ||
        !ifsc_code ||
        !time_slot ||
        !req.body.trainerType ||
        !password ||
        !req.body.days  // Add days validation
      ) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "All trainer fields including available days are required.",
        });
      }
    } else {
      // Validation for general users
      if (!user_height || !user_weight || !target_weight || !user_age) {
        return res.status(400).json({
          status: 400,
          success: false,
          message:
            "User fields (user_height, user_weight, target_weight, user_age) are required.",
        });
      }
      if (
        !Array.isArray(per_exp) ||
        !Array.isArray(sickness) ||
        !Array.isArray(physical_activity) ||
        !Array.isArray(fit_goal)
      ) {
        return res.status(400).json({
          status: 400,
          success: false,
          message:
            "Fields per_exp, sickness, physical_activity, and fit_goal must be arrays.",
        });
      }
    }

    // Hash the password before saving
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the User table
    const newUser = await User.create({
      user_name:
        user_type === "trainer" ? `${firstname} ${lastname}` : user_name, // Combine firstname and lastname for trainers
      user_mobile,
      user_email,
      user_type,
      user_height,
      user_weight,
      user_aadhar,
      user_pan,
      user_bank,
      user_age,
      password: hashedPassword,
    });

    // Insert additional data into UserFitData for general users
    if (user_type !== "trainer") {
      await UserFitData.create({
        user_id: newUser.id, // Link UserFitData with the user
        // user_height,
        // user_weight,
        target_weight,
        per_exp: JSON.stringify(per_exp),
        sickness: JSON.stringify(sickness),
        physical_activity: JSON.stringify(physical_activity),
        gender,
        fit_goal: JSON.stringify(fit_goal),
        // user_aadhar,
        // user_pan,
        // user_bank,
        // user_age,
      });
    }

    // Insert trainer-specific data into Trainer table
    // Inside the trainer creation block
    if (user_type === "trainer") {
    // Handle profile photo upload
    let profilePhoto = "";
    if (req.files?.profile_photo) {
    const upload = await fileUploaderSingle(
    "./uploads/trainers/profile/",
    req.files.profile_photo
    );
    profilePhoto = upload.newFileName;
    }
    
    // Handle transformation photos upload
    let transformationPhotos = [];
    if (req.files?.transformation_photos) {
    const uploads = await fileUploaderMultiple(
    "./uploads/trainers/transformations/",
    req.files.transformation_photos
    );
    transformationPhotos = uploads.map((upload) => upload.newFileName);
    }
    
    await Trainer.create({
    user_id: newUser.id,
    firstname,
    lastname,
    profile_photo: profilePhoto, // Add this line
    transformation_photos: JSON.stringify(transformationPhotos), // Add this line
    expertise,
    experience,
    address,
    bank_account_no,
    ifsc_code,
    days: req.body.days, // Make sure to pass the days array
    time_slot: JSON.stringify(time_slot),
    trainerType: req.body.trainerType,
    client_bio: req.body.client_bio || "",
    client_price: req.body.client_price || "",
    client_quote: req.body.client_quote || "",
    diet_and_workout_details: JSON.stringify(
    req.body.diet_and_workout_details || {}
    ),
    aadhar_details: user_aadhar || "",
    pan_details: user_pan || "",
    commission_earned: 0,
    ratings: 0,
    });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, userType: user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Set token expiration as needed
    );

    // Return success response with the token
    return res.status(200).json({
      status: 200,
      success: true,
      message: "User registered successfully.",
      data: newUser, // Optionally return created user details
      token, // Return the generated token
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    // Add detailed error message in response for debugging (remove in production)
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Get all trainers or dietitians
// Remove the duplicate declaration of Trainer
// const Trainer = require("./trainer.model");

exports.getAllTrainers = async (req, res) => {
  try {
    const { trainerType } = req.query; // "trainer" or "dietitian"
    const where = trainerType ? { trainerType } : {};
    const trainers = await require("./trainer.model").findAll({ where });
    return res.status(200).json({ success: true, data: trainers });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.bookTrainer = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user
    const { trainerId } = req.body;

    if (!trainerId) {
      return res
        .status(400)
        .json({ success: false, message: "trainerId is required." });
    }

    const user = await require("./user.model").findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    let trainerIds = Array.isArray(user.trainer_id) ? user.trainer_id : [];
    if (!trainerIds.includes(trainerId)) {
      trainerIds.push(trainerId);
      await user.update({ trainer_id: trainerIds });
    }

    res.status(200).json({
      success: true,
      message: "Trainer booked successfully.",
      trainer_id: trainerIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user ID is provided
    if (!userId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User ID is required.",
      });
    }

    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getAllUsersWithPagination = async (req, res) => {
  try {
    // User details
    const user = req.user; // Decoded JWT data
    // Extract pagination parameters from query string (default values: page=1, limit=10)
    const { page = 1, limit = 10 } = req.query;

    // Parse query parameters to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Calculate offset
    const offset = (pageNumber - 1) * pageSize;

    // Fetch users with pagination and exclude current user
    const { count, rows } = await User.findAndCountAll({
      attributes: [
        "id",
        "user_name",
        "user_age",
        "user_aadhar",
        "user_earned_coins",
      ],
      where: {
        id: { [Op.ne]: user.id ?? user.userId }, // Exclude current user
      },
      limit: pageSize,
      offset,
    });

    // Check if users exist
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No users found.",
      });
    }

    // Prepare pagination details
    const totalPages = Math.ceil(count / pageSize);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Users fetched successfully.",
      data: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        pageSize,
        totalRecords: count,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get all user fit data
exports.getAllUserFitData = async (req, res) => {
  try {
    const fitData = await UserFitData.findAll();
    res.status(200).json({
      success: true,
      data: fitData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get user by ID
exports.getUserFitDataByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const fitData = await UserFitData.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]], // Sort by id descending (latest first)
    });
    if (!fitData || fitData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No fit data found for this user." });
    }
    res.status(200).json({ success: true, data: fitData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update User API
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from route parameters
    const updateData = req.body; // Data to update (sent in request body)

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user in the database
    await user.update(updateData); // Update the user instance

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user, // Send the updated user object
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Getting all data for user
exports.getUserDetails = async (req, res) => {
  try {
    //const { id } = req.params; // Extract user ID from the request parameters
    const id = req.user.id ?? req.user.userId;
    console.log("User", id);
    // Find the user with the associated UserFitData
    const user = await User.findOne({
      where: { id }, // Match the user ID
      include: [
        {
          model: UserFitData, // Include associated UserFitData
          as: "user_fit_data", // Match alias defined in the association
        },
      ],
    });

    // If user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user details and associated data
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    console.log("User Email:", email);

    // Find the user by email
    const user = await User.findOne({
      where: { user_email: email }, // ✅ Correct usage
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add this new endpoint to get trainer photos
exports.getTrainerPhotos = async (req, res) => {
  try {
    const { trainerId } = req.params;

    const trainer = await Trainer.findOne({
      where: { user_id: trainerId },
      attributes: ['profile_photo', 'transformation_photos']
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found"
      });
    }

    // Construct full URLs for the photos
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Parse transformation_photos if it exists
    const transformationPhotos = trainer.transformation_photos 
      ? JSON.parse(trainer.transformation_photos) 
      : [];

    const response = {
      profile_photo: trainer.profile_photo ? `${baseUrl}/uploads/trainers/profile/${trainer.profile_photo}` : null,
      transformation_photos: transformationPhotos.map(photo => 
        `${baseUrl}/uploads/trainers/transformations/${photo}`
      )
    };

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching trainer photos:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    return res.status(200).json({ success: true, data: trainer });
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
