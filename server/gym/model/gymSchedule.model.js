const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const Gym = require("../gym_owners/gym.model");

const GymSchedule = sequelize.define(
  "GymSchedule",
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
        model: "Gyms",
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

GymSchedule.addHook("beforeValidate", (gymScheduleInstance, options) => {
  const fieldsToSerialize = ["workout_details", "timings"];

  fieldsToSerialize.forEach((field) => {
    if (
      typeof gymScheduleInstance[field] === "object" &&
      gymScheduleInstance[field] !== null
    ) {
      gymScheduleInstance[field] = JSON.stringify(gymScheduleInstance[field]);
    }
  });
});

GymSchedule.addHook("afterFind", (foundResult, options) => {
  const processInstance = (instance) => {
    if (instance) {
      const fieldsToDeserialize = ["workout_details", "timings"];
      fieldsToDeserialize.forEach((field) => {
        if (instance[field] && typeof instance[field] === "string") {
          try {
            instance[field] = JSON.parse(instance[field]);
          } catch (e) {
            console.error(
              `Error parsing JSON for field ${field} in GymSchedule ID ${instance.id}:`,
              e
            );
          }
        }
      });
    }
  };

  if (Array.isArray(foundResult)) {
    foundResult.forEach(processInstance);
  } else {
    processInstance(foundResult);
  }
});

module.exports = GymSchedule;
