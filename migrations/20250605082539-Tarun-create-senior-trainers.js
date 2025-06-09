"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("senior_trainers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      junior_id: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      assigned_trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("senior_trainers", {
      fields: ["assigned_trainer_id"],
      type: "foreign key",
      name: "fk_assigned_junior",
      references: {
        table: "trainers",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("senior_trainers");
  },
};
