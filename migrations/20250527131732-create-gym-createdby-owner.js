"use strict";

const { Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable("gym_created_by_owner", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      gym_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      owner_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      contact_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      alt_contact_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      gym_logo: {
        type: Sequelize.STRING(255), // multer-stored image URL
        allowNull: true,
      },
      gym_profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      upload_cancel_cheque: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name_as_per_pancard: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      pan_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      gst_number: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      gst_certificate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      msme_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      msme_certificate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      shop_certificate_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      shop_certificate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      add_workout_type: {
        type: Sequelize.TEXT, // e.g. JSON string or comma-separated values
        allowNull: true,
      },
      closing_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      add_facilities: {
        type: Sequelize.TEXT, // e.g. comma-separated or JSON
        allowNull: true,
      },
      about_us: {
        type: Sequelize.TEXT,
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
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("gym_details");
  },
};
