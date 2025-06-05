const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GeneralItem = sequelize.define(
  "GeneralItem",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gym_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    template_type: {
      type: DataTypes.ENUM("SMS", "Email"),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "email_templates",
    timestamps: false,
  }
);

module.exports = GeneralItem;
