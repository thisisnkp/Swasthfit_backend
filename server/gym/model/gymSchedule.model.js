const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../../../sequelize");
const Gym = require("../gym_owners/gym.model");

const GymSchedule = sequelize.define(
  "GymSchedule", // Corrected model name
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    gym_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Gyms", // Corrected model name for association
        key: "id",
      },
    },
    workout_details: {
      type: Sequelize.TEXT("long"),
      allowNull: false,
    },
    timings: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    alternate_closing_time: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "GymSchedule", 
    tableName: "gym_schedule",
    timestamps: true, 
    underscored: true, 
  }
);

// Define relationships
// GymSchedule.associate = (models) => {
//   if (models.Gym) {
//     GymSchedule.belongsTo(models.Gym, {
//       foreignKey: { name: 'gym_id', allowNull: false },
//       onDelete: 'CASCADE',
//     });
//   }
// };

// Validate hook to ensure arrays are serialized before validation
GymSchedule.addHook("beforeValidate", (gymSchedule, options) => {
  const fieldsToSerialize = ["workout_details", "timings"];

  fieldsToSerialize.forEach((field) => {
    if (Array.isArray(gymSchedule[field])) {
      gymSchedule[field] = JSON.stringify(gymSchedule[field]); // Fixed typo
    }
  });
});

// Deserialize JSON strings into arrays after fetching
GymSchedule.afterFind((gymSchedule, options) => {
  if (gymSchedule) {
    const fieldsToDeserialize = ["workout_details", "timings"];

    fieldsToDeserialize.forEach((field) => {
      if (typeof gymSchedule[field] === "string") {
        gymSchedule[field] = JSON.parse(gymSchedule[field]);
      }
    });
  }
});

module.exports = GymSchedule;
