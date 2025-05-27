const Order = require("../models/order");
const User = require("../../food/models/User"); // Ensure this path points to the correct User model with user_name, user_email
const Restaurant = require("../../food/models/Restaurant");
exports.createOrders = async (req, res) => {
  try {
    const {
      user_id,
      customer_name,
      item_name,
      quantity,
      price,
      total_price,
      total_amount,
      product_qty,
      payment_method,
      payment_status,
      payment_approval_date,
      transection_id,
      shipping_method,
      shipping_cost,
      coupon_coast,
      order_status,
      order_approval_date,
      order_delivered_date,
      order_completed_date,
      order_declined_date,
      cash_on_delivery,
      additional_info,
      order_date_time,
      shipping_address,
      delivery_status,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const order_id = `ORD-${Date.now()}`;

    const order = await Order.create({
      order_id,
      user_id,
      user_name: user.name,
      customer_name,
      item_name,
      quantity,
      price,
      total_price,
      total_amount,
      product_qty,
      payment_method,
      payment_status,
      payment_approval_date,
      transection_id,
      shipping_method,
      shipping_cost,
      coupon_coast,
      order_status,
      order_approval_date,
      order_delivered_date,
      order_completed_date,
      order_declined_date,
      cash_on_delivery,
      additional_info,
      order_date_time,
      shipping_address,
      delivery_status,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await order.destroy();

    return res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// exports.getAllOrdes= async (req, res) => {
//     try {
//       const orders = await Order.findAll({
//         include: [
//           {
//             model: Restaurant,
//             attributes: ['id', 'name']
//           },
//           {
//             model: User,
//             attributes: ['id', 'name', 'email']
//           }
//         ],
//         order: [['createdAt', 'DESC']]
//       });

//       res.json({ success: true, data: orders });
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       res.status(500).json({ success: false, message: 'Something went wrong' });
//     }
//   }

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user", // Match alias defined in model
          // FIX: Use correct attribute names for the User model
          attributes: ["id", "user_name", "user_email", "user_mobile"], // Corrected attributes
        },
      ],
      order: [["order_date_time", "DESC"]],
    });

    // Calculate counts and total price here
    const totalCount = orders.length;
    const cancelledCount = orders.filter(
      (order) => order.status === "Cancelled" || order.status === "Rejected",
    ).length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0,
    );

    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      count: totalCount, // Total orders
      cancelled_count: cancelledCount, // Cancelled orders
      total_order_price: totalRevenue.toFixed(2), // Total revenue
      data: orders, // Array of all order objects
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
