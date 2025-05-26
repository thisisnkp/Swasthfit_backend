const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const EasebuzzTransaction = require("./easebuzz_trans.model");

const EasebuzzWebhook = sequelize.define(
  "EasebuzzWebhook",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    txnid: { type: DataTypes.STRING, allowNull: false, references: { model: EasebuzzTransaction, key: "txnid" } },
    event_type: { type: DataTypes.STRING, allowNull: false },
    webhook_data: { type: DataTypes.JSON, allowNull: false },
  },
  {
    tableName: "easebuzz_webhooks",
    timestamps: true,
    createdAt: "created_at",
  }
);

EasebuzzWebhook.belongsTo(EasebuzzTransaction, { foreignKey: "txnid", targetKey: "txnid" });

module.exports = EasebuzzWebhook;
