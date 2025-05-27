const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class Vendor extends Model {}

Vendor.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // table name
        key: "id", // column name in user table
      },
      onDelete: "CASCADE",
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    businessName: DataTypes.STRING,
    businessEmail: DataTypes.STRING,
    PAN: DataTypes.STRING,
    GST: DataTypes.STRING,
    password: DataTypes.STRING,
    vendorType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "RestVendors",
    tableName: "restvendors",
    timestamps: true,
  },
);

module.exports = Vendor;
