const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize"); // Adjust path as needed

const AppMembershipPlan = sequelize.define(
  "AppMembershipPlan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      //'gym','trainer','diet-workout','brain-games','go-social','gym-buddy','fitbee'
      type: DataTypes.STRING,
      allowNull: false,
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    membership_type: {
      //enum('gold', 'silver', 'bronze')
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //	enum('active', 'inactive')
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "membershipplans",
    timestamps: false,
  }
);

module.exports = AppMembershipPlan;
