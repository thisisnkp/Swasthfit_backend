"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("junior_assignment_history", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      starting_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      ending_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addConstraint("junior_assignment_history", {
      fields: ["trainer_id"],
      type: "foreign key",
      name: "fk_history_trainer",
      references: {
        table: "trainers",
        field: "id",
      },
    });

    await queryInterface.addConstraint("junior_assignment_history", {
      fields: ["client_id"],
      type: "foreign key",
      name: "fk_history_client",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("junior_assignment_history");
  },
};
