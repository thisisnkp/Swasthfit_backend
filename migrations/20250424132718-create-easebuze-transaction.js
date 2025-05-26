'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('easebuzz_payment', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      txnid: {
        type: Sequelize.STRING(19),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure this references the correct table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      product_info: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      success_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      failure_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      udf1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      udf2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      udf3: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      udf4: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      udf5: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      unique_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_authentication_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sub_merchant_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      split_payment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      transaction_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('easebuzz_payment');
  }
};
