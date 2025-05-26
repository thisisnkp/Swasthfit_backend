'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('amenities', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      workout_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      closing_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gym_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      facilities: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      about_us: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('amenities');
  },
};
