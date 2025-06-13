"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian', 'swasthfit staff', 'junior trainer') NOT NULL DEFAULT 'trainer';"
    );

    await queryInterface.createTable("senior_trainers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      junior_id: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      assigned_trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "trainers",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });

    await queryInterface.createTable("current_junior_client_assignments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "trainers",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
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
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("junior_assignment_history", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "trainers",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
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
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
      },
    });

    await queryInterface.createTable("junior_trainer_client_connections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      junior_trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "trainers",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("junior_trainer_client_connections");
    await queryInterface.dropTable("junior_assignment_history");
    await queryInterface.dropTable("current_junior_client_assignments");
    await queryInterface.dropTable("senior_trainers");

    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian', 'swasthfit staff') NOT NULL DEFAULT 'trainer';"
    );
  },
};
