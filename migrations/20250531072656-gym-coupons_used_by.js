"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coupons_used_by", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      coupon_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      module_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      used_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("coupons_used_by");
  },
};
