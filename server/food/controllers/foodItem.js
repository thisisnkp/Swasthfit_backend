const FoodItem = require("../models/FoodItem");
const fileUploaderSingle =
  require("../../../utilities/fileUpload").fileUploaderSingle;
const FoodItemOffer = require("../models/ItemOffer");
const FoodRestaurant = require("../models/Restaurant");
const FoodOrders = require("../models/foodOrder");
const slugify = require("slugify");

// exports.createfoodItem = async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       restaurant_id,
//       category_id,
//       menu_name,         // Product Name
//       description,       // Description
//       price,             // Price
//       ingredients,       // Ingredients
//       created_by,        // Created By
//       is_veg,            // Food Type (Veg/Non-Veg string)
//       cuisine_type       // Cuisine Type
//     } = req.body;

//     // Validate mandatory fields
//     if (!restaurant_id || !category_id || !menu_name || !description || !price || !ingredients || !created_by || !cuisine_type || (is_veg === undefined || is_veg === null || is_veg === '')) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Handle image upload (if any)
//     let uploadedImage;
//     if (req.files && req.files.menu_img) {
//       console.log("Uploading image:", req.files.menu_img.name);
//       uploadedImage = await fileUploaderSingle("./public/uploads/", req.files.menu_img);
//       console.log("Uploaded image:", uploadedImage);
//     }
// console.log(uploadedImage);

//     // Convert is_veg from string to boolean
//     let isVegBoolean = false;
//     if (typeof is_veg === 'string') {
//       isVegBoolean = is_veg.toLowerCase() === 'veg' ? true : false;
//     } else if (typeof is_veg === 'boolean') {
//       isVegBoolean = is_veg;
//     }

//     // Generate slug from menu name
//     const slug = slugify(menu_name, { lower: true, strict: true });

//     // Create the food item
//     const foodItem = await FoodItem.create({
//       restaurant_id,
//       category_id,
//       menu_name,
//       slug,
//       description,
//       price,
//       ingredients,
//       created_by,
//       menu_img: uploadedImage?.newFileName || null,
//       is_veg: isVegBoolean,
//       cuisine_type
//     });

//     // Generate the full image path
//     const fullImagePath = foodItem.menu_img
//       ? `${process.env.APP_URL}/uploads/${foodItem.menu_img}`
//       : null;

