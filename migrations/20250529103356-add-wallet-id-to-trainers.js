"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("trainers", "wallet_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      // Uncomment below to add a foreign key constraint:
      // references: {
      //   model: 'wallets', // replace with your actual wallets table
      //   key: 'id',
      // },
      // onUpdate: 'CASCADE',
      // onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("trainers", "wallet_id");
  },
};
