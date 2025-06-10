'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'fooditems' table.
     * It includes fields such as 'restaurant_id', 'category_id', 'menu_name',
     * 'description', 'menu_img', 'price', 'discount', 'total_quantity', 'unit',
     * 'cost_price', 'calories', 'diet_type', 'variants', 'addons', 'spice_level',
     * 'tags', 'prep_time', 'available', 'is_recommended', 'rating', 'distance',
     * 'ingredients', 'cuisine_type', and timestamps.
     * Foreign key constraints are added for 'restaurant_id' referencing 'foodrestaurants'
     * and 'category_id' referencing 'foodcategories'.
     */
    await queryInterface.createTable('fooditems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'foodcategories', // Ensure this matches your actual FoodCategory table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      menu_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      menu_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        comment: "Discount in percentage"
      },
      total_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "e.g. Plate, Bowl, Piece"
      },
      cost_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: "Backend purchase cost"
      },
      calories: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: "Calories in kcal"
      },
      diet_type: {
        type: Sequelize.ENUM('veg', 'non_veg', 'vegan', 'eggetarian'),
        allowNull: false,
        defaultValue: 'veg'
      },
      variants: {
        type: Sequelize.STRING, // Corrected from DataTypes.STRING to Sequelize.STRING
        allowNull: true,
        comment: "Comma-separated variants e.g. Small, Medium, Large"
      },
      addons: {
        type: Sequelize.STRING, // Corrected from DataTypes.STRING to Sequelize.STRING
        allowNull: true,
        comment: "Comma-separated addons e.g. Extra Cheese, Gravy"
      },
      spice_level: {
        type: Sequelize.ENUM('none', 'mild', 'medium', 'hot'),
        allowNull: false,
        defaultValue: 'none'
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Comma-separated tags e.g. Bestseller, Kids"
      },
      prep_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Preparation time in minutes"
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "Availability: true = Available, false = Not Available"
      },
      is_recommended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      distance: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ingredients: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Comma-separated ingredients e.g. rice, jeera, tomato"
      },
      cuisine_type: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Cuisine type e.g. Indian, Chinese"
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
     * This 'down' migration will drop the 'fooditems' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('fooditems');
  }
};
