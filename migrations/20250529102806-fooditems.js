'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fooditems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodrestaurants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'foodcategories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      menu_name: Sequelize.STRING,
      description: Sequelize.STRING,
      menu_img: Sequelize.STRING,
      price: Sequelize.FLOAT,
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      total_quantity: Sequelize.INTEGER,
      unit: Sequelize.STRING,
      cost_price: Sequelize.FLOAT,
      calories: Sequelize.FLOAT,
      diet_type: {
        type: Sequelize.ENUM('veg', 'non_veg', 'vegan', 'eggetarian'),
        allowNull: false,
        defaultValue: 'veg'
      },
      variants: Sequelize.STRING,
      addons: Sequelize.STRING,
      spice_level: {
        type: Sequelize.ENUM('none', 'mild', 'medium', 'hot'),
        allowNull: false,
        defaultValue: 'none'
      },
      tags: Sequelize.STRING,
      prep_time: Sequelize.INTEGER,
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_recommended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      distance: Sequelize.FLOAT,
      ingredients: Sequelize.STRING,
      cuisine_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fooditems');
  }
};
