'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaign_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      billing_country: {
        type: Sequelize.ENUM(
          'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
          'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Singapore',
          'United Arab Emirates', 'New Zealand', 'Japan', 'China', 'Brazil',
          'South Africa', 'Russia', 'Mexico', 'Other'
        ),
        allowNull: false,
      },
      timezone: {
        type: Sequelize.ENUM(
          'Coordinated Universal Time (UTC)', 'Indian Standard Time (IST)',
          'Pacific Standard Time (PST)', 'Eastern Standard Time (EST)',
          'Central Standard Time (CST)', 'Mountain Standard Time (MST)',
          'Greenwich Mean Time (GMT)', 'Central European Time (CET)',
          'Eastern European Time (EET)', 'Japan Standard Time (JST)',
          'Australian Eastern Standard Time (AEST)',
          'New Zealand Standard Time (NZST)', 'Other'
        ),
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM(
          'Indian Rupee (INR)', 'US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)',
          'Australian Dollar (AUD)', 'Canadian Dollar (CAD)', 'Singapore Dollar (SGD)',
          'Japanese Yen (JPY)', 'Chinese Yuan (CNY)', 'South African Rand (ZAR)',
          'Brazilian Real (BRL)', 'Russian Ruble (RUB)', 'Mexican Peso (MXN)', 'Other'
        ),
        allowNull: false,
      },
      offer_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      payment_mode: {
        type: Sequelize.ENUM('Online', 'Offline', 'Cash on Delivery', 'Wallet'),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM(
          'Razorpay', 'Stripe', 'PayPal', 'Google Pay', 'Apple Pay',
          'Bank Transfer', 'Cash', 'Other'
        ),
        allowNull: false,
      },
      country_code: {
        type: Sequelize.ENUM(
          'India (+91)', 'United States (+1)', 'United Kingdom (+44)', 'Australia (+61)',
          'Japan (+81)', 'Singapore (+65)', 'United Arab Emirates (+971)', 'Germany (+49)',
          'France (+33)', 'China (+86)', 'Brazil (+55)', 'Russia (+7)', 'Mexico (+52)', 'Other'
        ),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      radius: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      module_type: {
        type: Sequelize.ENUM('ecom', 'gym', 'restorant'),
        allowNull: false,
        defaultValue: 'ecom',
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaign_details');
  }
};
