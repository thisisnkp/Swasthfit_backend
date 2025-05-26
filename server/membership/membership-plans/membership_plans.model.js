const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const MembershipPlan = sequelize.define(
  "MembershipPlan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_by: {
      type: DataTypes.ENUM("owner", "admin", "staff"),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(522),
      allowNull: true,
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.ENUM("silver", "gold", "platinum"),
      allowNull: false,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    membership_type: {
      type: DataTypes.STRING(522),
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW, // Sequelize automatically handles this
    },
  },
  {
    tableName: "membershipplans",
    timestamps: true, // Automatically adds createdAt and updatedAt
    underscored: true, //
  }
);

module.exports = MembershipPlan;
