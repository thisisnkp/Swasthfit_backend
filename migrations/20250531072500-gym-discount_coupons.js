"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discount_coupons", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      module_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discount_type: {
        type: Sequelize.ENUM("Percentage", "Fixed"),
        allowNull: true,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      apply_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      apply_quantity_type: {
        type: Sequelize.ENUM("limited", "unlimited"),
        allowNull: true,
        defaultValue: "limited",
      },
      status: {
        type: Sequelize.ENUM("active", "expired"),
        allowNull: true,
        defaultValue: "active",
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
    await queryInterface.dropTable("discount_coupons");
  },
};
