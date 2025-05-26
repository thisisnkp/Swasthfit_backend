'use strict';

const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('gyms', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      business_type: {
        type: Sequelize.ENUM('direct', 'franchise'),
        allowNull: false,
        defaultValue: 'direct',
      },
      gym_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gym_logo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gym_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gym_geo_location: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      facilities: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      msme_certificate_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      msme_certificate_photo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      shop_certificate: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      shop_certificate_photo: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      about_us: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ratings: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      gst_details: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bank_details: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cancel_cheque: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('gyms');
  },
};
