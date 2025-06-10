'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'invoice_items' table.
     * It includes fields such as 'invoice_id', 'product_name', 'quantity', 'price',
     * and timestamps (createdAt, updatedAt).
     * A foreign key constraint is added for 'invoice_id' referencing the 'invoice_id'
     * column in the 'invoices' table.
     */
    await queryInterface.createTable('invoice_items', {
      id: { // Added a primary key for InvoiceItem table
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      invoice_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'invoices', // Ensure this matches your actual Invoices table name
          key: 'invoice_id', // Referencing the unique 'invoice_id' column in the 'invoices' table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
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

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'invoice_items' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('invoice_items');
  }
};
