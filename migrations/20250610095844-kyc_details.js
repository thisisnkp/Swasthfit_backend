'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'kyc_details' table.
     * It includes fields for user and restaurant IDs, bank details,
     * PAN details, address, GST, MSME, shop certificates, and additional documents.
     * Foreign key constraints are added for 'user_id' referencing the 'users' table
     * and 'restaurant_id' referencing the 'foodrestaurants' table.
     *
     * Changes from previous version:
     * - `additional_docs` type changed from `Sequelize.JSONB` to `Sequelize.JSON` for broader database compatibility (e.g., MariaDB/MySQL).
     * - `updated_at` defaultValue simplified to `Sequelize.literal('CURRENT_TIMESTAMP')`.
     * For MariaDB/MySQL, `ON UPDATE CURRENT_TIMESTAMP` often needs to be part of the column definition
     * directly in SQL or implicitly handled by Sequelize's timestamp management;
     * the literal `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` syntax can cause errors.
     */
    await queryInterface.createTable('kyc_details', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes your users table is named 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodrestaurants', // Assumes your restaurant table is named 'foodrestaurants'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pan_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pan_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      msme_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop_certificate_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cheque: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gst_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      msme_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      additional_docs: {
        type: Sequelize.JSON, // Changed from JSONB to JSON for broader compatibility
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Simplified literal
        // For MariaDB/MySQL, to ensure `updated_at` automatically updates on row change,
        // you might need to manually apply `ON UPDATE CURRENT_TIMESTAMP` to the column.
        // Sequelize's `createTable` might not add this directly with a simple literal.
        // Example if needed after migration:
        // ALTER TABLE `kyc_details` MODIFY COLUMN `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'kyc_details' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('kyc_details');
  }
};
