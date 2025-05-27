const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); 

const facebookAuth = sequelize.define("facebookAuth", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "facebook",
  },
  accessToken: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  module_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vendor_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
    tableName: "facebook_auth", 
    timestamps: true,
  }
);

module.exports = facebookAuth;