"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add migration logic here, for example:
    await queryInterface.createTable("gym_owners", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      alternate_mobile: {
        type: Sequelize.STRING(10),
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      profile_image: {
        type: Sequelize.STRING(150),
      },
      pancard_name: {
        type: Sequelize.STRING(100),
      },
      pancard_no: {
        type: Sequelize.STRING(10),
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      market: {
        type: Sequelize.TEXT,
      },
      verify: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      staff_access_level: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_role: {
        type: Sequelize.STRING(50),
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    // Drop table logic
    await queryInterface.dropTable("gym_owners");
  },
};
