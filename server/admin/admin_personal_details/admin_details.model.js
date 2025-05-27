const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GymBankDetail = sequelize.define(
  "GymBankDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, // Added gym_id field
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cancel_cheque: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gym_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    alternate_mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gym_logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_images: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
  },
  {
    tableName: "admin_personal_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = GymBankDetail;
