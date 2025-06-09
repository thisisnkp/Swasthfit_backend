"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exercises", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      body_part_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "bodyparts", // Name of the target table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // createdAt and updatedAt are typically added automatically by Sequelize if timestamps are true in model
      // If your model has `timestamps: false`, you might not need these here.
      // If your model has `timestamps: true` (default), add them here:
      // createdAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // },
      // updatedAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      // },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exercises");
  },
};
