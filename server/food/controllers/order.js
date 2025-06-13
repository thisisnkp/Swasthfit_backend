const FoodItem = require("../models/FoodItem");
const Order = require("../models/foodOrder");
const OrderPrice = require("../models/foodOrderPrice");
const Category = require("../models/FoodCategory");
const Restaurant = require("../models/Restaurant");
const foodItem = require("../models/FoodItem");
const UserAddress = require("../models/UserAddress");
const jwt = require("jsonwebtoken");
const FavoriteItem = require("../models/favoriteItem");
const FavoriteRestaurant = require("../models/favoriteRestaurant");
const Rider = require("../models/rider");
const ItemOfferSpecial = require("../models/ItemOffer");
const User = require("../models/User");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const FoodOrders = require("../models/foodOrder");
const moment = require("moment"); // Easy date calculations
exports.generateOrderId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// create orders
// exports.createorder = async (req, res) => {
//   try {
//     const {
//       order_id,
//       restaurant_id,
//       user_id,
//       address_details,
//       item_details,
//       total_amount,
//       status,
//       Payment_via, // New field added here
//     } = req.body;

//     // 🔍 Validate required fields
//     if (
//       !restaurant_id ||
//       !user_id ||
//       !address_details ||
//       !item_details ||
//       !total_amount ||
//       !Payment_via
//     ) {
//       return res.status(400).json({
//         status: false,
//         message:
//           "restaurant_id, user_id, address_details, item_details, total_amount, and Payment_via are required",
//       });
//     }

//     // ✅ Check if restaurant exists
//     const restaurant = await Restaurant.findByPk(restaurant_id);
//     if (!restaurant) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Restaurant not found" });
//     }

//     // ✅ Check if user exists
//     const user = await User.findByPk(user_id);
//     if (!user) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     // 🆔 Generate order_id if not provided
//     const generatedOrderId =
//       order_id || `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;

//     // 📝 Create the order
//     const newOrder = await Order.create({
//       // <-- Use correct model name
//       order_id: generatedOrderId,
//       restaurant_id,
//       user_id,
//       address_details: JSON.stringify(address_details),
//       item_details: JSON.stringify(item_details),
//       total_amount,
//       Payment_via,
//       status: status || "Pending",
//     });

//     return res.status(201).json({
//       status: true,
//       message: "Order created successfully",
//       data: newOrder,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to create order",
//       error: error.message,
//     });
//   }
// };

