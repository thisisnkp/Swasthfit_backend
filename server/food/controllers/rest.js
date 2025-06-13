const FoodRestaurant = require("../models/Restaurant");
const { Op, Sequelize } = require("sequelize");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const FoodItemOffer = require("../models/");
const fileUploaderSingle =
  require("../../../utilities/fileUpload").fileUploaderSingle;
const axios = require("axios");
const DietPackage = require("../models/dietpackage");
const FoodItem = require("../models/FoodItem");
const FoodOrders = require("../models/foodOrder");
const RestaurantDietPackage = require("../models/restaurentdietpackage");
const jwt = require("jsonwebtoken");
const client = require("../../user/user.model");
const ClientDietPlan = require("../models/clientdietplan");
const user = require("../../user/user.model");
const Vendor = require("../models/Vendor");
const csv = require("csv-parser");
const Cart = require("../models/Cart")
// Create a new restaurant

// exports.createRestaurant = async (req, res) => {
//   try {
//     const {
//       user_name,
//       password,
//       title,
//       diet_pack_id,
//       vendor_id,
//       status,
//       is_popular,
//       is_fitmode,
//       is_dietpkg,
//       is_dining,
//       full_address,
//       pincode,
//       landmark,
//       latitude,
//       longitude,
//       store_charge,
//       bank_name,
//       ifsc,
//       receipt_name,
//       acc_number,
//       rest_status,
//       sdesc,
//       pan_no,
//       gst_no,
//       fssai_no,
//       aadhar_no,
//       is_recommended,

//       rating,
//       delivery_time,
//       delivery_status,
//     } = req.body;

//     if (!req.files?.rimg) {
//       return res.status(400).json({ error: "Rest Image file is required." });
//     }

//     if (!req.files?.aadhar_image) {
//       return res.status(400).json({ error: "Aadhar Image file is required." });
//     }

//     const rimg = await fileUploaderSingle("./public/uploads/", req.files.rimg);
//     const aadhar_image = await fileUploaderSingle(
//       "./public/uploads/",
//       req.files.aadhar_image,
//     );
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const created_by = req?.user?.userId ?? 1;

//     const restaurant = await FoodRestaurant.create({
//       username: user_name,
//       password: hashedPassword,
//       title,
//       diet_pack_id,
//       vendor_id,
//       rimg: rimg.newFileName,
//       aadhar_image: aadhar_image.newFileName,
//       status,
//       is_popular,
//       is_fitmode,
//       is_dietpkg,
//       is_dining,
//       full_address,
//       pincode,
//       landmark,
//       latitude,
//       longitude,
//       store_charge,
//       bank_name,
//       ifsc,
//       receipt_name,
//       acc_number,
//       rest_status,
//       sdesc,
//       pan_no,
//       gst_no,
//       fssai_no,
//       aadhar_no,
//       is_recommended,
//       created_by,
//       rating: rating ?? 0,
//       delivery_time: delivery_time ?? null,
//       delivery_status: delivery_status ?? null,
//     });

//     // Reload to get default/virtual values if needed
//     await restaurant.reload();

//     res.status(201).json({
//       status: true,
//       message: "Restaurant created successfully",
//       restaurant: {
//         ...restaurant.toJSON(),
//         rimg: `uploads/${restaurant.rimg}`,
//         aadhar_image: `uploads/${restaurant.aadhar_image}`,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating restaurant:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// Ensure these imports are at the top of your file
// const bcrypt = require('bcrypt'); // Example: if you're using bcrypt
// const fileUploaderSingle = require('./path/to/fileUploaderSingle'); // Adjust path as needed
// const FoodRestaurant = require('./path/to/your/FoodRestaurantModel'); // Adjust path to your Sequelize model

