"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SeniorTrainer extends Model {
    static associate(models) {
      SeniorTrainer.belongsTo(models.Trainer, {
        foreignKey: "junior_id",
        as: "trainer",
      });
      SeniorTrainer.belongsTo(models.Trainer, {
        foreignKey: "assigned_trainer_id",
        as: "assignedTrainer",
      });
    }
  }
  SeniorTrainer.init(
    {
      junior_id: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      assigned_trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "SeniorTrainer",
      tableName: "senior_trainers",
      timestamps: false,
    }
  );
  return SeniorTrainer;
};
