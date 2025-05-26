'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_wallet_payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      module_type: {
        type: Sequelize.ENUM('e-com', 'gym', 'restaurant'),
        allowNull: false,
      },
      recharge_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      payment_mode: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      business_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gst: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendor_wallet_payments');
  }
};