exports.createorder = async (req, res) => {
  const io = req.app.get("io");
  try {
    const {
      order_id,
      restaurant_id,
      user_id,
      rider_id,
      address_details,
      item_details,
      total_amount,
      status,
      Payment_via,
    } = req.body;

    if (
      !restaurant_id ||
      !user_id ||
      !address_details ||
      !item_details ||
      !total_amount ||
      !Payment_via
    ) {
      return res.status(400).json({
        status: false,
        message:
          "restaurant_id, user_id, address_details, item_details, total_amount, and Payment_via are required",
      });
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ status: false, message: "Restaurant not found" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (rider_id) {
      const rider = await Rider.findByPk(rider_id);
      if (!rider) {
        return res
          .status(404)
          .json({ status: false, message: "Rider not found" });
      }
    }

    const generatedOrderId =
      order_id || `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = await FoodOrders.create({
      order_id: generatedOrderId,
      restaurant_id,
      user_id,
      rider_id: rider_id || null, // assign rider_id or null
      address_details: JSON.stringify(address_details),
      item_details: JSON.stringify(item_details),
      total_amount,
      Payment_via,
      status: status || "Pending",
    });
    io.emit("notification", {
      type: "Order",
      message: `New order (${newOrder.order_id}) placed by User ${user_id}`,
      timestamp: new Date().toISOString(),
    });
    return res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { order_id, status } = req.body;
    let whereCondition = { user_id: req?.user?.id ?? 1 };

    if (order_id) {
      whereCondition.id = order_id;
    }

    if (status !== undefined) {
      whereCondition.status = status;
    }

    const orders = await Order.findAll({ where: whereCondition });

    const formattedFoodItems = await Promise.all(
      orders.map(async (item) => {
        const price_deatils = await OrderPrice.findOne({
          where: { order_id: item.id },
        });

        return {
          order_id: item.order_id,
          address_details: item.address_details,
          item_details: item.item_details,
          total_amount: item.total_amount,
          status: item.status,
          price_deatils: price_deatils ?? null,
        };
      }),
    );

    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      count: formattedFoodItems.length,
      data: { orders: formattedFoodItems },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// fetch order status by order id
exports.getOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    if (!order_id) {
      return res.status(400).json({
        status: false,
        message: "order_id is required",
      });
    }

    const order = await Order.findOne({
      where: { order_id },
      attributes: ["order_id", "status"], // Only return what's needed
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Order status fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// order status update by order id
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    // Validate inputs
    if (!order_id || !status) {
      return res.status(400).json({
        success: false,
        message: "order_id and status are required",
      });
    }

    // Find the order by order_id
    const order = await FoodOrders.findOne({ where: { order_id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the status
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
// cancelled order
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

exports.getOrdersBetweenDates = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    // ✅ Check if dates are provided
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: false,
        message: "start_date and end_date are required in query params",
      });
    }

    // ✅ Fetch orders between the dates
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(start_date), new Date(end_date)],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      total_orders: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// deleteOrder controller
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params; // Get order_id from request parameters

  try {
    // Find the order by order_id
    const order = await Order.findOne({
      where: { order_id: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete the order
    await order.destroy();

    // Send success response
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// search order by range
// exports.getOrdersByRange = async (req, res) => {
//   try {
//     const { range } = req.body;

//     if (!range) {
//       return res.status(400).json({ message: "Range is required!" });
//     }

//     let startDate;
//     let endDate = moment().endOf("day"); // today's end time

//     switch (range) {
//       case "today":
//         startDate = moment().startOf("day");
//         break;
//       case "week":
//         startDate = moment().startOf("week"); // start of current week (Sunday)
//         break;
//       case "month":
//         startDate = moment().startOf("month"); // start of current month
//         break;
//       case "year":
//         startDate = moment().startOf("year"); // start of current year
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid range selected!" });
//     }

//     // Fetch orders between startDate and endDate
//     const orders = await Order.findAll({
//       where: {
//         createdAt: {
//           [Op.between]: [startDate.toDate(), endDate.toDate()],
//         },
//       },
//       order: [['createdAt', 'DESC']], // Latest first
//     });

//     return res.status(200).json({ success: true, data: orders });
//   } catch (error) {
//     console.error("Error fetching orders by range:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

exports.getOrdersByRange = async (req, res) => {
  try {
    const { range } = req.body;

    if (!range) {
      return res.status(400).json({ message: "Range is required!" });
    }

    let startDate;
    let endDate = moment().endOf("day"); // today's end time

    switch (range) {
      case "today":
        startDate = moment().startOf("day");
        break;
      case "week":
        startDate = moment().startOf("week"); // start of current week (Sunday)
        break;
      case "month":
        startDate = moment().startOf("month"); // start of current month
        break;
      case "year":
        startDate = moment().startOf("year"); // start of current year
        break;
      default:
        return res.status(400).json({ message: "Invalid range selected!" });
    }

    // Fetch orders between startDate and endDate
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate.toDate(), endDate.toDate()],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    // Count order statuses
    const counts = {
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    orders.forEach((order) => {
      if (order.status === "Pending") counts.pending += 1;
      else if (order.status === "Accepted") counts.accepted += 1;
      else if (order.status === "Rejected") counts.rejected += 1;
    });

    return res.status(200).json({
      success: true,
      data: orders,
      counts, // include status counts
    });
  } catch (error) {
    console.error("Error fetching orders by range:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersByDateRange = async (req, res) => {
  const { dateRange } = req.body; // Get the selected date range from query parameter

  // Define date boundaries for different options
  let startDate, endDate;
  const today = new Date();
  const firstDayOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay()),
  ); // Get the first day of the week
  const lastDayOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 6),
  ); // Get the last day of the week

  switch (dateRange) {
    case "today":
      startDate = new Date();
      endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today
      break;
    case "this_week":
      startDate = firstDayOfWeek;
      endDate = lastDayOfWeek;
      break;
    case "last_week":
      // Get the last week's start and end date
      startDate = new Date(today.setDate(today.getDate() - today.getDay() - 7)); // Last week's first day
      endDate = new Date(today.setDate(today.getDate() - today.getDay() - 1)); // Last week's last day
      break;
    case "this_month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of this month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
      break;
    case "last_month":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of last month
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
      break;
    default:
      return res.status(400).json({ error: "Invalid date range selected" });
  }

  try {
    // Fetch orders based on the selected date range
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [["createdAt", "DESC"]],
      raw: true, // ✅ This returns plain objects instead of Sequelize instances
    });

    console.log("order :", orders);

    return res.json(orders); // Send the orders as a response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    // Validate inputs
    if (!order_id || !status) {
      return res.status(400).json({
        status: false,
        message: "order_id and status are required",
      });
    }

    // Validate status value
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value. Must be 'Accepted' or 'Rejected'",
      });
    }

    // Find the order by order_id
    const order = await Order.findOne({ where: { order_id } });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // Check if order can be updated
    if (
      ["Accepted", "Rejected", "Delivered", "Cancelled"].includes(order.status)
    ) {
      return res.status(400).json({
        status: false,
        message: `Order cannot be ${status.toLowerCase()}. Current status: ${order.status}`,
      });
    }

    // Update the status
    order.status = status;
    await order.save();

    return res.status(200).json({
      status: true,
      message: `Order ${status.toLowerCase()} successfully`,
      data: order,
    });
  } catch (error) {
    console.error(`Error ${status.toLowerCase()}ing order:`, error);
    return res.status(500).json({
      status: false,
      message: `Failed to ${status.toLowerCase()} order`,
      error: error.message,
    });
  }
};

exports.getAllUsersWithOrders = async (req, res) => {
  try {
    const usersWithOrders = await User.findAll({
      include: [
        {
          association: "foodOrders", // ✅ use association alias, not model
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: usersWithOrders,
    });
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/************************* order details with rider , restaurent , order , user *********************************/

const generateCustomOrderId = (date = new Date(), orderNumber = 81) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // e.g., 2025 -> 25
  return `${month}${day}${year}0000${orderNumber}`;
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["username", "status", "title", "latitude", "longitude"],
        },
        {
          model: User,
          as: "user",
          attributes: ["user_name", "user_email", "user_mobile"],
        },
        {
          model: Rider,
          as: "rider",
          attributes: ["first_name", "last_name", "mobile"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrderId = generateCustomOrderId(order.createdAt, 81);

    res.json({
      orderId: formattedOrderId,
      user: order.user,
      rider: order.rider,
      restaurant: order.restaurant,
      orderDetails: {
        id: order.id,
        createdAt: order.createdAt,
        total: order.total, // existing field
        status: order.status,
        total_amount: order.total_amount || order.total, // fallback if `total_amount` is not separate
        payment_method: order.payment_method || "Not specified",
      },
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**********************************************************/

// Get all categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll();
//     return res.status(200).json({
//       status: true,
//       message: "Categories fetch successfully",
//       data: {
//         baseUrl: `${process.env.APP_URL}uploads/`,
//         categories,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ status: true, message: error.message });
//   }
// };

// Get all Items
exports.getAllFoodItems = async (req, res) => {
  try {
    const { menu_name, is_favourite, category_id, is_recommended } = req.body;

    let foodItems;

    const address = await UserAddress.findOne({
      where: {
        user_id: req?.user?.id ?? 1,
        is_default: true,
      },
      attributes: ["latitude", "longitude"],
    });

    const userLatitude = address.latitude;
    const userLongitude = address.longitude;
    // Define the maximum distance in kilometers
    const maxDistance = 10;

    if (menu_name) {
      foodItems = await foodItem.findAll({
        attributes: [
          "id",
          "menu_name",
          "description",
          "menu_img",
          "status",
          "price",
          "created_by",
          "createdAt",
          "updatedAt",
        ],
        where: {
          menu_name: {
            [Sequelize.Op.like]: `%${menu_name}%`,
          },
        },
      });
    } else {
      if (is_favourite) {
        const favoriteItems = await FavoriteItem.findAll({
          where: {
            user_id: req?.user?.id ?? 1,
          },
          attributes: ["item_id"],
        });

        const itemIds = favoriteItems.map((fav) => fav.item_id);

        foodItems = await foodItem.findAll({
          attributes: [
            "id",
            "menu_name",
            "description",
            "menu_img",
            "status",
            "price",
            "created_by",
            "createdAt",
            "updatedAt",
          ],
          where: {
            id: {
              [Sequelize.Op.in]: itemIds,
            },
          },
        });
      } else if (category_id) {
        foodItems = await foodItem.findAll({
          attributes: [
            "id",
            "menu_name",
            "description",
            "menu_img",
            "status",
            "price",
            "createdAt",
            "created_by",
            "updatedAt",
          ],
          where: {
            category_id: category_id,
          },
        });
      } else if (is_recommended) {
        foodItems = await foodItem.findAll({
          attributes: [
            "id",
            "menu_name",
            "description",
            "menu_img",
            "status",
            "price",
            "createdAt",
            "created_by",
            "updatedAt",
          ],
          where: {
            is_recommended: true,
          },
        });
      } else {
        foodItems = await foodItem.findAll({
          attributes: [
            "id",
            "menu_name",
            "description",
            "menu_img",
            "status",
            "created_by",
            "price",
            "createdAt",
            "updatedAt",
          ],
        });
      }
    }

    const formattedFoodItems = await Promise.all(
      foodItems.map(async (item) => {
        const restaurant = await Restaurant.findOne({
          where: { id: item.created_by },
          attributes: ["id", "title", "latitude", "longitude"],
        });

        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          restaurant.latitude,
          restaurant.longitude,
        );

        if (distance <= maxDistance) {
          return {
            title: item.menu_name,
            menu_img: item.menu_img,
            price: item.price,
            distance: distance.toFixed(2),
            desc: item.description,
            rating: 3.4,
            rest_name: restaurant.title,
          };
        }
        return null;
      }),
    );
    const filteredFoodItems = formattedFoodItems.filter(
      (item) => item !== null,
    );

    return res.status(200).json({
      status: true,
      message: "Food Items fetch successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        foodItems: filteredFoodItems,
      },
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all special Items
exports.getSpecialFoodItems = async (req, res) => {
  try {
    const { menu_name, is_favourite, category_id, is_recommended } = req.body;

    let foodItems;

    const address = await UserAddress.findOne({
      where: {
        user_id: req?.user?.id ?? 1,
        is_default: true,
      },
      attributes: ["latitude", "longitude"],
    });

    const userLatitude = address.latitude;
    const userLongitude = address.longitude;
    // Define the maximum distance in kilometers
    const maxDistance = 10;

    const specialItems = await ItemOfferSpecial.findAll({});

    const formattedFoodItems = await Promise.all(
      specialItems.map(async (item) => {
        const foodItems = await foodItem.findOne({
          attributes: [
            "id",
            "menu_name",
            "description",
            "menu_img",
            "status",
            "price",
            "created_by",
            "createdAt",
            "updatedAt",
          ],
          where: {
            id: item.item_id,
          },
        });
        const restaurant = await Restaurant.findOne({
          where: { id: foodItems.created_by },
          attributes: ["id", "title", "latitude", "longitude"],
        });

        // Calculate distance using Haversine formula
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          restaurant.latitude,
          restaurant.longitude,
        );

        if (distance <= maxDistance) {
          return {
            special_item_id: item.id,
            food_item_id: foodItems.id,
            title: foodItems.menu_name,
            menu_img: foodItems.menu_img,
            quantity: item.min_quantity,
            price: item.offer_price,
            start_date: item.start_date,
            end_date: item.end_date,
            distance: distance.toFixed(2),
            desc: foodItems.description,
            rating: 3.4,
            rest_name: restaurant.title,
          };
        }
        return null;
      }),
    );
    const filteredFoodItems = formattedFoodItems.filter(
      (item) => item !== null,
    );

    return res.status(200).json({
      status: true,
      message: "Food Items fetch successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        foodItems: filteredFoodItems,
      },
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const { title, is_favourite, is_recommended } = req.body;

    let restaurants;

    const address = await UserAddress.findOne({
      where: {
        user_id: req?.user?.id ?? 1,
        is_default: true,
      },
      attributes: ["latitude", "longitude"],
    });

    const userLatitude = address.latitude;
    const userLongitude = address.longitude;
    // Define the maximum distance in kilometers
    const maxDistance = 10;

    if (title) {
      restaurants = await Restaurant.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                                6371 * acos(
                                    cos(radians(${userLatitude})) * 
                                    cos(radians(latitude)) * 
                                    cos(radians(longitude) - radians(${userLongitude})) + 
                                    sin(radians(${userLatitude})) * 
                                    sin(radians(latitude))
                                )
                            )`),
              "distance",
            ],
          ],
        },
        where: {
          title: {
            [Sequelize.Op.like]: `%${title}%`,
          },
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.literal(`(
                                6371 * acos(
                                    cos(radians(${userLatitude})) * 
                                    cos(radians(latitude)) * 
                                    cos(radians(longitude) - radians(${userLongitude})) + 
                                    sin(radians(${userLatitude})) * 
                                    sin(radians(latitude))
                                )
                            )`),
              { [Sequelize.Op.lte]: maxDistance }, // Filter by distance
            ),
          ],
        },
        order: [[Sequelize.literal("distance"), "ASC"]],
      });
    } else {
      if (is_favourite) {
        const favoriteRestaurants = await FavoriteRestaurant.findAll({
          where: {
            user_id: req?.user?.id ?? 1,
          },
          attributes: ["rest_id"],
        });

        const restIds = favoriteRestaurants.map((fav) => fav.rest_id);

        restaurants = await Restaurant.findAll({
          attributes: [
            "id",
            "title",
            "rimg",
            "latitude",
            "longitude",
            "sdesc",
            "is_popular",
            "is_fitmode",
            "is_dietpkg",
            "is_dining",
            "createdAt",
            "updatedAt",
          ],
          where: {
            id: {
              [Sequelize.Op.in]: restIds,
            },
          },
        });
      } else if (is_recommended) {
        restaurants = await Restaurant.findAll({
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                "distance",
              ],
            ],
          },
          where: {
            is_recommended: true,
            [Sequelize.Op.and]: [
              Sequelize.where(
                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                { [Sequelize.Op.lte]: maxDistance }, // Filter by distance
              ),
            ],
          },
          order: [[Sequelize.literal("distance"), "ASC"]],
        });
      } else {
        restaurants = await Restaurant.findAll({
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                "distance",
              ],
            ],
          },
          where: {
            [Sequelize.Op.and]: [
              Sequelize.where(
                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                { [Sequelize.Op.lte]: maxDistance }, // Filter by distance
              ),
            ],
          },
          order: [[Sequelize.literal("distance"), "ASC"]],
        });
      }
    }
    const formattedFoodRests = restaurants.map((item) => ({
      id: item.id,
      title: item.title,
      rimg: item.rimg,
      distance: parseFloat(item.getDataValue("distance") ?? 0).toFixed(3),
      desc: item.sdesc,
      rating: 4.2,
    }));
    return res.status(200).json({
      status: true,
      message: "Restaurants fetch successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        restaurants: formattedFoodRests,
      },
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const address = await UserAddress.findAll({});
    return res.status(200).json({
      status: true,
      message: "Address fetch successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        address,
      },
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get address details
exports.getUserAddressDetails = async (req, res) => {
  try {
    const { address_id } = req.body;
    const addressDetails = await UserAddress.findByPk(address_id ?? 1);
    return res.status(200).json({
      status: true,
      message: "Address details fetched successfully",
      data: {
        addressDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add address

exports.addAddress = async (req, res) => {
  try {
    const {
      user_id,
      user_name,
      phone_number,
      address,
      house_no,
      city,
      latitude,
      longitude,
      is_default
    } = req.body;

    if (!user_id || !address || !city) {
      return res.status(400).json({ status: false, message: "user_id, address, and city are required" });
    }

    // If is_default is true, make others false
    if (is_default) {
      await UserAddress.update(
        { is_default: false },
        { where: { user_id } }
      );
    }

    const newAddress = await UserAddress.create({
      user_id,
      user_name,
      phone_number,
      address,
      house_no,
      city,
      latitude,
      longitude,
      is_default
    });

    return res.status(201).json({
      status: true,
      message: "Address added successfully",
      address: newAddress
    });

  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to add address",
      error: error.message
    });
  }
};

// exports.addAddressApi = async (req, res) => {
//   try {
//     const {
  
//       user_name,
//       phone_number,
//       house_no,
//       city,
//       address,
//       latitude,
//       longitude,
//       is_default,
//     } = req.body;
//     const created_by = req?.user?.id ?? 1;
//     let addUpdatedAddress = {};
//     if (address_id) {
//       const update = await UserAddress.update(
//         {
//           user_name: user_name,
//           phone_number: phone_number,
//           house_no: house_no,
//           city: city,
//           address: address,
//           latitude: latitude,
//           longitude: longitude,
//           is_default: is_default,
//         },
//         {
//           where: { id: address_id },
//         },
//       );
//       addUpdatedAddress = await UserAddress.findByPk(address_id ?? 1);
//     } else {
//       addUpdatedAddress = await UserAddress.create({
//         user_id: created_by,
//         user_name: user_name,
//         phone_number: phone_number,
//         house_no: house_no,
//         city: city,
//         address: address,
//         latitude: latitude,
//         longitude: longitude,
//         is_default: is_default,
//       });
//     }
//     await UserAddress.update(
//       { is_default: false },
//       {
//         where: {
//           user_id: created_by,
//           id: { [Sequelize.Op.ne]: addUpdatedAddress.id },
//         },
//       },
//     );
//     return res.status(200).json({
//       status: true,
//       message: "Address added successfully",
//       data: {
//         addUpdatedAddress,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching addresss:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Get order details
exports.getFoodItemDetails = async (req, res) => {
  try {
    const { item_id } = req.body;
    const foodItemDetails = await foodItem.findByPk(item_id ?? 1);
    return res.status(200).json({
      status: true,
      message: "Item details fetched successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        foodItemDetails: {
          menu_name: foodItemDetails.menu_name,
          menu_img: foodItemDetails.menu_img,
          description: foodItemDetails.description,
          price: foodItemDetails.price,
          delivery_type: "Free",
          rating: 3.4,
          delivery_time: 10,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get rest details
exports.getRestDetails = async (req, res) => {
  try {
    const { rest_id } = req.body;
    const restDetails = await Restaurant.findByPk(rest_id ?? 1);
    return res.status(200).json({
      status: true,
      message: "Resturant details fetched successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        restDetails: {
          title: restDetails.title,
          rimg: restDetails.rimg,
          sdesc: restDetails.sdesc,
          delivery_type: "Free",
          rating: 3.4,
          delivery_time: 10,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add Favorite Item
exports.addFavoriteItem = async (req, res) => {
  const { user_id, item_id } = req.body;

  try {
    const favoriteItem = await FavoriteItem.create({ user_id, item_id });
    return res.status(200).json({
      status: true,
      message: "Favorite Item Added Successfully",
      data: {
        favoriteItem,
      },
    });
  } catch (error) {
    console.error("Error adding favorite item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Favorite Restaurant;

exports.addFavoriteRestaurant = async (req, res) => {
  try {
    const { user_id, rest_id } = req.body;

    if (!user_id || !rest_id) {
      return res.status(400).json({
        status: false,
        message: "Both user_id and rest_id are required.",
      });
    }

    const favoriteRestaurant = await FavoriteRestaurant.create({
      user_id,
      rest_id,
    });

    return res.status(200).json({
      status: true,
      message: "Favorite Restaurant Added Successfully",
      data: favoriteRestaurant,
    });
  } catch (error) {
    console.error("Error adding favorite restaurant:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.findAll({
      attributes: [
        "id",
        "order_id",
        "user_id",
        "address_details",
        "item_details",
        "total_amount",
        "status",
      ],
      order: [["id", "DESC"]], // Sort by latest orders
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
