'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class Menu extends Model {}

Menu.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    branch: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    visit_message: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    order_details: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menu',
    underscored: true,
    timestamps: true
});

module.exports = Menu;
