'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches the table name in the database
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transformation_photos: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expertise: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      experience: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_account_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      time_slot: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      client_details: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      client_bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      client_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      client_quote: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      client_qr_code: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      marketing_suite_purchases: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      ratings: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      aadhar_details: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      pan_details: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      offer: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      diet_and_workout_details: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission_earned: {
        type: Sequelize.INTEGER,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainers');
  }
};
