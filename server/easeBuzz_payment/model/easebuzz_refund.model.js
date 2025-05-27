const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const EasebuzzTransaction = require("./easebuzz_trans.model");
// const User = require("../../user/user.model");

const EasebuzzRefund = sequelize.define(
  "EasebuzzRefund",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // user_id: { type: DataTypes.STRING, allowNull: false, references: { model: EasebuzzTransaction, key: "user_id" } },
    txnid: { type: DataTypes.STRING, allowNull: false, references: { model: EasebuzzTransaction, key: "txnid" } },
    refund_txnid: { type: DataTypes.STRING, unique: true, allowNull: false },
    refund_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    refund_reason: { type: DataTypes.STRING },
    refund_status: {
      type: DataTypes.ENUM("pending", "processed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "easebuzz_refunds",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EasebuzzRefund.belongsTo(EasebuzzTransaction, { foreignKey: "txnid", targetKey: "txnid" });

module.exports = EasebuzzRefund;
