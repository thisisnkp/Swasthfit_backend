'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodorderprices' table.
     * It includes fields such as 'order_id', 'item_price', 'delivery_price',
     * 'discount_price', 'tax', and 'total_price'.
     * A foreign key constraint is added for 'order_id' referencing the 'foodorders' table.
     */
    await queryInterface.createTable('foodorderprices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodorders', // Ensure this matches your actual FoodOrders table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Deletes order prices if the associated order is deleted
      },
      item_price: {
        type: Sequelize.DOUBLE,
        allowNull: true, // allowNull: 0.00 from model usually means it can be null if not provided, or a default 0.00
        defaultValue: 0.00, // Setting defaultValue based on model's implied intent
      },
      delivery_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0.00,
      },
      discount_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0.00,
      },
      tax: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0.00,
      },
      total_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0.00,
      },
      // Note: The FoodOrderPrices model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here
      // to match the model's configuration.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodorderprices' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodorderprices');
  }
};
