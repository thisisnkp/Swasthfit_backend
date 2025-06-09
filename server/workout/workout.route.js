const workoutController = require("./workout.controller");
const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../authenticateJWT");
const uploadFiles = require("../../multer_uploads");

router.get("/days", authenticateJWT, workoutController.getDays);

router.get("/bodyparts", authenticateJWT, workoutController.getBodyParts);

router.get(
  "/bodyparts/:bodyPartId/exercises",
  authenticateJWT,
  workoutController.getExercisesByBodyPart
);

router.post("/workoutdetails", authenticateJWT, uploadFiles.single('video_link'), workoutController.createWorkoutDetail);
router.get("/workoutdetails", authenticateJWT, workoutController.getWorkoutDetail); // Use query params for combination of day/exercise
router.put("/workoutdetails/:id", authenticateJWT, uploadFiles.single('video_link'), workoutController.updateWorkoutDetail);

module.exports = router;
