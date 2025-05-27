const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("./user.model"); //user model
const UserFitData = require("./userfitdata.model"); //user fit model
const Trainer = require("./trainer.model")
const { use } = require("./user.route");
const { Op } = require('sequelize');


// login function
exports.userLogin = async (req, res) => {
  try {
    const { mobileNumber, token, user_type } = req.body;

    // Validate input
    if (!mobileNumber) {
      return res
        .status(400)
        .json({
          status: 400,
          success: false,
          message: "Mobile number and token are required.",
        });
    }

    // Find the user from the database (you can also use Sequelize to find the user)
    const user = await User.findOne({
      where: { user_mobile: mobileNumber, user_type: user_type },
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
    const payload = { id: user.id, mobile_number: user.mobile_number }; 
    
    // Store relevant user info in the token payload

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
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_mobile }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User with this mobile number or email already exists.",
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
        !time_slot
      ) {
        return res.status(400).json({
          status: 400,
          success: false,
          message:
            "Trainer fields (firstname, lastname, expertise, experience, address, bank_account_no, ifsc_code, time_slot) are required.",
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
      if (!Array.isArray(per_exp) || !Array.isArray(sickness) || !Array.isArray(physical_activity) || !Array.isArray(fit_goal)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Fields per_exp, sickness, physical_activity, and fit_goal must be arrays.",
        });
      }
    }
    // Insert user into the User table
    const newUser = await User.create({
      user_name,
      user_mobile,
      user_email,
      user_type,
    });

    // Insert additional data into UserFitData for general users
    if (user_type !== "trainer") {
      await UserFitData.create({
        user_id: newUser.id, // Link UserFitData with the user
        user_height,
        user_weight,
        target_weight,
        per_exp: JSON.stringify(per_exp),
        sickness: JSON.stringify(sickness),
        physical_activity: JSON.stringify(physical_activity),
        gender,
        fit_goal: JSON.stringify(fit_goal),
        user_aadhar,
        user_pan,
        user_bank,
        user_age,
      });
    }

    // Insert trainer-specific data into Trainer table
    if (user_type === "trainer") {
      await Trainer.create({
        user_id: newUser.id, // Link Trainer data with the user
        firstname,
        lastname,
        expertise,
        experience,
        address,
        bank_account_no,
        ifsc_code,
        time_slot,
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
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
    });
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
        message: 'User ID is required.',
      });
    }

    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found.',
      });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    console.error('Error during user deletion:', error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error.',
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
      attributes: ['id', 'user_name', 'user_age', 'user_aadhar', 'user_earned_coins'],
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
        message: 'No users found.',
      });
    }

    // Prepare pagination details
    const totalPages = Math.ceil(count / pageSize);

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Users fetched successfully.',
      data: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        pageSize,
        totalRecords: count,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error.',
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
        message: 'User not found',
      });
    }

    // Update user in the database
    await user.update(updateData); // Update the user instance

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user, // Send the updated user object
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Getting all data for user
exports.getUserDetails = async (req, res) => {
  try {
    //const { id } = req.params; // Extract user ID from the request parameters
    const id = req.user.id ?? req.user.userId
    console.log("User", id)
    // Find the user with the associated UserFitData
    const user = await User.findOne({
      where: { id }, // Match the user ID
      include: [
        {
          model: UserFitData,  // Include associated UserFitData
          as: 'user_fit_data',   // Match alias defined in the association
        },
      ],
    });

    // If user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user details and associated data
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
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
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


