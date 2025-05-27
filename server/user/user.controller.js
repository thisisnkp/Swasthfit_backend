const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("./user.model"); //user model
const UserFitData = require("./userfitdata.model"); //user fit model
const { use } = require("./user.route");

// login function
exports.userLogin = async (req, res) => {
  try {
    const { mobileNumber, token } = req.body;

    // Validate input
    if (!mobileNumber) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Mobile number and token are required.",
      });
    }

    // Find the user from the database (you can also use Sequelize to find the user)
    const user = await User.findOne({
      where: { user_mobile: mobileNumber, otpless_token: token },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found." });
    } else if (!user.is_approved) {
      return res
        .status(404)
        .json({ status: 300, success: false, message: "User not approved" });
    } else if (!user.is_signup) {
      return res
        .status(404)
        .json({ status: 401, success: false, message: "User can't signup " });
    }

    // If the user exists, generate a JWT token
    const payload = { id: user.id, mobile_number: user.mobile_number }; // Store relevant user info in the token payload

    // Generate the JWT token
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
    console.error("Error during login: ", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error." });
  }
};

// exports.userRegistration = async (req, res) => {
//   try {
//     const {
//       user_name,
//       user_mobile,
//       user_height,
//       user_weight,
//       user_email,
//       otpless_token,
//       target_weight,
//       per_exp,
//       sickness,
//       physical_activity,
//       gender,
//       fit_goal,
//       user_aadhar,
//       user_pan,
//       user_bank,
//       user_type,
//       user_age, // Taking user_age as input
//     } = req.body;

//     // Validate required fields
//     if (
//       !user_mobile ||
//       !user_height ||
//       !user_weight ||
//       !otpless_token ||
//       !user_age
//     ) {
//       return res.status(400).json({
//         status: 400,
//         success: false,
//         message:
//           "Required fields (user_mobile, user_height, user_weight, otpless_token, user_age) are missing.",
//       });
//     }

//     // Ensure that fields expected to be arrays are valid arrays
//     if (!Array.isArray(per_exp)) {
//       return res.status(400).json({
//         status: 401,
//         success: false,
//         message: "per_exp must be an array.",
//       });
//     }
//     if (!Array.isArray(sickness)) {
//       return res.status(400).json({
//         status: 402,
//         success: false,
//         message: "sickness must be an array.",
//       });
//     }
//     if (!Array.isArray(physical_activity)) {
//       return res.status(400).json({
//         status: 403,
//         success: false,
//         message: "physical_activity must be an array.",
//       });
//     }
//     if (!Array.isArray(fit_goal)) {
//       return res.status(400).json({
//         status: 405,
//         success: false,
//         message: "fit_goal must be an array.",
//       });
//     }

//     // Check if user already exists by user_mobile
//     const existingUser = await User.findOne({ where: { user_email } });

//     if (existingUser) {
//       return res.status(400).json({
//         status: 406,
//         success: false,
//         message: "User is already registered with this mail .",
//       });
//     }

//     // Create a new user record
//     const newUser = await User.create({
//       user_name: user_name || null,
//       user_mobile,
//       user_email: user_email ?? null,
//       user_height,
//       user_weight,
//       otpless_token,
//       user_dob: null, // Since user_age is provided, no need for user_dob here
//       user_age, // Now we directly store the user_age
//       user_aadhar: user_aadhar ?? null,
//       user_pan: user_pan ?? null,
//       user_address: "",
//       user_earned_coins: 0,
//       user_gullak_money_earned: 0,
//       user_gullak_money_used: 0,
//       user_competitions: "",
//       user_type: user_type ?? "normal",
//       user_social_media_id: "",
//       user_downloads: 0,
//       user_ratings: "",
//       user_qr_code: "",
//       user_bank: user_bank ?? null,
//       is_signup: 1,
//       is_approved: 0,
//     });

//     // Create a new user fitness data record
//     const newUserFitData = await UserFitData.create({
//       user_id: newUser.id,
//       target_weight: target_weight || 0,
//       per_exp: per_exp, // Serialized in the model
//       sickness: sickness, // Serialized in the model
//       physical_activity: physical_activity, // Serialized in the model
//       gender: gender || "unknown",
//       fit_goal: fit_goal, // Serialized in the model
//     });

//     // Create JWT token
//     const payload = { userId: newUser.id, user_mobile: newUser.user_mobile }; // Customize as needed
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     }); // Set the expiration time for the token (1 hour)

//     // Respond with success message and JWT
//     return res.status(201).json({
//       status: 200,
//       success: true,
//       message: "User registered successfully.",
//       data: {
//         user: newUser,
//         user_fit_data: newUserFitData,
//         token, // Sending the JWT token
//       },
//     });
//   } catch (error) {
//     console.error("Error during registration: ", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };


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
    // Extract pagination parameters from query string (default values: page=1, limit=10)
    const { page = 1, limit = 10 } = req.query;

    // Parse query parameters to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Calculate offset
    const offset = (pageNumber - 1) * pageSize;

    // Fetch users with pagination and specific fields
    const { count, rows } = await User.findAndCountAll({
      attributes: ["user_name", "user_age", "user_aadhar", "user_earned_coins"],
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
    const { id } = req.params; // Extract user ID from the request parameters

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
