"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class FaceAnalyzed extends Model {}

FaceAnalyzed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "FaceAnalyzed",
    tableName: "face_anaylyzed",
    timestamps: false,
  }
);

module.exports = FaceAnalyzed;
