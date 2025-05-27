const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GymAssignedBatch = sequelize.define(
  "GymAssignedBatch",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "gym_assigned_batch",
    timestamps: true,
  }
);

module.exports = GymAssignedBatch;
