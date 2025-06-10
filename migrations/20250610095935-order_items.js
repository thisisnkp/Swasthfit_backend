'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'order_items' table.
     * It includes fields for 'order_id', 'item_id', 'quantity', and 'price'.
     * Foreign key constraints are added for 'order_id' referencing the 'foodorders' table
     * and 'item_id' referencing the 'fooditems' table.
     */
    await queryInterface.createTable('order_items', {
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
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems', // Ensure this matches your actual FoodItems table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      // Note: The OrderItems model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'order_items' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('order_items');
  }
};
