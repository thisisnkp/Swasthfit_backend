'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'restaurant_diet_plans' table.
     * It includes fields such as 'client_diet_plan_id', 'restaurant_id',
     * various price fields (breakfast, lunch, dinner, snacks, combo, optional_item),
     * 'status', and 'remark'.
     * Foreign key constraints are added for 'client_diet_plan_id' referencing the 'client_diet_plans' table
     * and 'restaurant_id' referencing the 'foodrestaurants' table.
     */
    await queryInterface.createTable('restaurant_diet_plans', {
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
          model: 'client_diet_plans', // Ensure this matches your actual ClientDietPlan table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodrestaurants', // Ensure this matches your actual FoodRestaurant table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      breakfast_price: {
        type: Sequelize.INTEGER, // As per your model's DataTypes.INTEGER
        allowNull: false,
        // NOTE: The model definition for 'breakfast_price' includes 'references' to FoodRestaurant.
        // This is typically incorrect for a price field. Assuming it should be a numeric price
        // and not a foreign key to a restaurant ID. If it is meant to be a foreign key,
        // please clarify, and its name should ideally reflect that (e.g., 'breakfast_restaurant_id').
      },
      lunch_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      dinner_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      snacks_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      combo_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      optional_item_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        allowNull: true,
        defaultValue: "Pending",
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'restaurant_diet_plans' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('restaurant_diet_plans');
  }
};
