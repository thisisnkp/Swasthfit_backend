const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("./user.model"); //user model
const UserFitData = require("./userfitdata.model"); //user fit model
const { use } = require("./user.route");
const FoodItem = require("../food/models/FoodItem")
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



exports.getAllUsers = async (req, res) => {
  try {
    // Optional: Basic pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Optional filtering by user_type or email, etc.
    if (req.query.user_type) {
      whereClause.user_type = req.query.user_type;
    }
    if (req.query.search) {
      whereClause[Op.or] = [
        { user_name: { [Op.like]: `%${req.query.search}%` } },
        { user_email: { [Op.like]: `%${req.query.search}%` } },
        { user_mobile: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users.rows,
      total: users.count,
      currentPage: page,
      totalPages: Math.ceil(users.count / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
