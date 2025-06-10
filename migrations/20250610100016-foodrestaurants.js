'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodrestaurants' table.
     * It includes various fields related to restaurant details,
     * such as vendor_id, username, password, title, address,
     * contact information, financial details, and status flags.
     * A foreign key constraint is added for 'vendor_id' referencing the 'vendors' table,
     * and 'diet_pack_id' referencing the 'diet_packages' table (if it exists).
     */
    await queryInterface.createTable('foodrestaurants', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      diet_pack_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'diet_packages', // Ensure this matches your actual DietPackage table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Assuming a 'vendors' table exists for the foreign key.
        // If not, you might need to create that migration first.
        references: {
          model: 'vendors', // Replace with your actual vendors table name if different
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      rimg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      full_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      store_charge: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ifsc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receipt_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      acc_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rest_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sdesc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      pan_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gst_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fssai_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aadhar_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aadhar_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
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
      delivery_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      delivery_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodrestaurants' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodrestaurants');
  }
};