//     return res.status(201).json({
//       message: "Food item created successfully",
//       data: {
//         ...foodItem.toJSON(),
//         menu_img: fullImagePath, // full image URL
//       },
//     });
//   } catch (error) {
//     console.error("Error creating food item:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.createfoodItem = async (req, res) => {
  const io = req.app.get("io");
  try {
    const {
      restaurant_id,
      category_id,
      menu_name, // Product Name
      description, // Description
      price, // Price
      discount, // Discount in percentage
      total_quantity, // Quantity
      unit, // Unit (Plate, Bowl etc.)
      cost_price, // Cost price
      calories, // Calories
      diet_type, // veg, non_veg, vegan, eggetarian
      variants, // Small, Medium, Large (comma separated)
      addons, // Extra Cheese, Gravy (comma separated)
      spice_level, // none, mild, medium, hot
      tags, // Bestseller, Kids (comma separated)
      prep_time, // Prep time in minutes

      available, // true/false

      is_recommended, // true/false
      rating, // float
      distance, // float
      ingredients, // comma separated
      cuisine_type, // Indian, Chinese etc.
      created_by, // Created By user id
    } = req.body;

    // Validate required fields
    if (
      !restaurant_id ||
      !category_id ||
      !menu_name ||
      !description ||
      !price ||
      !cuisine_type
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Handle image upload
    let uploadedImage;
    if (req.files && req.files.menu_img) {
      uploadedImage = await fileUploaderSingle(
        "./public/uploads/",
        req.files.menu_img,
      );
    }

    // Convert is_veg to boolean (in case string is passed)
    let isVegBoolean = false;
    if (typeof is_veg === "string") {
      isVegBoolean = is_veg.toLowerCase() === "veg" ? true : false;
    } else if (typeof is_veg === "boolean") {
      isVegBoolean = is_veg;
    }

    // Slugify menu name
    const slug = slugify(menu_name, { lower: true, strict: true });

    // Create food item
    const foodItem = await FoodItem.create({
      restaurant_id,
      category_id,
      menu_name,
      slug,
      description,
      menu_img: uploadedImage?.newFileName || null,
      price,
      discount: discount || 0.0,
      total_quantity,
      unit,
      cost_price,
      calories,
      diet_type: diet_type || "veg",
      variants,
      addons,
      spice_level: spice_level || "none",
      tags,
      prep_time,
      available: available === undefined ? true : available,
      is_recommended: is_recommended || false,
      rating: rating || 0.0,
      distance,
      ingredients,
      cuisine_type,
      created_by,
    });

    io.emit("notification", {
      type: "Product",
      message: `New product (${foodItem.menu_name || foodItem.id}) created by User ${created_by}`,
      timestamp: new Date().toISOString(),
      product_id: foodItem.id,
      user_id: created_by,
    });

    // Full image URL
    const fullImagePath = foodItem.menu_img
      ? `${process.env.APP_URL}public/uploads/${foodItem.menu_img}`
      : null;

    return res.status(201).json({
      message: "Food item created successfully",
      data: {
        ...foodItem.toJSON(),
        menu_img: fullImagePath,
      },
    });
  } catch (error) {
    console.error("Error creating food item:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.findAll();

    // Correct Base URL
    const baseUrl = `http://localhost:4001/uploads/`; // 👈 this matches your folder structure

    // Add correct image URL to each item
    const updatedItems = foodItems.map((item) => {
      const itemJson = item.toJSON();
      return {
        ...itemJson,
        menu_img: itemJson.menu_img ? `${baseUrl}${itemJson.menu_img}` : null,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Food items fetched successfully",
      data: {
        baseUrl,
        foodItems: updatedItems,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// // Get a food item by ID

exports.getFoodItemsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const foodItems = await FoodItem.findAll({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: FoodItemOffer,
          as: "offers",
        },
        {
          model: FoodRestaurant,
          as: "restaurant",
          attributes: ["id"],
        },
      ],
      order: [["id", "DESC"]],
    });

    const baseUrl = `http://localhost:4001/public/uploads/`;

    // Add full image path
    const updatedFoodItems = foodItems.map((item) => {
      const itemJson = item.toJSON();
      return {
        ...itemJson,
        menu_img: itemJson.menu_img ? `${baseUrl}${itemJson.menu_img}` : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      data: updatedFoodItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update a food item

exports.updateFoodItem = async (req, res) => {
  try {
    // Fetch food item by ID
    const foodItem = await FoodItem.findByPk(req.params.id);

    // Extract fields from request body
    const {
      menu_name,
      description,
      parent_id,
      is_recommended,
      total_quantity,
    } = req.body;

    // Log request body for debugging
    console.log("Request body:", req.body);

    if (!foodItem) {
      return res.status(404).json({
        status: false,
        message: "Food item not found",
      });
    }

    const created_by = req.user.userId;

    // Handle menu image update
    let menu_img = foodItem.menu_img;
    if (req.files && req.files.image) {
      const uploadedImage = await fileUploaderSingle(
        "./public/uploads/",
        req.files.image,
      );
      menu_img = uploadedImage.newFileName;
    }

    // Update only the fields that are provided
    await foodItem.update({
      menu_name: menu_name ?? foodItem.menu_name,
      description: description ?? foodItem.description,
      parent_id: parent_id ?? foodItem.parent_id,
      is_recommended: is_recommended ?? foodItem.is_recommended,
      total_quantity: total_quantity ?? foodItem.total_quantity,
      menu_img,
      created_by,
    });

    // Fetch updated food item
    const updatedFoodItem = await FoodItem.findByPk(req.params.id);

    // Construct full image URL
    const fullImagePath = updatedFoodItem.menu_img
      ? `${process.env.APP_URL}/uploads/${updatedFoodItem.menu_img}`
      : null;

    // Respond with updated data
    return res.status(200).json({
      status: true,
      message: "Updated successfully",
      data: {
        ...updatedFoodItem.toJSON(),
        menu_img: fullImagePath,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a food item
exports.deleteFoodItemById = async (req, res) => {
  const { food_item_id } = req.params; // Get the food_item_id from the request parameters

  try {
    // Find the FoodItem instance using the food_item_id
    const foodItem = await FoodItem.findOne({
      where: { id: food_item_id },
    });

    // If no food item found, return an error
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Optionally, delete the food item itself
    await foodItem.destroy();

    return res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getFoodItemsWithOffers = async (req, res) => {
  try {
    const foodItems = await FoodItem.findAll({
      include: [
        {
          model: FoodItemOffer,
          as: "offers",
          attributes: ["offer_price", "image", "end_date", "start_date"],
        },
      ],
    });

    // Add full image path for food items and offers
    const result = foodItems.map((item) => {
      const fullFoodImagePath = item.menu_img
        ? `${process.env.APP_URL}/uploads/${item.menu_img}`
        : null;

      const offers = item.offers.map((offer) => {
        const fullOfferImagePath = offer.image
          ? `${process.env.APP_URL}/uploads/${offer.image}`
          : null;
        return {
          ...offer.toJSON(),
          image: fullOfferImagePath,
        };
      });

      return {
        ...item.toJSON(),
        menu_img: fullFoodImagePath,
        offers,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching food items with offers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllFoodItemsWithOrders = async (req, res) => {
  try {
    const allItems = await FoodItem.findAll();
    const allOrders = await FoodOrders.findAll();

    const result = allItems.map((item) => {
      const itemOrders = [];

      allOrders.forEach((order) => {
        let itemsInOrder = [];

        if (Array.isArray(order.item_details)) {
          // If it's already an array, use it directly
          itemsInOrder = order.item_details;
        } else if (typeof order.item_details === "string") {
          // If it's a string, try to parse it into an array
          try {
            itemsInOrder = JSON.parse(order.item_details);
            if (!Array.isArray(itemsInOrder)) {
              itemsInOrder = []; // Ensure it's an array after parsing
            }
          } catch (err) {
            console.error(`Invalid JSON in order ${order.id}`);
            itemsInOrder = []; // If JSON parsing fails, set it to an empty array
          }
        }

        // Now you can safely iterate over the array
        itemsInOrder.forEach((orderedItem) => {
          if (parseInt(orderedItem.item_id) === item.id) {
            itemOrders.push({
              order_id: order.order_id,
              quantity: orderedItem.quantity,
              price: orderedItem.price,
              user_id: order.user_id,
              status: order.status,
            });
          }
        });
      });

      return {
        id: item.id,
        name: item.menu_name,
        price: item.price,
        orders: itemOrders.length > 0 ? itemOrders : "No orders",
      };
    });

    res.status(200).json({
      status: true,
      message: "All food items with their orders",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching food items with orders:", error);
    res.status(500).json({
      status: false,
      message: "Server error while fetching food item orders",
    });
  }
};


// updated code

// CREATE FoodItem

// exports.createFoodItem = async (req, res) => {
//     try {
//         console.log('Incoming Body:', req.body);

//         const foodItem = await FoodItem.create(req.body);

//         const foodItemData = foodItem.get({ plain: true });

//         // Full Image Path
//         const fullImagePath = foodItemData.menu_img
//             ? `${process.env.APP_URL}public/uploads/${foodItemData.menu_img}`
//             : null;

//         console.log('Saved menu_img:', foodItemData.menu_img);
//         console.log('Full Path:', fullImagePath);

//         const responseData = {
//             ...foodItemData,
//             menu_img_full: fullImagePath
//         };

//         return res.status(201).json({ message: 'Food Item created successfully', data: responseData });
//     } catch (error) {
//         console.error('Error creating Food Item:', error);
//         return res.status(500).json({ message: 'Error creating Food Item', error: error.message });
//     }
// };

// exports.createFoodItem = async (req, res) => {
//     try {
//         console.log('Incoming Body:', req);

//         // Basic validation
//         if (!req.body.restaurant_id || !req.body.menu_name || !req.body.cuisine_type) {
//             return res.status(400).json({ message: 'restaurant_id, menu_name, and cuisine_type are required' });
//         }

//         // Handle image upload field (if file is uploaded)
//         let menu_img = null;
//         if (req.files) {
//             menu_img = req.files.menu_img;
//         } else if (req.body.menu_img) {
//             // In case user is passing image name directly in body
//             menu_img = req.body.menu_img;
//         }
// console.log(menu_img);

//         // Prepare data for insert
//         const newFoodItem = await FoodItem.create({
//             restaurant_id: req.body.restaurant_id,
//             category_id: req.body.category_id || null,
//             menu_name: req.body.menu_name,
//             description: req.body.description || null,
//             menu_img: menu_img,
//             price: req.body.price || null,
//             discount: req.body.discount || 0.0,
//             total_quantity: req.body.total_quantity || null,
//             unit: req.body.unit || null,
//             cost_price: req.body.cost_price || null,
//             calories: req.body.calories || null,
//             diet_type: req.body.diet_type || 'veg',
//             variants: req.body.variants || null,
//             addons: req.body.addons || null,
//             spice_level: req.body.spice_level || 'none',
//             tags: req.body.tags || null,
//             prep_time: req.body.prep_time || null,
//             sku: req.body.sku || null,
//             status: req.body.status || 'active',
//             available: req.body.available !== undefined ? req.body.available : true,
//             is_veg: req.body.is_veg !== undefined ? req.body.is_veg : false,
//             is_recommended: req.body.is_recommended !== undefined ? req.body.is_recommended : false,
//             rating: req.body.rating || 0.0,
//             distance: req.body.distance || null,
//             ingredients: req.body.ingredients || null,
//             cuisine_type: req.body.cuisine_type
//         });

//         const foodItemData = newFoodItem.get({ plain: true });

//         // Full Image Path
//         const fullImagePath = foodItemData.menu_img
//             ? `${process.env.APP_URL}public/uploads/${foodItemData.menu_img}`
//             : null;

//         const responseData = {
//             ...foodItemData,
//             menu_img_full: fullImagePath
//         };

//         return res.status(201).json({ message: 'Food Item created successfully', data: responseData });

//     } catch (error) {
//         console.error('Error creating Food Item:', error);
//         return res.status(500).json({ message: 'Error creating Food Item', error: error.message });
//     }
// };

// GET all FoodItems
exports.getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.findAll();
    return res.status(200).json({ data: foodItems });
  } catch (error) {
    console.error("Error fetching Food Items:", error);
    return res
      .status(500)
      .json({ message: "Error fetching Food Items", error: error.message });
  }
};

// GET single FoodItem by ID
exports.getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByPk(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food Item not found" });
    }
    return res.status(200).json({ data: foodItem });
  } catch (error) {
    console.error("Error fetching Food Item:", error);
    return res
      .status(500)
      .json({ message: "Error fetching Food Item", error: error.message });
  }
};

// UPDATE FoodItem by ID
exports.updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByPk(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food Item not found" });
    }
    await foodItem.update(req.body);
    return res
      .status(200)
      .json({ message: "Food Item updated successfully", data: foodItem });
  } catch (error) {
    console.error("Error updating Food Item:", error);
    return res
      .status(500)
      .json({ message: "Error updating Food Item", error: error.message });
  }
};

// DELETE FoodItem by ID
exports.deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByPk(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food Item not found" });
    }
    await foodItem.destroy();
    return res.status(200).json({ message: "Food Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting Food Item:", error);
    return res
      .status(500)
      .json({ message: "Error deleting Food Item", error: error.message });
  }
};





