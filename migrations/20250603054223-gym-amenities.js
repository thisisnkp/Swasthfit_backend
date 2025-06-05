"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("amenities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      workout_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      closing_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gym_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gym_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      facilities: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      about_us: {
        type: Sequelize.STRING(300),
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
    await queryInterface.dropTable("amenities");
  },
};
