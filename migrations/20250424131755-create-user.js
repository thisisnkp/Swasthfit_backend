'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_mobile: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true,
        validate: { isNumeric: true, len: [10, 15] },
      },
      user_dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_gender: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: { isEmail: true },
      },
      user_bank: {
        type: Sequelize.TEXT,
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
        validate: { len: [12, 16] },
      },
      user_pan: {
        type: Sequelize.STRING(10),
        allowNull: true,
        validate: { len: [10, 10] },
      },
      user_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_earned_coins: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      user_gullak_money_earned: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      user_gullak_money_used: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      user_competitions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
        allowNull: true,
      },
      user_qr_code: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_signup: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      otpless_token: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
