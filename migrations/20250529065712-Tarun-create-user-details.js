"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_details", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      sleep_time: {
        type: Sequelize.STRING,
      },

      sleep_hours: {
        type: Sequelize.STRING,
      },

      followed_diet_plan: {
        type: Sequelize.ENUM("yes", "no"),
      },

      last_time_dite: {
        type: Sequelize.STRING,
      },

      followed_exercies_plan: {
        type: Sequelize.ENUM("yes", "no"),
      },

      last_time_exercise: {
        type: Sequelize.STRING,
      },

      physical_movement: {
        type: Sequelize.ENUM("yes", "no"),
      },

      last_time_physical_movement: {
        type: Sequelize.STRING,
      },

      water_intake: {
        type: Sequelize.INTEGER,
      },

      get_tired: {
        type: Sequelize.ENUM("yes", "no"),
      },

      feel_drizzing: {
        type: Sequelize.ENUM("yes", "no"),
      },

      how_much_smoke: {
        type: Sequelize.STRING,
      },

      how_often_drink: {
        type: Sequelize.STRING,
      },

      usually_drink: {
        type: Sequelize.STRING,
      },

      take_medication: {
        type: Sequelize.ENUM("yes", "no"),
      },

      medical_certificat: {
        type: Sequelize.STRING,
      },

      recently_hospitalised: {
        type: Sequelize.ENUM("yes", "no"),
      },

      suffer_from_asthma: {
        type: Sequelize.ENUM("yes", "no"),
      },

      have_uric_acid: {
        type: Sequelize.ENUM("yes", "no"),
      },

      diabetes: {
        type: Sequelize.ENUM("yes", "no"),
      },

      dibetes_certificate: {
        type: Sequelize.STRING,
      },

      have_cholestrol: {
        type: Sequelize.ENUM("yes", "no"),
      },

      high_ot_low_blood_pressure: {
        type: Sequelize.ENUM("yes", "no"),
      },

      blood_certificate: {
        type: Sequelize.STRING,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_details");
  },
};
