'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class FoodOrderPrices extends Model {

}

FoodOrderPrices.init({
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_price: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00
    },
    delivery_price: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00
    },
    discount_price: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00
    },
    tax: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00
    },
    total_price: {
        type: DataTypes.DOUBLE,
        allowNull: 0.00
    },
}, {
    sequelize,
    modelName: 'FoodOrderPrices',
    tableName: 'foodorderprices',
    underscored: true,
    timestamps: false
});

module.exports = FoodOrderPrices;