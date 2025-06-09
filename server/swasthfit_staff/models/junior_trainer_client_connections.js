"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JuniorTrainerClientConnection extends Model {
    static associate(models) {
      JuniorTrainerClientConnection.belongsTo(models.Trainer, {
        foreignKey: "junior_trainer_id",
        as: "juniorTrainer",
      });
      JuniorTrainerClientConnection.belongsTo(models.Trainer, {
        foreignKey: "client_id",
        as: "client",
      });
    }
  }
  JuniorTrainerClientConnection.init(
    {
      junior_trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: {
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
      modelName: "JuniorTrainerClientConnection",
      tableName: "junior_trainer_client_connections",
      timestamps: false,
    }
  );
  return JuniorTrainerClientConnection;
};
