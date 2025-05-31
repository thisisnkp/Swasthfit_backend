const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

// Import your models
const Attendance = require("./gym_attendance.model"); // Assuming this is the correct path
const User = require("../../user/user.model"); // Assuming this is the correct path
const Membership = require("../../membership/membership/membership.model"); // Assuming this is the correct path

// Define associations here
// This helps Sequelize understand the relationships between your models
Attendance.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Attendance, { foreignKey: "user_id" });

Membership.belongsTo(User, {
  foreignKey: "user_id", // This is the column in the 'memberships' table
  targetKey: "id", // This is the column in the 'users' table (default 'id')
  as: "user", // This alias is used in the controller's include
});

if (models.Membership) {
  User.hasMany(models.Membership, {
    foreignKey: "user_id", // Column in 'memberships' table
    sourceKey: "id", // Column in 'users' table
    as: "memberships", // Alias for when you query from User to get Memberships
  });
}

// Export models if needed elsewhere, or just ensure associations are defined when this file is required
module.exports = {
  Attendance,
  User,
  Membership,
};
