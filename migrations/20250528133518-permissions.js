"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("permissions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      feature_name: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      can_view: {
        type: Sequelize.ENUM("None", "All"),
        defaultValue: "None",
      },
      can_add: {
        type: Sequelize.ENUM("None", "All"),
        defaultValue: "None",
      },
      can_update: {
        type: Sequelize.ENUM("None", "All"),
        defaultValue: "None",
      },
      can_delete: {
        type: Sequelize.ENUM("None", "All"),
        defaultValue: "None",
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "modules", // Make sure this matches your table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("permissions");
  },
};
