const FoodItem = require('../../models/FoodItem');
const Order = require('../../models/foodOrder');
const OrderPrice = require('../../models/foodOrderPrice');
exports.generateOrderId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { address_details, item_details, total_amount, delivery_price, discount_price, tax, total_price } = req.body;
        const orderId = generateOrderId();

        const customerId = req.body.userId ?? 1;

        const newOrder = await Order.create({
            order_id: orderId, user_id: customerId, address_details, item_details, total_amount: total_price
        });

        if (newOrder) {
            const newPrice = await OrderPrice.create({
                order_id: newOrder.id, item_price: total_amount, delivery_price, discount_price, tax, total_price
            });

            await Promise.all(
                item_details.map(async (item) => {
                    const { item_id, quantity } = item;

                    const foundItem = await FoodItem.findByPk(item_id);
                    if (foundItem) {
                        if (foundItem.total_quantity >= quantity) {
                            foundItem.total_quantity -= quantity;
                            await foundItem.save();
                            console.log(`Updated item ${item_id}: new quantity is ${foundItem.total_quantity}`);
                        } else {
                            console.log(`Not enough quantity for item ${item_id}. Available: ${foundItem.total_quantity}, Requested: ${quantity}`);
                        }
                    } else {
                        console.log(`Item with ID ${item_id} not found.`);
                    }
                })
            );

        }
        return res.status(200).json({
            status: true, message: 'Order Created successfully', data: {
                newOrder
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Get all restaurants
exports.getAllOrders= async (req, res) => {
    try {
        const { order_id, status } = req.body;
        let orders;
        if (order_id) {
            orders = await Order.findAll({
                where: {
                    user_id: req?.user?.id ?? 1,
                    id: order_id
                }
            });
        } else {
            orders = await Order.findAll({
                where: {
                    user_id: req?.user?.id ?? 1,
                    status: status
                }
            });
        }

        const formattedFoodItems = await Promise.all(orders.map(async (item) => {
            const price_deatils = await OrderPrice.findOne({
                where: { order_id: item.id }
            });

            return {
                order_id: item.order_id,
                address_details: item.address_details,
                item_details: item.item_details,
                total_amount: item.total_amount,
                status: item.status,
                price_deatils: price_deatils ?? null
            };
        }));

        return res.status(200).json({
            status: true, message: 'Food Items fetch successfully', data: {
                orders: formattedFoodItems
            }
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add address
exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_id, status } = req.body;
        const created_by = req?.user?.id ?? 1;
        let orderStatusChnage = {};
        if (order_id) {
            const update = await Order.update(
                {
                    status: status
                },
                {
                    where: { id: order_id }
                }
            );
            orderStatusChnage = await Order.findByPk(order_id ?? 1);
        }
        return res.status(200).json({
            status: true, message: 'Order Status Changed successfully', data: {
                orderStatusChnage
            }
        });
    } catch (error) {
        console.error('Error fetching addresss:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};