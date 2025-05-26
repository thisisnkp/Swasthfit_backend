'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('easebuzz_webhooks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      txnid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'easebuzz_transactions', // assumes correct table name
          key: 'txnid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      event_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      webhook_data: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('easebuzz_webhooks');
  }
};
