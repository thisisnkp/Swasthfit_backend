// File: Swasthfit_backend/server/admin/controllers/dashboardController.js

const { Op, Sequelize, DataTypes } = require("sequelize"); // Import Sequelize and Op
const sequelize = require("../../../sequelize"); // Adjust path to your main sequelize instance

// Import necessary models - adjust paths as per your project structure
// These models will be used to query and aggregate data.
const Order = require("../../food/models/foodOrder"); // Or your admin-specific Order model if different
const User = require("../../user/user.model"); // Or your admin-specific User model
const FoodItem = require("../../food/models/FoodItem");
const Restaurant = require("../../food/models/Restaurant");
// Add any other models you might need (e.g., for 'Other Outlets' if that's a distinct model)

const moment = require("moment"); // For easy date manipulations

// Example Function 1: Data for the "Order Chart" (New Orders per Day)
exports.getOrderChartData = async (req, res) => {
  try {
    const period = req.query.period || "weekly"; // Default to weekly, can be 'monthly', 'yearly'
    let labels = [];
    let seriesData = [];
    let startDate, endDate;

    if (period === "weekly") {
      labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      seriesData = Array(7).fill(0);
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();

      const orders = await Order.findAll({
        where: {
          created_at: {
            // Ensure your Order model uses 'created_at' or 'createdAt'
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: ["id", "created_at"],
      });

      orders.forEach((order) => {
        const dayOfWeek = moment(order.created_at).day(); // 0 for Sun, 1 for Mon...
        seriesData[dayOfWeek]++;
      });
    }
    // TODO: Add similar logic for 'monthly' and 'yearly' if needed
    // For 'monthly', labels would be days of the month, seriesData counts for each day.
    // For 'yearly', labels would be months, seriesData counts for each month.

    res.status(200).json({ success: true, labels, seriesData });
  } catch (error) {
    console.error("Error fetching order chart data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error fetching order chart data",
        error: error.message,
      });
  }
};

// Example Function 2: Data for "Revenue Summary Radial Bar Chart"
exports.getRevenueSummaryData = async (req, res) => {
  try {
    // For this, you might need a target revenue or calculate percentage based on previous period
    // For simplicity, let's assume we calculate total revenue for current month
    // and a hypothetical target.

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const currentMonthOrders = await Order.findAll({
      where: {
        created_at: { [Op.between]: [startOfMonth, endOfMonth] },
        // You might want to filter by 'Paid' or 'Delivered' status for revenue
        // status: 'Delivered'
      },
      attributes: ["total_amount"],
    });

    const currentRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0,
    );

    // Hypothetical target - you might store this in a settings table or calculate it
    const targetRevenue = 75000;
    const achievedPercentage =
      targetRevenue > 0
        ? Math.min(Math.round((currentRevenue / targetRevenue) * 100), 100)
        : 0;

    res.status(200).json({
      success: true,
      currentRevenue: currentRevenue.toFixed(2),
      targetRevenue: targetRevenue.toFixed(2),
      achievedPercentage,
    });
  } catch (error) {
    console.error("Error fetching revenue summary data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error fetching revenue summary",
        error: error.message,
      });
  }
};

// Example Function 3: Data for "Daily Delivery Chart (Heatmap)"
exports.getDeliveryHeatmapData = async (req, res) => {
  try {
    const heatmapSeries = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const hours = Array.from(
      { length: 24 },
      (_, i) => `${String(i).padStart(2, "0")}:00`,
    ); // 00:00 to 23:00

    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    const deliveredOrders = await Order.findAll({
      where: {
        // Assuming 'delivery_status' exists, or use 'status' if appropriate
        // delivery_status: 'Delivered',
        status: "Delivered", // Or 'Success' depending on your order flow
        updated_at: { [Op.between]: [startOfWeek, endOfWeek] }, // Assuming updated_at reflects delivery time
      },
      attributes: ["updated_at"], // The timestamp when it was marked delivered
    });

    days.forEach((dayName, dayIndex) => {
      const dayData = hours.map((hourLabel) => ({ x: hourLabel, y: 0 }));
      deliveredOrders.forEach((order) => {
        const orderMoment = moment(order.updated_at);
        if (orderMoment.day() === dayIndex) {
          const hour = orderMoment.hour();
          dayData[hour].y++;
        }
      });
      heatmapSeries.push({ name: dayName, data: dayData });
    });

    res.status(200).json({ success: true, heatmapSeries });
  } catch (error) {
    console.error("Error fetching delivery heatmap data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error fetching delivery heatmap data",
        error: error.message,
      });
  }
};

// Example Function 4: Data for "Special Menu" (if different from trending and needs its own logic)
exports.getDashboardSpecialMenuItems = async (req, res) => {
  try {
    // Replace with your actual logic to fetch special menu items for the dashboard
    // This might involve querying FoodItem based on some criteria or a dedicated 'SpecialOffers' table.
    const items = await FoodItem.findAll({
      where: { is_special_promo: true }, // Example criteria
      limit: 5,
      attributes: ["id", "menu_name", "menu_img", "price", "rating"], // Adjust attributes
      order: [["rating", "DESC"]],
    });

    const baseUrl = `${process.env.APP_URL || "http://localhost:4001"}/uploads/`;
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.menu_name,
      img: item.menu_img ? `${baseUrl}${item.menu_img}` : null, // Assuming 'uploads/' is part of path from DB
      options_count: item.options_count || "N/A", // Example, if you have this field
      rating: item.rating || "N/A",
    }));

    res
      .status(200)
      .json({ success: true, items: formattedItems, baseUrl: baseUrl });
  } catch (error) {
    console.error("Error fetching dashboard special menu items:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Example Function 5: Data for "Other Outlets"
exports.getDashboardOtherOutlets = async (req, res) => {
  try {
    // Fetch data for other outlets from your Restaurant model or a specific Outlets model
    const outlets = await Restaurant.findAll({
      // Add any specific conditions if needed, e.g., to exclude the main one
      where: { status: "Active" }, // Example criteria
      limit: 3,
      attributes: ["id", "title", "full_address", "phone_number", "rating"], // Adjust attributes
      order: [["title", "ASC"]],
    });

    const formattedOutlets = outlets.map((outlet) => ({
      id: outlet.id,
      name: outlet.title,
      address: outlet.full_address,
      phone: outlet.phone_number, // Ensure your Restaurant model has phone_number or similar
      rating: outlet.rating,
    }));

    res.status(200).json({ success: true, outlets: formattedOutlets });
  } catch (error) {
    console.error("Error fetching dashboard other outlets:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Add more functions as needed for other dynamic parts of your dashboard
// e.g., getSummaryCardTrends
