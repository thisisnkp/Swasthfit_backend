const { Sequelize } = require("sequelize");
const sequelize = require("../../../sequelize");
const { verify } = require("jsonwebtoken");
const { toDefaultValue } = require("sequelize/lib/utils");

const gymOwners = sequelize.define(
  "gym_owners",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    alternate_mobile: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    profile_image: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    pancard_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    pancard_no: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    password:{
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    market: {
      type: Sequelize.INTEGER(1),
      allowNull: true,
    },
    verify: {
      type: Sequelize.INTEGER(1),
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: "GymOwner",
    tableName: "gym_owners",
    timestamps: true, 
    underscored: true,
  }
);

module.exports = gymOwners;
