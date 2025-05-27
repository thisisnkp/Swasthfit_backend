const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

// Import your models
const Attendance = require("./gym_attendance.model"); // Assuming this is the correct path
const User = require("../../user/user.model"); // Assuming this is the correct path

// Define associations here
// This helps Sequelize understand the relationships between your models
Attendance.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Attendance, { foreignKey: "user_id" });

// Export models if needed elsewhere, or just ensure associations are defined when this file is required
module.exports = {
  Attendance,
  User,
};
