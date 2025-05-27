
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class FoodItemOffers extends Model {}

FoodItemOffers.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'FoodItems',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    },
    min_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    offer_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,  
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'FoodItemOffers',
    tableName: 'fooditemoffers',
    underscored: true,
    timestamps: true
});

module.exports = FoodItemOffers;
