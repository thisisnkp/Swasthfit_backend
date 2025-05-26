'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_fit_data', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches the table name in the database
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      target_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      per_exp: {
        type: Sequelize.TEXT, // Storing JSON as TEXT (MariaDB doesn't support JSONB)
        allowNull: true,
      },
      sickness: {
        type: Sequelize.TEXT, // Storing JSON as TEXT (MariaDB doesn't support JSONB)
        allowNull: true,
      },
      physical_activity: {
        type: Sequelize.TEXT, // Storing JSON as TEXT (MariaDB doesn't support JSONB)
        allowNull: true,
      },
      fit_goal: {
        type: Sequelize.TEXT, // Storing JSON as TEXT (MariaDB doesn't support JSONB)
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(10), // Example: 'Male', 'Female', 'Other'
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_fit_data');
  },
};
