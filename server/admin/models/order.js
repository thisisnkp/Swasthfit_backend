

'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); // Adjust the path if needed
const User = require('../../user/user.model');

class Order extends Model {}

Order.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    total_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    order_date_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: true
    },
    delivery_status: {
        type: DataTypes.STRING, // Example: "Pending", "Shipped", "Delivered"
        allowNull: false,
        defaultValue: "Pending"
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
    timestamps: true
});

// // Define Association
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

module.exports = Order;
