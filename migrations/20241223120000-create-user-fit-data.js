'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_fit_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Table name for the `users` table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      target_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      per_exp: {
        type: Sequelize.TEXT, // Serialize array stored as JSON
        allowNull: false,
      },
      sickness: {
        type: Sequelize.TEXT, // Serialize array stored as JSON
        allowNull: false,
      },
      physical_activity: {
        type: Sequelize.TEXT, // Serialize array stored as JSON
        allowNull: false,
      },
      fit_goal: {
        type: Sequelize.TEXT, // Serialize array stored as JSON
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING, // Example: 'Male', 'Female', 'Other'
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_fit_data');
  },
};
