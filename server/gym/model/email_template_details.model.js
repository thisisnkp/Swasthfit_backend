const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const NotificationRecord = sequelize.define(
  "NotificationRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template_body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gym_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "email_templates_details",
    timestamps: false,
  }
);

module.exports = NotificationRecord;
