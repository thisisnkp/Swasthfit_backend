const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Adjust path

const Workout = sequelize.define(
  "Workout",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trainer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING, // Monday, Tuesday, etc.
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING, // e.g., WORKOUT, YOGA, MEDITATION
      defaultValue: "WORKOUT",
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_exercise_name: DataTypes.STRING,
    sets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reps: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.FLOAT, // in minutes
      defaultValue: 0,
    },
    remark: DataTypes.TEXT,
    media_url: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "workouts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Workout;
