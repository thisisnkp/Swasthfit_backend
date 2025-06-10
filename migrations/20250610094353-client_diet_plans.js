'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'client_diet_plans' table.
     * It includes fields as defined in the ClientDietPlan model,
     * such as user_id, trainer_id, meal_type, food_item_name, and
     * various nutritional and price-related fields.
     * Foreign key constraints are added for 'user_id' and 'trainer_id'
     * referencing the 'users' table.
     */
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
          model: 'users', // Assumes your users table is named 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes your users table is named 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      meal_type: {
        type: Sequelize.ENUM('Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Water'),
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
        type: Sequelize.ENUM('Compulsory', 'Optional'),
        defaultValue: 'Compulsory',
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
        defaultValue: 'ML',
        allowNull: true,
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
        type: Sequelize.ENUM('Fixed', 'Percentage'),
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
        comment: 'For ordering multiple items within the same meal type'
      },
      is_water_intake: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // Note: The ClientDietPlan model has `timestamps: false`,
      // but Sequelize migrations typically include created_at and updated_at
      // if not explicitly excluded from the model. I've omitted them here
      // to match your model's timestamp setting.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'client_diet_plans' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('client_diet_plans');
  }
};
