const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust path if needed

const BloodReport = sequelize.define(
  "BloodReport",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "blood_reports",
    timestamps: false,
  }
);

module.exports = BloodReport;
