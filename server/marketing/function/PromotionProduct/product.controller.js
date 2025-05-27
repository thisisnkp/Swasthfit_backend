const Product = require('../../models/product.model');
const Gym = require('../../../gym/gym_owners/gym.model');
const RestaurantProduct = require('../../models/Restaurants/restaurant.model');
const Menu = require('../../models/Restaurants/foodItems.model'); 

exports.getProductsByLoggedInUser = async (req, res) => {
  console.log("getProductsByLoggedInUser called");
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData);

    if (!userData || !userData.module_type) {
      return res.status(400).json({ 
        success: false,
        message: "Missing module information in token" 
      });
    }

    if (userData.module_type === "ecom") {
      if (!userData.vendor_id) {
        return res.status(400).json({ 
          success: false,
          message: "Vendor ID missing in token" 
        });
      }

      const products = await Product.findAll({
        where: { vendor_id: userData.vendor_id }
      });

      return res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } 
    else if (userData.module_type === "restaurant") {
      if (!userData.vendor_id) {
        return res.status(400).json({ 
          success: false,
          message: "Vendor ID missing in token" 
        });
      }

      const restaurantProducts = await RestaurantProduct.findAll({
        where: { vendor_id: userData.vendor_id }
      });

      return res.status(200).json({
        success: true,
        data: restaurantProducts,
        count: restaurantProducts.length
      });
    } 
    else if (userData.module_type === "gym") {
      const owner_id = userData.owner_id || userData.vendor_id;

      if (!owner_id) {
        return res.status(400).json({ 
          success: false,
          message: "Owner ID missing in token" 
        });
      }

      const gyms = await Gym.findAll({
        where: { owner_id: owner_id }
      });

      return res.status(200).json({
        success: true,
        data: gyms,
        count: gyms.length
      });
    } 
    else {
      return res.status(400).json({ 
        success: false,
        message: "Invalid module type" 
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


exports.getFoodItemsByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required"
      });
    }


    const foodItems = await Menu.findAll({
      where: { restaurant_id: restaurantId }
    });

    return res.status(200).json({
      success: true,
      data: foodItems,
      count: foodItems.length
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};