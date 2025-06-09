"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("trainers_all_payments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Uncomment below if you want to enforce foreign key constraint
        // references: {
        //   model: 'trainers',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      vendor_wallet_transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Uncomment below if you want to enforce foreign key constraint
        // references: {
        //   model: 'vendor_wallet_transactions',
        //   key: 'id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("trainers_all_payments");
  },
};
