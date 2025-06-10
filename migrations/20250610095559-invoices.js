'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'invoices' table.
     * It includes fields such as 'id', 'invoice_id', 'customer_name',
     * 'created_date', 'due_date', 'amount', 'payment_status', 'payment_via',
     * 'invoice_date', 'customer_address', 'customer_phone', 'delivery_fee',
     * 'subtotal', 'tax', 'total', and timestamps (createdAt, updatedAt).
     */
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      customer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      amount: {
        type: Sequelize.BIGINT(20), // Use BIGINT for larger integer values
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.ENUM('Paid', 'Unpaid', 'Overdue'),
        defaultValue: 'Unpaid',
      },
      payment_via: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Use Sequelize.NOW for current date/time
      },
      customer_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      delivery_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
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

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'invoices' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('invoices');
  }
};
