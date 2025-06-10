'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'restaurant_stock_reports' table.
     * It includes fields such as 'item_name', 'category', 'quantity_in_stock',
     * 'reorder_level', 'supplier', and 'last_restocked_date'.
     * This model has 'timestamps: false', so created_at and updated_at columns
     * are not included in this migration.
     */
    await queryInterface.createTable('restaurant_stock_reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity_in_stock: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      reorder_level: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_restocked_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      // Note: The RestaurantStockReport model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'restaurant_stock_reports' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('restaurant_stock_reports');
  }
};
