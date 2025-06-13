"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create `users` first WITHOUT FK to `foodrestaurants`
    await queryInterface.createTable("users", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      trainer_id: { type: Sequelize.INTEGER, allowNull: false },
      user_name: { type: Sequelize.STRING, allowNull: false },
      user_mobile: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true,
      },
      user_dob: Sequelize.DATE,
      user_age: Sequelize.INTEGER,
      user_gender: Sequelize.STRING,
      user_email: Sequelize.STRING,
      user_bank: Sequelize.TEXT,
      user_height: Sequelize.INTEGER,
      user_weight: Sequelize.INTEGER,
      user_aadhar: Sequelize.STRING(16),
      password: { type: Sequelize.STRING, allowNull: false },
      user_pan: Sequelize.STRING(10),
      user_address: Sequelize.TEXT,
      user_earned_coins: { type: Sequelize.INTEGER, defaultValue: 0 },
      user_gullak_money_earned: { type: Sequelize.INTEGER, defaultValue: 0 },
      user_gullak_money_used: { type: Sequelize.INTEGER, defaultValue: 0 },
      user_competitions: Sequelize.STRING,
      user_type: Sequelize.STRING,
      user_social_media_id: Sequelize.STRING,
      user_downloads: Sequelize.INTEGER,
      user_ratings: Sequelize.STRING,
      user_qr_code: Sequelize.STRING,
      is_signup: { type: Sequelize.BOOLEAN, defaultValue: true },
      otpless_token: { type: Sequelize.STRING(100), unique: true },
      is_approved: { type: Sequelize.BOOLEAN, defaultValue: true },
      restaurant_id: { type: Sequelize.INTEGER, allowNull: true }, // FK added later
      vendor_id: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // 2. Create `restvendors` next (depends on users)
    await queryInterface.createTable("restvendors", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      businessName: Sequelize.STRING,
      businessEmail: Sequelize.STRING,
      PAN: Sequelize.STRING,
      GST: Sequelize.STRING,
      password: Sequelize.STRING,
      vendorType: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // 3. Create `foodrestaurants` now (depends on restvendors)
    await queryInterface.createTable("foodrestaurants", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      diet_pack_id: Sequelize.INTEGER,
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "restvendors",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      username: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
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
      is_popular: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_fitmode: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_dietpkg: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_dining: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_recommended: { type: Sequelize.BOOLEAN, defaultValue: false },
      rating: { type: Sequelize.FLOAT, defaultValue: 0 },
      delivery_time: Sequelize.INTEGER,
      delivery_status: Sequelize.STRING,
      created_by: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // 4. Now add FK from `users.restaurant_id` ➝ `foodrestaurants.id`
   await queryInterface.addConstraint("users", {
  fields: ["restaurant_id"],
  type: "foreign key",
  name: "fk_users_restaurant_id_" + Date.now(), // Unique constraint name
  references: {
    table: "foodrestaurants",
    field: "id",
  },
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("foodrestaurants");
    await queryInterface.dropTable("restvendors");
    await queryInterface.dropTable("users");
  },
};
