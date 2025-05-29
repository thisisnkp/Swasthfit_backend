"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("foodrestaurants", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      diet_pack_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rimg: Sequelize.STRING,
      status: Sequelize.STRING,
      full_address: Sequelize.STRING,
      pincode: Sequelize.STRING,
      landmark: Sequelize.STRING,
      latitude: Sequelize.FLOAT,
      longitude: Sequelize.FLOAT,
      store_charge: Sequelize.FLOAT,
      bank_name: Sequelize.STRING,
      ifsc: Sequelize.STRING,
      receipt_name: Sequelize.STRING,
      acc_number: Sequelize.STRING,
      rest_status: Sequelize.STRING,
      sdesc: Sequelize.TEXT,
      pan_no: Sequelize.STRING,
      gst_no: Sequelize.STRING,
      fssai_no: Sequelize.STRING,
      aadhar_no: Sequelize.STRING,
      aadhar_image: Sequelize.STRING,
      is_popular: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_fitmode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_dietpkg: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_dining: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_recommended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      delivery_time: Sequelize.INTEGER,
      delivery_status: Sequelize.STRING,
      created_by: Sequelize.STRING,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("foodrestaurants");
  },
};
