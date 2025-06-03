// models/User.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class User extends Model {}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: {
          args: [3, 30],
          msg: "Username must be between 3 and 30 characters long.",
      
  },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [6, 100],
          msg: "Password must be between 6 and 100 characters long.",
        },
      },
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      field: "user_email",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    underscored: true,
    timestamps: true,
  },
);

// Export the User model
module.exports = User;