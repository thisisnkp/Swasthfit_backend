"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gym_about", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gym_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gym_owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gym_profile_picture: {
        type: Sequelize.STRING,
      },
      gym_cover_image: {
        type: Sequelize.STRING,
      },
      gym_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      about_us: {
        type: Sequelize.TEXT,
      },
      services: {
        type: Sequelize.TEXT,
      },
      gym_contect_mobile: {
        type: Sequelize.BIGINT,
      },
      gym_contect_alt_mobile: {
        type: Sequelize.BIGINT,
      },
      gym_contect_email_id: {
        type: Sequelize.STRING,
      },
      manager_contect_mobile: {
        type: Sequelize.BIGINT,
      },
      manager_contect_alt_mobile: {
        type: Sequelize.BIGINT,
      },
      manager_contect_email_id: {
        type: Sequelize.STRING,
      },
      days_of_week: {
        type: Sequelize.JSON,
      },
      sessions_1: {
        type: Sequelize.STRING,
      },
      sessions_2: {
        type: Sequelize.STRING,
      },
      sessions_3: {
        type: Sequelize.STRING,
      },
      gym_address: {
        type: Sequelize.STRING,
      },
      gym_location: {
        type: Sequelize.GEOMETRY("POINT"),
      },
      community: {
        type: Sequelize.TEXT,
      },
      marketing: {
        type: Sequelize.TEXT,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("gym_about");
  },
};
// This migration script creates a new table 'gym_about' with various fields related to gym information.
