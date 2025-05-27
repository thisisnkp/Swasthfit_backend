const { DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");

const Vendor = sequelize.define("Vendor", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  businessName: { type: DataTypes.STRING, allowNull: false },
  businessEmail: { type: DataTypes.STRING, allowNull: false },
  PAN: { type: DataTypes.STRING, allowNull: true },
  GST: { type: DataTypes.STRING, allowNull: true },
  products: { type: DataTypes.TEXT, allowNull: false },
  sellingOnAmazon: { type: DataTypes.BOOLEAN, defaultValue: false },
  sellingOnFlipkart: { type: DataTypes.BOOLEAN, defaultValue: false },
  otherPlatforms: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

module.exports = Vendor;
