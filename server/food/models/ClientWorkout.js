"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path to your Sequelize instance

class ClientWorkout extends Model {
  static associate(models) {
    ClientWorkout.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'client',
    });
    ClientWorkout.belongsTo(models.User, {
      foreignKey: 'trainer_id',
      as: 'trainer',
    });
  }
}

ClientWorkout.init({
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  trainer_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false,
  },
  body_part: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  exercise_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sets: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  reps: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  duration_min: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  media_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  media_type: {
    type: DataTypes.ENUM('mp4', 'gif', 'mp3', 'jpg', 'jpeg', 'png'),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ClientWorkout',
  tableName: 'client_workouts',
  underscored: true, // Assuming you might want underscored column names
  timestamps: true,  // Assuming you want timestamps (createdAt, updatedAt)
});

module.exports = ClientWorkout;