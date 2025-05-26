'use strict';

/** @type {import('sequelize-cli').Migration} */
const sequelize = require("../sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Vendors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      name: {type: Sequelize.STRING, allowNull: true},
      email: {type: Sequelize.STRING, allowNull: true},
      phone: {type: Sequelize.STRING, allowNull: true},
      storeName: { type: Sequelize.STRING, allowNull: false },
      storeDescription: { type: Sequelize.TEXT },
      storeLogo: { type: Sequelize.STRING },
      products: {type: Sequelize.TEXT, allowNull: true},
      sellingOnAmazon: {type: Sequelize.BOOLEAN, allowNull: true},
      sellingOnFlipkart: {type: Sequelize.BOOLEAN, allowNull: true},
      otherPlatforms: {type: Sequelize.TEXT, allowNull: true},
      PAN: {type: Sequelize.STRING, allowNull: true},
      GST: { type: Sequelize.STRING, allowNull: true },
      password: {type: Sequelize.STRING, allowNull: true},
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Vendors');
  },
};