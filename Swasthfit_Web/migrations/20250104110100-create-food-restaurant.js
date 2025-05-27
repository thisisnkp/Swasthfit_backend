'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('FoodRestaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rimg: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      full_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      store_charge: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ifsc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receipt_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      acc_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rest_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sdesc: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pan_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gst_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fssai_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aadhar_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aadhar_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_popular: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_fitmode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_dietpkg: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_dining: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_recommended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('FoodRestaurants');
  }
};