exports.createRestaurant = async (req, res) => {
  try {
    const {
      username, // <--- CRITICAL FIX: Changed from 'user_name' to 'username'
      password,
      title,
      diet_pack_id, // This field is not present in your frontend form, consider if it's optional or needs a default.
      vendor_id,
      status,
      is_popular,
      is_fitmode,
      is_dietpkg,
      is_dining,
      full_address,
      pincode,
      landmark,
      latitude,
      longitude,
      store_charge,
      bank_name,
      ifsc,
      receipt_name,
      acc_number,
      rest_status,
      sdesc,
      pan_no,
      gst_no,
      fssai_no,
      aadhar_no,
      is_recommended,
      rating,
      delivery_time,
      delivery_status,
    } = req.body;

    // --- Input Validation and File Handling ---

    // Server-side validation for required fields from frontend
    if (!username || !password || !vendor_id || !title) {
        return res.status(400).json({ error: "Username, password, vendor ID, and restaurant title are required." });
    }

    if (!req.files?.rimg) {
      return res.status(400).json({ error: "Restaurant Image file is required." });
    }

    if (!req.files?.aadhar_image) {
      return res.status(400).json({ error: "Aadhar Image file is required." });
    }

    const rimg = await fileUploaderSingle("./public/uploads/", req.files.rimg);
    const aadhar_image = await fileUploaderSingle(
      "./public/uploads/",
      req.files.aadhar_image,
    );

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine created_by user ID (assuming req.user is set by authentication middleware)
    const created_by = req?.user?.userId ?? 1; // Default to 1 if user ID is not available

    // --- Create Restaurant Entry in Database ---
    const restaurant = await FoodRestaurant.create({
      username: username, // <--- CRITICAL FIX: Now uses the correctly destructured 'username'
      password: hashedPassword,
      title,
      // Handle diet_pack_id: If your DB schema allows null, `null` is fine.
      // Otherwise, provide a sensible default if it's not coming from frontend.
      diet_pack_id: diet_pack_id ?? null, // Example: explicitly set to null if not provided
      vendor_id,
      rimg: rimg.newFileName,
      aadhar_image: aadhar_image.newFileName,
      status,
      is_popular,
      is_fitmode,
      is_dietpkg,
      is_dining,
      full_address,
      pincode,
      landmark,
      latitude,
      longitude,
      store_charge,
      bank_name,
      ifsc,
      receipt_name,
      acc_number,
      rest_status,
      sdesc,
      pan_no,
      gst_no,
      fssai_no,
      aadhar_no,
      is_recommended,
      created_by,
      rating: rating ?? 0, // Provide default 0 if not sent
      delivery_time: delivery_time ?? null, // Provide default null if not sent
      delivery_status: delivery_status ?? null, // Provide default null if not sent
    });

    // Reload to get default/virtual values if needed (optional, depends on model setup)
    await restaurant.reload();

    res.status(201).json({
      status: true,
      message: "Restaurant created successfully",
      restaurant: {
        ...restaurant.toJSON(),
        rimg: `uploads/${restaurant.rimg}`,
        aadhar_image: `uploads/${restaurant.aadhar_image}`,
      },
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    // Send a more descriptive error message during development
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
// exports.createRestaurant = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);

//     const { username, password, title, vendor_id } = req.body;

//     // Mandatory field checks
//     if (!username)
//       return res.status(400).json({ error: "Username (email) is required." });
//     if (!password)
//       return res.status(400).json({ error: "Password is required." });
//     if (!title)
//       return res.status(400).json({ error: "Restaurant title is required." });
//     if (!vendor_id)
//       return res.status(400).json({ error: "Vendor ID is required." });

//     // Username must be a valid gmail address
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     if (!emailRegex.test(username)) {
//       return res
//         .status(400)
//         .json({
//           error:
//             "Username must be a valid Gmail address ending with @gmail.com.",
//         });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const created_by = req?.user?.userId ?? 1; // optional tracking field

//     const restaurant = await FoodRestaurant.create({
//       username,
//       password: hashedPassword,
//       title,
//       vendor_id,
//       created_by,
//       // All other fields are optional and will default to null or default values
//     });

//     res.status(201).json({
//       status: true,
//       message: "Restaurant created successfully",
//       restaurant,
//     });
//   } catch (error) {
//     console.error("Error creating restaurant:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await FoodRestaurant.findAll({
      include: [
        {
          model: DietPackage,
          as: "dietPackage",
          required: false,
          attributes: [
            "combo_price",
            "breakfast_price",
            "dinner_price",
            "lunch_price",
          ],
        },
      ],
    });

    // Base URL for serving images
    const baseUrl = "http://localhost:4001"; // Change this if your server URL is different

    const modifiedRestaurants = restaurants.map((restaurant) => {
      return {
        ...restaurant.toJSON(),
        rimg: restaurant.rimg
          ? `${baseUrl}/public/uploads/${restaurant.rimg}`
          : null,
        aadhar_image: restaurant.aadhar_image
          ? `${baseUrl}/public/uploads/${restaurant.aadhar_image}`
          : null,
        dietPackage: restaurant.dietPackage || null,
      };
    });

    return res.status(200).json({
      message: "All restaurants fetched successfully",
      restaurants: modifiedRestaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants with diet packages:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await FoodRestaurant.findByPk(req.params.id, {
      include: [
        {
          model: DietPackage,
          as: "dietPackage",
          required: false,
        },
        {
          model: FoodItem,
          as: "foodItems",
          required: false,
        },
      ],
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ status: false, message: "Restaurant not found" });
    }

    const restaurantData = restaurant.toJSON();

    const getImagePath = (img) => (img ? `uploads/${img}` : null);
    restaurantData.rimg = getImagePath(restaurantData.rimg);
    restaurantData.aadhar_image = getImagePath(restaurantData.aadhar_image);

    if (restaurantData.foodItems?.length) {
      restaurantData.foodItems = restaurantData.foodItems.map((item) => ({
        ...item,
        menu_img: getImagePath(item.menu_img),
      }));
    }

    return res.status(200).json({
      status: true,
      message: "Restaurant fetched successfully",
      data: restaurantData,
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await FoodRestaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        status: false,
        message: "Restaurant not found",
      });
    }

    // Update restaurant fields from req.body
    await restaurant.update(req.body);

    // Image fields: assume `rimg` and `aadhar_image` come from req.body (or use Multer if uploading)
    const updatedData = restaurant.toJSON();

    const getFullImagePath = (img) => (img ? `./public/uploads/${img}` : null);

    updatedData.rimg = getFullImagePath(updatedData.rimg);
    updatedData.aadhar_image = getFullImagePath(updatedData.aadhar_image);

    return res.status(200).json({
      status: true,
      message: "Restaurant updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await FoodRestaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Delete the image file if it exists
    const imagePath = path.join(
      __dirname,
      "../public/uploads/",
      restaurant.rimg,
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete the restaurant
    await restaurant.destroy();
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query; // Radius in km

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    const distanceQuery = `
  (6371 * acos(
    cos(radians(:latitude)) * cos(radians(\`FoodRestaurant\`.\`latitude\`)) *
    cos(radians(\`FoodRestaurant\`.\`longitude\`) - radians(:longitude)) +
    sin(radians(:latitude)) * sin(radians(\`FoodRestaurant\`.\`latitude\`))
  ))
`;

    const restaurants = await FoodRestaurant.findAll({
      attributes: {
        include: [[Sequelize.literal(distanceQuery), "distance"]],
      },
      where: Sequelize.literal(`${distanceQuery} < :radius`),
      replacements: { latitude, longitude, radius },
      order: Sequelize.literal("distance ASC"),
      include: [
        {
          model: DietPackage,
          as: "dietPackage", // Make sure this matches your association alias
          required: false, // to include even if no diet packages
        },
      ],
    });

    // Add path to images
    restaurants.forEach((restaurant) => {
      if (restaurant.rimg) {
        restaurant.rimg = `uploads/${restaurant.rimg}`;
      }
      if (restaurant.aadhar_image) {
        restaurant.aadhar_image = `uploads/${restaurant.aadhar_image}`;
      }
    });

    res.status(200).json({
      status: true,
      message: "Nearby restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getRestaurantDietPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await FoodRestaurant.findOne({
      where: { id },
      include: [
        {
          model: DietPackage,
          as: "dietPackage", // Must match the alias in association
        },
      ],
    });

    const restaurantData = restaurant.toJSON();

    return res.json({
      success: true,
      message: "Restaurant and Diet Package fetched successfully",
      data: {
        ...restaurantData,
        dietPackage: restaurantData.dietPackage || null,
      },
    });
  } catch (error) {
    console.error("Error fetching diet package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRestaurantWithMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await FoodRestaurant.findOne({
      where: { id },
      include: [
        {
          model: FoodItem,
          as: "foodItems",
        },
      ],
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ status: false, message: "Restaurant not found" });
    }

    const data = restaurant.get({ plain: true });

    const baseUrl = `http://localhost:4001/public/uploads/`; // Ensure the base URL is correct

    if (data.rimg && !data.rimg.startsWith("http")) {
      data.rimg = `${baseUrl}${data.rimg}`; // Append /public/uploads/ to rimg path
    } else if (data.rimg && data.rimg.startsWith(process.env.APP_URL)) {
      const fileName = data.rimg.split("/").pop(); // Get the file name if URL already starts with APP_URL
      data.rimg = `${baseUrl}${fileName}`;
    }

    if (data.aadhar_image && !data.aadhar_image.startsWith("http")) {
      data.aadhar_image = `${baseUrl}${data.aadhar_image}`; // Append /public/uploads/ to aadhar_image path
    } else if (
      data.aadhar_image &&
      data.aadhar_image.startsWith(process.env.APP_URL)
    ) {
      const fileName = data.aadhar_image.split("/").pop(); // Get the file name if URL already starts with APP_URL
      data.aadhar_image = `${baseUrl}${fileName}`;
    }

    if (data.foodItems?.length) {
      data.foodItems = data.foodItems.map((item) => {
        if (item.menu_img && !item.menu_img.startsWith("http")) {
          item.menu_img = `${baseUrl}${item.menu_img}`;
        } else if (
          item.menu_img &&
          item.menu_img.startsWith(process.env.APP_URL)
        ) {
          const fileName = item.menu_img.split("/").pop(); // Get the file name if URL already starts with APP_URL
          item.menu_img = `${baseUrl}${fileName}`;
        }
        return item;
      });
    }

    return res.status(200).json({
      status: true,
      message: "Restaurant fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const restaurant = await FoodRestaurant.findByPk(restaurantId, {
      include: [
        {
          model: FoodOrders,
          as: "orders",
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        status: false,
        message: "Restaurant not found",
      });
    }

    const formattedOrders = restaurant.orders.map((order) => {
      let addressDetails = order.address_details;
      let itemDetails = order.item_details;

      // Handle double-encoded JSON safely
      const parseJSON = (str) => {
        try {
          const parsed = JSON.parse(str);
          return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        } catch {
          return {};
        }
      };

      return {
        ...order.toJSON(),
        address_details: parseJSON(addressDetails),
        item_details: parseJSON(itemDetails),
      };
    });

    // Count cancelled orders
    const cancelledOrdersCount = formattedOrders.filter(
      (order) => order.status === "Rejected",
    ).length;

    // Sum total order price for accepted orders only
    const totalOrderPrice = formattedOrders
      .filter((order) => order.status !== "Rejected")
      .reduce((sum, order) => {
        return sum + parseFloat(order.total_amount || 0);
      }, 0);

    res.status(200).json({
      status: true,
      message: "Orders for this restaurant",
      count: formattedOrders.length,
      cancelled_count: cancelledOrdersCount,
      total_order_price: totalOrderPrice.toFixed(2), // sum only accepted orders
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getRestaurantsWithDietPackage = async (req, res) => {
  try {
    const restaurants = await FoodRestaurant.findAll({
      where: {
        diet_pack_id: {
          [require("sequelize").Op.ne]: null, // not null
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Restaurants with diet packages fetched successfully.",
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants with diet package:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching restaurants.",
    });
  }
};

// restaurant diet
exports.getDiet = async (req, res) => {
  try {
    // Fetch all restaurants offering diet packages with the associated dietPackage details
    const dietRestaurants = await FoodRestaurant.findAll({
      where: {
        is_dietpkg: true, // Only fetch restaurants with 'is_dietpkg' set to true
      },
      include: [
        {
          model: DietPackage,
          as: "dietPackage",
          required: false,
        },
      ],
    });

    if (dietRestaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No diet package restaurants found",
      });
    }

    res.status(200).json({
      success: true,
      data: dietRestaurants,
    });
  } catch (error) {
    console.error("Error fetching diet package restaurants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch diet package restaurants",
    });
  }
};

exports.getUsersForRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Fetch the restaurant by ID
    const restaurant = await FoodRestaurant.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({
        status: false,
        message: "Restaurant not found",
      });
    }

    // Fetch all users linked to this restaurant
    const users = await client.findAll({
      where: { restaurant_id: restaurant.id },
      include: [
        {
          model: FoodRestaurant,
          as: "restaurant",
          attributes: ["id", "username", "title"],
        },
      ],
    });

    // Even if no users, respond with empty list but with count = 0
    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      count: users.length, // 👈 Count added here
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users for restaurant:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};exports.getUsersForRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Fetch the restaurant by ID
    const restaurant = await FoodRestaurant.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({
        status: false,
        message: "Restaurant not found",
      });
    }

    // Fetch all users linked to this restaurant
    const users = await client.findAll({
      where: { restaurant_id: restaurant.id },
      include: [
        {
          model: FoodRestaurant,
          as: "restaurant",
          attributes: ["id", "username", "title"],
        },
      ],
    });

    // Even if no users, respond with empty list but with count = 0
    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      count: users.length, // 👈 Count added here
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users for restaurant:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.Restlogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Find restaurant by username
    const restaurant = await FoodRestaurant.findOne({ where: { username } });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // 🔐 Compare hashed password
    const isMatch = await bcrypt.compare(password, restaurant.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid password" });
    // }

    // ✅ Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: restaurant.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION || "1d",
    });

    // ✅ Return success (excluding password)
    res.status(200).json({
      message: "Login successful",
      token,
      restaurant: {
        id: restaurant.id,
        username: restaurant.username,
        title: restaurant.title,
        full_address: restaurant.full_address,
        status: restaurant.status,
        rating: restaurant.rating,
        store_charge: restaurant.store_charge,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLoggedInRestaurantOrders = async (req, res) => {
  const restaurantId = req.restaurant?.id || req.user?.id; // depends on how you're storing it

  try {
    const restaurant = await FoodRestaurant.findByPk(restaurantId, {
      include: [
        {
          model: FoodOrders,
          as: "orders",
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        status: false,
        message: "Restaurant not found",
      });
    }

    const parseJSON = (str) => {
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      } catch {
        return {};
      }
    };

    const formattedOrders = restaurant.orders.map((order) => ({
      ...order.toJSON(),
      address_details: parseJSON(order.address_details),
      item_details: parseJSON(order.item_details),
    }));

    res.status(200).json({
      status: true,
      message: "Orders for logged-in restaurant",
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
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
      otpless_token,
      target_weight,
      per_exp,
      sickness,
      physical_activity,
      gender,
      fit_goal,
      user_aadhar,
      user_pan,
      user_bank,
      password,
      user_type,
      user_age, // Taking user_age as input
    } = req.body;

    // Validate required fields: user_name, user_email, password, and user_type
    if (!user_name || !user_email || !password || !user_type) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Required fields (user_name, user_email, password, user_type) are missing.",
      });
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(user_name)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Name must contain only letters and spaces (no special characters or numbers).",
      });
    }
// ...existing code...
    // Email validation: must be a real email (gmail, yahoo, outlook, .in, etc.), not demo/test/fake
    const allowedDomains = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      ".in",
      ".co.in",
      "@hotmail.com",
      "@rediffmail.com",
      "@icloud.com",
      "@protonmail.com",
      "@zoho.com",
    ];
    const lowerEmail = user_email.toLowerCase();

    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user_email)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please enter a valid email address format (e.g., user@gmail.com).",
      });
    }

    const isAllowedDomain = allowedDomains.some((domain) =>
      lowerEmail.endsWith(domain)
    );
    const isFakeEmail =
      /(demo|test|example|fake|temp|sample)/i.test(lowerEmail) ||
      lowerEmail.startsWith("test") ||
      lowerEmail.startsWith("demo");

    if (!isAllowedDomain) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Only personal or business email addresses are allowed (gmail, yahoo, outlook, .in, etc.).",
      });
    }
    if (isFakeEmail) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Demo, test, or fake email addresses are not allowed. Please use your real email address.",
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ where: { user_email } });
    if (existingUserByEmail) {
      return res.status(400).json({
        status: 407,
        success: false,
        message: "User is already registered with this email address.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
// Create new user
// const newUser = await User.create({
//   user_name,
//   user_mobile: user_mobile || null,
//   user_email,
//   user_height: user_height || null,
//   user_weight: user_weight || null,
//   otpless_token: otpless_token || null,
//   user_dob: null,
//   user_age: user_age || null,
//   user_aadhar: user_aadhar || null,
//   user_pan: user_pan || null,
//   user_address: "",
//   user_earned_coins: 0,
//   user_gullak_money_earned: 0,
//   user_gullak_money_used: 0,
//   user_competitions: "",
//   user_type,
//   user_social_media_id: "",
//   user_downloads: 0,
//   user_ratings: "",
//   user_qr_code: "",
//   user_bank: user_bank || null,
//   is_signup: 1,
//   is_approved: 0,
//   password: hashedPassword,
// });

// // 🔁 Immediately fetch the vendor linked to this user
// let vendor = null;
// if (user_type === "owner") {
//   vendor = await Vendor.findOne({ where: { user_id: newUser.id } });
// }
const newUser = await User.create({
  user_name,
  user_mobile: user_mobile || null,
  user_email,
  user_height: user_height || null,
  user_weight: user_weight || null,
  otpless_token: otpless_token || null,
  user_dob: null,
  user_age: user_age || null,
  user_aadhar: user_aadhar || null,
  user_pan: user_pan || null,
  user_address: "",
  user_earned_coins: 0,
  user_gullak_money_earned: 0,
  user_gullak_money_used: 0,
  user_competitions: "",
  user_type,
  user_social_media_id: "",
  user_downloads: 0,
  user_ratings: "",
  user_qr_code: "",
  user_bank: user_bank || null,
  is_signup: 1,
  is_approved: 0,
  password: hashedPassword,
});

let vendor = null;
if (user_type === "owner") {
  vendor = await Vendor.create({
    user_id: newUser.id,
    name: newUser.user_name,
    email: newUser.user_email,
    phone: newUser.user_mobile,
    password: hashedPassword,
    vendorType: "restaurant",
  });

  // Optional: update user with vendor_id
  await newUser.update({ vendor_id: vendor.id });
}

    // Create new user
    // const newUser = await User.create({
    //   user_name,
    //   user_mobile: user_mobile || null,
    //   user_email,
    //   user_height: user_height || null,
    //   user_weight: user_weight || null,
    //   otpless_token: otpless_token || null,
    //   user_dob: null,
    //   user_age: user_age || null,
    //   user_aadhar: user_aadhar || null,
    //   user_pan: user_pan || null,
    //   user_address: "",
    //   user_earned_coins: 0,
    //   user_gullak_money_earned: 0,
    //   user_gullak_money_used: 0,
    //   user_competitions: "",
    //   user_type,
    //   user_social_media_id: "",
    //   user_downloads: 0,
    //   user_ratings: "",
    //   user_qr_code: "",
    //   user_bank: user_bank || null,
    //   is_signup: 1,
    //   is_approved: 0,
    //   password: hashedPassword,
    // });

    // // If owner, create vendor entry
    // if (user_type === "owner") {
    //   await Vendor.create({
    //     user_id: newUser.id,
    //     name: newUser.user_name,
    //     email: newUser.user_email,
    //     phone: newUser.user_mobile,
    //     password: hashedPassword,
    //     vendorType: "restaurant",
    //   });

    //   console.log(`RestVendor created for user ID: ${newUser.id}`);
    // }

    // Generate JWT token
    const payload = {
      userId: newUser.id,
      user_mobile: newUser.user_mobile,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with user and token
//     return res.status(201).json({
//   status: 200,
//   success: true,
//   message: "User registered successfully.",
//   data: {
//     user: newUser,
//     vendor_id: vendor ? vendor.id : null, // <-- this is vendor's id from restvendors table
//     token,
//   },
// });
return res.status(201).json({
  status: 200,
  success: true,
  message: "User registered successfully.",
  data: {
    user: newUser,
    vendor_id: vendor ? vendor.id : null,
    token,
  },
});

    // return res.status(201).json({
    //   status: 200,
    //   success: true,
    //   message: "User registered successfully.",
    //   data: {
    //     user: newUser,
    //     token,
    //   },
    // });
  } catch (error) {
    console.error("Error during registration: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    // Basic validation
    if (!user_email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    // Check if user exists
    const existingUser = await user.findOne({ where: { user_email } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare the password
    // const isPasswordValid = await bcrypt.compare(
    //   password,
    //   existingUser.password,
    // );
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid password!" });
    // }

    // Generate a JWT token
    const token = jwt.sign(
      { user_id: existingUser.id, user_email: existingUser.user_email }, // Payload
      process.env.JWT_SECRET, // JWT Secret key (make sure it's in your .env)
      { expiresIn: "1h" }, // Token expires in 1 hour
    );

    return res.status(200).json({
      message: "Login successful!",
      data: {
        user_id: existingUser.id,
        user_name: existingUser.user_name,
        user_email: existingUser.user_email,
        token, // Send token to client
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



exports.addDietPlanToRestaurant = async (req, res) => {
  try {
    const {
      client_diet_plan_id,
      restaurant_id,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      optional_item_price,
      status = "Pending",
      remark = null,
    } = req.body;

    // Validate required fields
    if (!client_diet_plan_id || !restaurant_id) {
      return res
        .status(400)
        .json({ message: "Missing diet plan ID or restaurant ID." });
    }

    // Check if diet plan exists
    const dietPlan = await ClientDietPlan.findByPk(client_diet_plan_id);
    if (!dietPlan) {
      return res.status(404).json({ message: "Diet plan not found." });
    }

    // Check if restaurant exists
    const restaurant = await FoodRestaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // Check if already added
    const existing = await RestaurantDietPackage.findOne({
      where: { client_diet_plan_id, restaurant_id },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Diet plan already added to this restaurant." });
    }

    // Add the diet plan to restaurant
    const newEntry = await RestaurantDietPackage.create({
      client_diet_plan_id,
      restaurant_id,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      optional_item_price,
      status,
      remark,
    });

    return res.status(201).json({
      message: "✅ Diet plan successfully added to restaurant",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Error in addDietPlanToRestaurant:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET /food/site/apis/diets-by-restaurant/:restaurantId

exports.getAllDietsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    const diets = await RestaurantDietPackage.findAll({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: ClientDietPlan,
          as: "dietPlan", // ✅ Correct alias here
          attributes: [
            "id",
            "meal_type",
            "food_item_name",
            "optional_item_name",
            "food_type",
            "fats",
            "protein",
            "carbs",
            "is_water_intake",
            "water_intake",
            "water_intake_unit",
            "plan_days",
          ],
        },
      ],
      order: [["id"]],
    });

    return res.status(200).json({
      message: " Diet plans fetched successfully",
      data: diets,
    });
  } catch (error) {
    console.error(" Error fetching diets by restaurant:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// for marketting pannel

const RestVendor = require("../models/Vendor");
exports.generateToken = async (req, res) => {
  try {
    const { module_type, email } = req.body;
    console.log("Request body:", req.body);
    if (!module_type || !email) {
      return res
        .status(400)
        .json({ message: "module_type and email are required" });
    }
    let vendorData;
    let vendorId;
    let name;
    // Check module type and fetch data accordingly
    if (module_type === "restaurant") {
      vendorData = await RestVendor.findOne({ where: { email } });
    } else if (module_type === "gym") {
      vendorData = await GymOwner.findOne({ where: { email } });
    } else if (module_type === "ecom") {
      vendorData = await Vendor.findOne({ where: { email } });
    } else {
      return res.status(400).json({ message: "Invalid module_type" });
    }
    console.log("Vendor data:", vendorData);
    // Check if vendor exists and is verified
    if (!vendorData) {
      return res
        .status(404)
        .json({ message: "Vendor not found or not verified" });
    }
    vendorId = vendorData.id;
    name = vendorData.name || vendorData.shop_name || vendorData.businessName;
    // Generate token payload
    const payload = {
      module_type,
      vendor_id: vendorId,
      name,
    };
    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Respond with the token
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.importCustomers = async (req, res) => {
  let tempPath;

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ status: false, message: "Missing restaurant ID" });
    }

    // Check if restaurant exists
    const restaurant = await FoodRestaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: false, message: "Restaurant not found" });
    }

    const file = req.files.file;
    tempPath = path.join(process.cwd(), "temp-users.csv");
    await file.mv(tempPath);

    const users = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(tempPath)
        .pipe(csv())
        .on("data", (row) => {
          if (!row.user_name || !row.password || !row.user_type) return;

          users.push({
            user_name: row.user_name.trim(),
            user_email: row.user_email ? row.user_email.trim() : null,
            password: row.password.trim(),
            user_type: row.user_type.trim(),
            restaurant_id: restaurantId, // 🔥 Link user to restaurant
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (users.length === 0) {
      fs.unlinkSync(tempPath);
      return res.status(400).json({ status: false, message: "No valid users found in file" });
    }

    // Insert users
    const createdUsers = await User.bulkCreate(users, { returning: true });

    fs.unlinkSync(tempPath);

    const importedUsers = createdUsers.map((u) => ({
      id: u.id,
      user_name: u.user_name,
      user_email: u.user_email,
      user_type: u.user_type,
      restaurant_id:restaurantId
    }));
console.log("user " , importedUsers);

    return res.status(200).json({
      status: true,
      message: "Users imported successfully",
      imported: importedUsers.length,
      users: importedUsers,
    });
  } catch (error) {
    console.error("Error importing users:", error);
    if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    return res.status(500).json({ status: false, message: error.message });
  }
};


exports.addToCart = async (req, res) => {
  const { user_id, id: fooditem_id, quantity } = req.body;
  console.log(req.body);

  try {
    // Step 1: Validate food item
    const foodItem = await FoodItem.findByPk(fooditem_id);
    if (!foodItem) {
      return res.status(404).json({
        status: false,
        message: "Food item not found",
      });
    }

    // Step 2: Check for existing cart entry
    let cartItem = await Cart.findOne({
      where: { user_id, fooditem_id },
      include: [{ model: FoodItem, as: "foodItem" }],
    });

    if (cartItem) {
      // Step 3: Update quantity
      cartItem.quantity += parseInt(quantity) || 1;
      await cartItem.save();
    } else {
      // Step 4: Create new cart entry
      cartItem = await Cart.create({
        user_id,
        fooditem_id,
        quantity: parseInt(quantity) || 1,
      });
      // Reload cart item with associated FoodItem
      cartItem = await Cart.findByPk(cartItem.id, {
        include: [{ model: FoodItem, as: "foodItem" }],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Item added to cart successfully",
      cart: cartItem,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
