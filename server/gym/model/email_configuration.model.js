const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const MailSetting = sequelize.define(
  "MailSetting",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    mail_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    mail_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mail_port: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtp_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    smtp_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mail_encryption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gym_id: {
      type: DataTypes.BIGINT.UNSIGNED,
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
    tableName: "email_configurations",
    timestamps: false,
  }
);

module.exports = MailSetting;
