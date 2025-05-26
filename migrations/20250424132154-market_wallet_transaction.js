'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('market_wallet_transaction', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      reach: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      click: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      conversion: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('market_wallet_transaction');
  }
};
