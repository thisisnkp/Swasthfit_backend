function setupAssociations() {
  const Activity = require("./server/SFL/models/Activities");
  const UserActivity = require("./server/SFL/models/UserActivities");
  const Competition = require("./server/SFL/models/Competition");
  const CompetitionPrize = require("./server/SFL/models/CompetitionPrize");
  const CompetitionParticipation = require("./server/SFL/models/CompetitionParticipation");

  const CoinSeller = require("./server/SFL/models/CoinSeller");
  const CoinBid = require("./server/SFL/models/CoinBid");

  const Day = require("./server/workout/model/days.model");
  const BodyPart = require("./server/workout/model/bodypart.model");
  const Exercise = require("./server/workout/model/exercise.model");
  const WorkoutDetail = require("./server/workout/model/workoutdetails.model");
  const User = require("./server/user/models/user.model");

  // Define the association between UserActivity and Activity
  UserActivity.belongsTo(Activity, {
    foreignKey: "activity_id",
    as: "activity",
  });

  Activity.hasMany(UserActivity, {
    foreignKey: "activity_id",
    as: "userActivities",
  });

  CompetitionParticipation.belongsTo(Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  Competition.hasMany(CompetitionParticipation, {
    foreignKey: "competition_id",
    as: "participants",
  });

  CoinSeller.hasMany(CoinBid, {
    foreignKey: "coin_seller_id",
    as: "bids",
  });

  CoinBid.belongsTo(CoinSeller, {
    foreignKey: "coin_seller_id",
    as: "seller",
  });

  CompetitionPrize.belongsTo(Competition, {
    foreignKey: "competition_id",
    as: "competition",
    targetKey: "id",
  });

  Competition.hasMany(CompetitionPrize, {
    foreignKey: "competition_id",
    as: "prizes",
    sourceKey: "id",
  });

  // Exercise belongs to a BodyPart
  Exercise.belongsTo(BodyPart, { foreignKey: "body_part_id", as: "bodyPart" });
  BodyPart.hasMany(Exercise, {
    foreignKey: "body_part_id",
    as: "bodyPartExercises",
  });

  // WorkoutDetail belongs to an Exercise
  WorkoutDetail.belongsTo(Exercise, {
    foreignKey: "exercise_id",
    as: "workoutExercise",
  });
  Exercise.hasMany(WorkoutDetail, {
    foreignKey: "exercise_id",
    as: "exerciseWorkoutDetails",
  });

  // WorkoutDetail can be linked to a specific Day
  WorkoutDetail.belongsTo(Day, { foreignKey: "day_id", as: "workoutDay" });
  Day.hasMany(WorkoutDetail, { foreignKey: "day_id", as: "dayWorkoutDetails" });

  // If workouts are personalized per user:
  WorkoutDetail.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(WorkoutDetail, { foreignKey: "user_id", as: "workouts" });

  console.log("Associations set up successfully");
}

module.exports = setupAssociations;
