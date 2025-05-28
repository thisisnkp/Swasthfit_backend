"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      user_mobile: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      user_dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_height: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_weight: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_aadhar: {
        type: Sequelize.STRING(16),
        allowNull: true,
      },
      user_pan: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      user_bank: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_earned_coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_gullak_money_earned: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_gullak_money_used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      user_competitions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "user",
      },
      user_social_media_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_downloads: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_ratings: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "0",
      },
      user_qr_code: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_signup: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      otpless_token: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_approved: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      remember_token: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      forget_password_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      provider_avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      is_vendor: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      verify_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      agree_policy: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
