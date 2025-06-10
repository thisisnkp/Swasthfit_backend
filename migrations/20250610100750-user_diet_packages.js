'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'user_diet_packages' table.
     * It includes fields such as 'restaurant_id', 'diet_package_id',
     * 'status', and various price fields (breakfast, lunch, dinner, combo).
     * Foreign key constraints are added for 'restaurant_id' referencing the 'foodrestaurants' table
     * and 'diet_package_id' referencing the 'diet_packages' table.
     */
    await queryInterface.createTable('user_diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow null if not directly associated at creation, or change to false if always required
        references: {
          model: 'foodrestaurants', // Ensure this matches your actual FoodRestaurant table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Or 'CASCADE' if you want to delete this record if restaurant is deleted
      },
      diet_package_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Allow null if not directly associated at creation, or change to false if always required
        references: {
          model: 'diet_packages', // Ensure this matches your actual DietPackage table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Or 'CASCADE' if you want to delete this record if diet package is deleted
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
        allowNull: true, // ENUMs with default values often don't need to be allowNull: false unless strictly enforced
      },
      breakfast_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lunch_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      dinner_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      combo_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      // Note: The RestaurantDietPackage model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'user_diet_packages' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('user_diet_packages');
  }
};
