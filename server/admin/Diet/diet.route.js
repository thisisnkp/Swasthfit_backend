const express = require("express");
const router = express.Router();

const {
  suggestDiet,
  deleteDiet,
  updateDiet,
  getDietsForTrainer,
} = require("./diet_plan/diet.controller");

const { assignWorkout,deleteWorkout,updateWorkout,getWorkoutsForTrainer } = require("./workout_plan/workout.controller");

router.post("/suggestDiet", suggestDiet);
router.get("/getDiets/:trainer_id", getDietsForTrainer);
router.delete("/deleteDiet/:id/trainer/:trainer_id", deleteDiet);
router.put("/updateDiet/:id/trainer/:trainer_id", updateDiet);

router.post("/assignWorkout",assignWorkout)
router.get("/getWorkout/:trainer_id", getWorkoutsForTrainer);
router.delete("/deleteWorkout/:trainer_id/:workout_id",deleteWorkout);
router.put("/updateWorkout/:id/trainer/:trainer_id", updateWorkout);



module.exports = router;
