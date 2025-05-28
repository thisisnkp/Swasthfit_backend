"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurant_diet_plans", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_diet_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "client_diet_plans",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "foodrestaurants",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      breakfast_price: {
        type: Sequelize.FLOAT,
      },
      lunch_price: {
        type: Sequelize.FLOAT,
      },
      dinner_price: {
        type: Sequelize.FLOAT,
      },
      snacks_price: {
        type: Sequelize.FLOAT,
      },
      combo_price: {
        type: Sequelize.FLOAT,
      },
      optional_item_price: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      remark: {
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
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("restaurant_diet_plans");
  },
};
