const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const UserDetails = sequelize.define(
  "user_details",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sleep_time: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sleep_hours: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    followed_diet_plan: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    last_time_dite: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    followed_exercies_plan: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    last_time_exercise: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    physical_movement: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    last_time_physical_movement: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    water_intake: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    get_tired: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    feel_drizzing: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    how_much_smoke: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    how_often_drink: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    usually_drink: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    take_medication: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    medical_certificat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    recently_hospitalised: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    suffer_from_asthma: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    have_uric_acid: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    diabetes: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    dibetes_certificate: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    have_cholestrol: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    high_ot_low_blood_pressure: {
      type: DataTypes.ENUM("yes", "no"),
      allowNull: true,
    },
    blood_certificate: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "UserDetails",
    tableName: "user_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = UserDetails;
