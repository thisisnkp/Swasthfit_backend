<<<<<<< HEAD
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurant_diet_plans", {
=======
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurant_diet_plans', {
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
          model: "client_diet_plans",
          key: "id",
        },
        onDelete: "CASCADE",
=======
          model: 'client_diet_plans',
          key: 'id',
        },
        onDelete: 'CASCADE',
>>>>>>> restaurent_backend
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
<<<<<<< HEAD
          model: "FoodRestaurants",
          key: "id",
        },
        onDelete: "CASCADE",
=======
          model: 'foodrestaurants',
          key: 'id',
        },
        onDelete: 'CASCADE',
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
=======
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
>>>>>>> restaurent_backend
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
<<<<<<< HEAD
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
=======
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
>>>>>>> restaurent_backend
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
<<<<<<< HEAD
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
=======
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
>>>>>>> restaurent_backend
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
<<<<<<< HEAD
    await queryInterface.dropTable("restaurant_diet_plans");
=======
    await queryInterface.dropTable('restaurant_diet_plans');
>>>>>>> restaurent_backend
  },
};
