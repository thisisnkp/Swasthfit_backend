"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_personal_details", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      gym_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cancel_cheque: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pan_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pan_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gym_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobile_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      alternate_mobile_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gym_logo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_images: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_personal_details");
  },
};
