'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_stock_reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurant_stock_reports');
  }
};
