<<<<<<< HEAD
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("restaurant_stock_reports", {
=======
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurant_stock_reports', {
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
      },
=======
      }
>>>>>>> restaurent_backend
    });
  },

  async down(queryInterface, Sequelize) {
<<<<<<< HEAD
    await queryInterface.dropTable("restaurant_stock_reports");
  },
=======
    await queryInterface.dropTable('restaurant_stock_reports');
  }
>>>>>>> restaurent_backend
};
