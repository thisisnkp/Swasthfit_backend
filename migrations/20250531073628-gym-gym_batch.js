"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gym_batch", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gym_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batch_from: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      batch_to: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      batch_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("gym_batch");
  },
};
