const Exercise = require("./exercise.model");
const BodyPart = require("./bodypart.model");
const WorkoutDetail = require("./workoutdetails.model");
const Day = require("./days.model");

// Define associations

// Exercise belongs to BodyPart
Exercise.belongsTo(BodyPart, { foreignKey: "body_part_id", as: "body_part" });
BodyPart.hasMany(Exercise, { foreignKey: "body_part_id", as: "exercises" });

// WorkoutDetail belongs to Exercise
WorkoutDetail.belongsTo(Exercise, { foreignKey: "exercise_id", as: "exercise" });
Exercise.hasMany(WorkoutDetail, { foreignKey: "exercise_id", as: "workoutDetails" });

// WorkoutDetail belongs to Day
WorkoutDetail.belongsTo(Day, { foreignKey: "day_id", as: "day" });
Day.hasMany(WorkoutDetail, { foreignKey: "day_id", as: "workoutDetails" });

module.exports = {
  Exercise,
  BodyPart,
  WorkoutDetail,
  Day,
};
