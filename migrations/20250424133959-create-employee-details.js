'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('emp_details_compensation', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.ENUM('Full Time', 'Contract', 'Part-time'),
        allowNull: true,
      },
      salary_type: {
        type: Sequelize.ENUM('Hourly', 'Annual'),
        allowNull: true,
      },
      payment_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      payment_unit: {
        type: Sequelize.ENUM('hour', 'year'),
        allowNull: true,
      },
      compensation_type: {
        type: Sequelize.ENUM('Annual', 'Hourly'),
        allowNull: true,
      },
      gross_annual_salary: {
        type: Sequelize.DECIMAL(10, 2),
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('emp_details_compensation');
  },
};
