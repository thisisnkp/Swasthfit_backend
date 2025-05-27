const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const User = require("../../user/user.model");
const EasebuzzPayment = sequelize.define(
  "easebuzz_payment",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    txnid: { type: DataTypes.STRING(19), allowNull: false },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },

    amount: { type: DataTypes.FLOAT, allowNull: false },
    firstname: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: false, allowNull: false },
    phone: { type: DataTypes.STRING(15), unique: true, allowNull: false },
    product_info: { type: DataTypes.STRING(100), allowNull: false },
    success_url: { type: DataTypes.TEXT, allowNull: false },
    failure_url: { type: DataTypes.TEXT, allowNull: false },
    // Optional parameters
    udf1: { type: DataTypes.STRING(255), allowNull: true },
    udf2: { type: DataTypes.STRING(255), allowNull: true },
    udf3: { type: DataTypes.STRING(255), allowNull: true },
    udf4: { type: DataTypes.STRING(255), allowNull: true },
    udf5: { type: DataTypes.STRING(255), allowNull: true },
    address1: { type: DataTypes.STRING(255), allowNull: true },
    address2: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    zip_code: { type: DataTypes.STRING(10), allowNull: true },
    unique_id: { type: DataTypes.STRING(100), allowNull: true },
    customer_authentication_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sub_merchant_id: { type: DataTypes.STRING(50), allowNull: true },
    split_payment: { type: DataTypes.TEXT, allowNull: true }, // JSON serialized
    transaction_status: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    tableName: "easebuzz_payment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
// Relationship
EasebuzzPayment.belongsTo(User, { foreignKey: "user_id" });
// Hooks to serialize/deserialize split_payment JSON
EasebuzzPayment.addHook("beforeValidate", (payment, options) => {
  if (typeof payment.split_payment === "object") {
    payment.split_payment = JSON.stringify(payment.split_payment);
  }
});
EasebuzzPayment.addHook("afterFind", (result, options) => {
  if (result) {
    const parseField = (entry) => {
      if (entry.split_payment && typeof entry.split_payment === "string") {
        try {
          entry.split_payment = JSON.parse(entry.split_payment);
        } catch (err) {
          console.error("Failed to parse split_payment JSON:", err);
        }
      }
    };
    if (Array.isArray(result)) {
      result.forEach(parseField);
    } else {
      parseField(result);
    }
  }
});
module.exports = EasebuzzPayment;
