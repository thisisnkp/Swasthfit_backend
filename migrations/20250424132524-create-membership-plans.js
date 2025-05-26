'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('membership_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      created_by: {
        type: Sequelize.ENUM('Admin', 'Gym'),
        allowNull: false,
      },
      gym_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Will validate this in controller
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(
          'Gym Pass',
          'AI Features',
          'Diet Workout',
          'Brain Games',
          'Fitbee',
          'Social Gym Buddy'
        ),
        allowNull: false,
      },
      membership_type: {
        type: Sequelize.ENUM('Monthly', 'Yearly'),
        allowNull: false,
      },
      base_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      selling_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('membership_plans');
  },
};
