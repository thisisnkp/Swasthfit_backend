"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("campaign_analysis", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      click: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      reach: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      conversion: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      buy: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("campaign_analysis");
  },
};
