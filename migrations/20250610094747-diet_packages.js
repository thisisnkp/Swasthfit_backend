'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'diet_packages' table.
     * It includes fields such as 'restaurant_id', 'name', 'description', 'img',
     * various boolean flags for meal types (breakfast, lunch, dinner, combo),
     * price fields for each meal type, and latitude/longitude.
     * A foreign key constraint is added for 'restaurant_id' referencing the
     * 'foodrestaurants' table.
     */
    await queryInterface.createTable('diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Based on the model, it can be null if no default for references.model is 'FoodRestaurant'
        references: {
          model: 'foodrestaurants', // Ensure this matches the actual table name of your FoodRestaurant model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Or 'CASCADE' depending on desired behavior if restaurant is deleted
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      breakfast: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lunch: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dinner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      combo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      // Note: The DietPackage model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'diet_packages' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('diet_packages');
  }
};
