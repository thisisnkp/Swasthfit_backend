'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_diet_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      meal_type: {
        type: Sequelize.ENUM("Breakfast", "Lunch", "Snacks", "Dinner", "Water"),
        allowNull: false,
      },
      food_item_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      quantity_unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fats: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      protein: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      carbs: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      food_type: {
        type: Sequelize.ENUM("Compulsory", "Optional"),
        allowNull: true,
        defaultValue: "Compulsory",
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      water_intake: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      water_intake_unit: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "ML",
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
      snacks_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      combo_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      discount_type: {
        type: Sequelize.ENUM("Fixed", "Percentage"),
        allowNull: true,
      },
      discount_value: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      plan_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      optional_item_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      optional_item_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      meal_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "For ordering multiple items within the same meal type",
      },
      is_water_intake: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('client_diet_plans');
  }
};
