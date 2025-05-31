"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gym_role_permissions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "gym_roles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "gym_permissions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("gym_role_permissions");
  },
};
