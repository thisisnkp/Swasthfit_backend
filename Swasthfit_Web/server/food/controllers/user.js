const Category = require("../models/FoodCategory");
const FoodOrders= require("../models/foodOrder");
const FoodRestaurant = require("../models/Restaurant");
const UserProductAction = require("../models/userproductaction")
const fileUploaderSingle =
  require("../../../utilities/fileUpload").fileUploaderSingle;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.createUser = async (req, res) => {
//   try {
//     const { user_name, password, user_type } = req.body;

//     const existingUser = await User.findOne({ where: { user_name } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already taken." });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 8);

//     const user = await User.create({
//       user_name,
//       password: hashedPassword,
//       user_type,
//     });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, user_name: user.user_name, user_type: user.user_type },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
//     );

//     res.status(201).json({
//       success: "User created successfully!",
//       user: {
//         id: user.id,
//         user_name: user.user_name,
//         user_type: user.user_type,
//         user_email: user.user_email,
//       },
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.createUser = async (req, res) => {
  try {
    const { user_name, user_email, password, user_type } = req.body;

    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Check duplicate email (optional but better)
    const existingEmail = await User.findOne({ where: { user_email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await User.create({
      user_name,
      user_email, // <-- Add this
      password: hashedPassword,
      user_type,
    });

    const token = jwt.sign(
      { id: user.id, user_name: user.user_name, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(201).json({
      success: "User created successfully!",
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_type: user.user_type,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { user_name } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // JWT claims
    const payload = {
      iss: 'http://127.0.0.1:8000/api/store-login', // Issuer of the token
      iat: Math.floor(Date.now() / 1000),  // Issued at time
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expiration time (1 day from issued time)
      nbf: Math.floor(Date.now() / 1000), // Not before time
      jti: generateJti(), // JWT ID (a unique identifier for the token)
      sub: user.id, // Subject of the token (user ID)
      prv: user.private_data || '', // Custom claim (optional)
    };

    // Sign the JWT with claims, don't specify expiresIn here
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Return the response with the token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate a unique JWT ID (this can be a random string or use any method you prefer)
function generateJti() {
  return Math.random().toString(36).substring(2, 15); // Example: Generates a random alphanumeric string
}

exports.createFoodOrder = async (req, res) => {
  try {
    const {
      user_id,
      restaurant_id,
      address_details,
      item_details,
      total_amount
    } = req.body;

    // Validate user
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate restaurant (optional, for safety)
    const restaurant = await FoodRestaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // Generate a unique order ID like ORD-12345678
    const order_id = `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Create order
    const newOrder = await FoodOrders.create({
      order_id,
      user_id,
      restaurant_id,
      address_details: JSON.stringify(address_details),
      item_details: JSON.stringify(item_details),
      total_amount,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message
    });
  }
};

// get all users 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Don't return password
    });

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching users",
      error: error.message,
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while fetching the user",
      error: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    if (!order_id || !status) {
      return res.status(400).json({ status: false, message: "order_id and status are required" });
    }

    const order = await FoodOrders.findOne({ where: { order_id } });

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      status: true,
      message: "Order Status Changed successfully",
      data: {
        orderStatusChnage: order.status,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status } = req.query;

    const whereClause = { user_id };
    if (status) whereClause.status = status;

    const orders = await FoodOrders.findAll({ where: whereClause });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};
// Get a User by ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a User
exports.updateUser = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    const { name, description, parent_id } = req.body;

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    const created_by = req?.user?.userId ?? 1;
    let image;
    if (req.files && req.files.image) {
      image = await fileUploaderSingle("./public/uploads/", req.files.image);
    } else {
      return res.status(400).json({ error: "Image file is required." });
    }
    const updated = await category.update({
      name,
      description,
      // created_by,
      parent_id,
      img: image.newfileName,
    });
    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: true, message: error.message });
  }
};

// Delete a User
exports.deleteUser = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    const deleted = await category.destroy();
    return res.status(200).json({
      status: true,
      message: "Category delete successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: true, message: error.message });
  }
};

// show user details 

exports.getUserProfile = async function(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const restaurants = await FoodRestaurant.findAll({
      where: { vendor_id: user.id },
    });

    res.json({
      user,
      restaurants,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// cancel order 
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    // Find the order
    const order = await FoodOrders.findOne({ where: { order_id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Optional: prevent cancelling if already delivered or cancelled
    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    // Cancel the order
    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};


// create user action on fooditem 
exports.createUserProductAction = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      product_id,
      action
    } = req.body;

    // Static module_type (always 'rest')
    const module_type = 'Restaurent';

  
    const user_id = req.user?.id || req.body.user_id;

    if (!user_id || !product_id || !action) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const userAction = await UserProductAction.create({
      user_id,
      latitude,
      longitude,
      product_id,
      module_type,
      action
    });

    return res.status(201).json({
      latitude: userAction.latitude,
      longitude: userAction.longitude,
      product_id: userAction.product_id,
      module_type: userAction.module_type,
      action: userAction.action
    });

  } catch (error) {
    console.error('Error logging user action:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};




