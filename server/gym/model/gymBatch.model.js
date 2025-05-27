const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GymBatch = sequelize.define(
  "GymBatch",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    batch_from: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    batch_to: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    batch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
  },
  {
    tableName: "gym_batch",
    timestamps: true,
  }
);

module.exports = GymBatch;
