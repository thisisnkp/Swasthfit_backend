const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class OrderItems extends Model {}

OrderItems.init({
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'FoodOrders',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'FoodItems',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'OrderItems',
    tableName: 'order_items', 
    timestamps: false
});

module.exports = OrderItems;
