'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_diet_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_diet_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'client_diet_plans', // DB table name for ClientDietPlan model
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // No references defined in your model, so none here
      },
      breakfast_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'restaurants', // DB table name for FoodRestaurant model
          key: 'id',
        },
        onDelete: 'CASCADE',
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
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: true,
        defaultValue: 'Pending',
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurant_diet_plans');
  }
};
