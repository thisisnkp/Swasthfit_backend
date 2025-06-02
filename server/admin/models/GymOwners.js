const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const GymOwner = sequelize.define(
  "GymOwner",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    alternate_mobile: {
      type: DataTypes.STRING(10),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profile_image: {
      type: DataTypes.STRING(150),
    },
    pancard_name: {
      type: DataTypes.STRING(100),
    },
    pancard_no: {
      type: DataTypes.STRING(10),
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    market: {
      type: DataTypes.TEXT,
    },
    verify: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    staff_access_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "gym_owners",
  }
);
module.exports = GymOwner;