'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('easebuzz_refunds', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      txnid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'easebuzz_transactions', // Referencing the correct table name for transactions
          key: 'txnid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      refund_txnid: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      refund_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      refund_status: {
        type: Sequelize.ENUM('pending', 'processed', 'failed'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('easebuzz_refunds');
  }
};
