'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // UserProductAction
    await queryInterface.createTable('user_product_action', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      latitude: Sequelize.FLOAT,
      longitude: Sequelize.FLOAT,
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'fooditems', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      module_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM('single_view', 'add_to_cart', 'add_to_wishlist', 'buy'),
        allowNull: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // UserAddress
    await queryInterface.createTable('useraddress', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      user_name: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      address: Sequelize.STRING,
      house_no: Sequelize.STRING,
      city: Sequelize.STRING,
      latitude: Sequelize.STRING,
      longitude: Sequelize.STRING,
      is_default: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // RestaurantSettings
    await queryInterface.createTable('restaurant_settings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'foodrestaurants', key: 'id' },
      },
      restaurant_logo: Sequelize.STRING,
      restaurant_name: { type: Sequelize.STRING, allowNull: false },
      owner_full_name: { type: Sequelize.STRING, allowNull: false },
      owner_phone_number: { type: Sequelize.STRING(10), allowNull: false },
      alternate_phone_number: Sequelize.STRING(10),
      owner_email: { type: Sequelize.STRING },
      full_address: Sequelize.TEXT,
      zip_code: Sequelize.STRING,
      city: Sequelize.STRING,
      country: Sequelize.STRING,
      opening_time: Sequelize.TIME,
      close_time: Sequelize.TIME,
      meta_title: Sequelize.STRING,
      meta_tag_keyword: Sequelize.STRING,
      description: Sequelize.TEXT,
      facebook_url: Sequelize.STRING,
      instagram_url: Sequelize.STRING,
      twitter_url: Sequelize.STRING,
      latitude: Sequelize.DOUBLE,
      longitude: Sequelize.DOUBLE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // RestaurantStockReport
    await queryInterface.createTable('restaurant_stock_reports', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      item_name: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      quantity_in_stock: { type: Sequelize.FLOAT, allowNull: false },
      reorder_level: { type: Sequelize.FLOAT, allowNull: false },
      supplier: { type: Sequelize.STRING, allowNull: false },
      last_restocked_date: { type: Sequelize.DATEONLY, allowNull: false },
      created_at: {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
},
updated_at: {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
}

    });

    // KYC Details
    await queryInterface.createTable('kyc_details', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      restaurant_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      bank_name: { type: Sequelize.STRING, allowNull: false },
      account_holder_name: { type: Sequelize.STRING, allowNull: false },
      account_number: { type: Sequelize.STRING, allowNull: false },
      ifsc_code: { type: Sequelize.STRING, allowNull: false },
      pan_name: { type: Sequelize.STRING, allowNull: false },
      pan_number: { type: Sequelize.STRING, allowNull: false },
      full_address: { type: Sequelize.STRING, allowNull: false },
      gst_number: { type: Sequelize.STRING, allowNull: false },
      msme_number: { type: Sequelize.STRING, allowNull: false },
      shop_certificate_number: { type: Sequelize.STRING, allowNull: false },
      cheque: { type: Sequelize.STRING, allowNull: false },
      gst_certificate: { type: Sequelize.STRING, allowNull: false },
      msme_certificate: { type: Sequelize.STRING, allowNull: false },
      shop_certificate: { type: Sequelize.STRING, allowNull: false },
      additional_docs: { type: Sequelize.JSONB },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // Invoices
    await queryInterface.createTable('invoices', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      invoice_id: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      customer_name: { type: Sequelize.STRING(100), allowNull: false },
      created_date: { type: Sequelize.DATE, allowNull: false },
      due_date: Sequelize.DATE,
      amount: Sequelize.BIGINT(20),
      payment_status: {
        type: Sequelize.ENUM('Paid', 'Unpaid', 'Overdue'),
        defaultValue: 'Unpaid',
      },
      payment_via: { type: Sequelize.STRING(50), allowNull: false },
      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      customer_address: Sequelize.STRING(255),
      customer_phone: Sequelize.STRING(50),
      delivery_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // InvoiceItems
    await queryInterface.createTable('invoice_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      invoice_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        references: { model: 'invoices', key: 'invoice_id' },
      },
      product_name: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('invoice_items');
    await queryInterface.dropTable('invoices');
    await queryInterface.dropTable('kyc_details');
    await queryInterface.dropTable('restaurant_stock_reports');
    await queryInterface.dropTable('restaurant_settings');
    await queryInterface.dropTable('useraddress');
    await queryInterface.dropTable('user_product_action');
  },
};
