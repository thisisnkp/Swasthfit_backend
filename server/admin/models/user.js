'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const Order= require("../models/order")
class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    user_mobile: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    user_dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_height: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_weight: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_aadhar: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    user_pan: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_bank: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    user_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    user_earned_coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_gullak_money_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_gullak_money_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    user_competitions: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'user'
    },
    user_social_media_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_downloads: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_ratings: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '0'
    },
    user_qr_code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_signup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    otpless_token: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_approved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    forget_password_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    provider_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    provider: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    provider_avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    is_vendor: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    verify_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    agree_policy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    underscored: true,
    timestamps: true
});

User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "orderedBy" }); // "user" ki jagah unique alias

module.exports = User;
