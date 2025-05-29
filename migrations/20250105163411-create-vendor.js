'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      businessName: {
        type: Sequelize.STRING
      },
      businessEmail: {
        type: Sequelize.STRING
      },
      PAN: {
        type: Sequelize.STRING
      },
      GST: {
        type: Sequelize.STRING
      },
      products: {
        type: Sequelize.TEXT
      },
      sellingOnAmazon: {
        type: Sequelize.BOOLEAN
      },
      sellingOnFlipkart: {
        type: Sequelize.BOOLEAN
      },
      otherPlatforms: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vendors');
  }
};