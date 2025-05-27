const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  staff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gym_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  }

}, {
  timestamps: false,
  tableName: "roles",
});

module.exports = Role;
