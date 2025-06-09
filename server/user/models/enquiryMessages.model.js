const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const EnquiryMessage = sequelize.define(
  "EnquiryMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vender_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    send: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_reply: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "EnquiryMessage",
    tableName: "enquiry_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = EnquiryMessage;
