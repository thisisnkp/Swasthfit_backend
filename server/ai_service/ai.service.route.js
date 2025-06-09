const express = require("express");
const router = express.Router();
const verifyJWT = require("../../checkingAccess");
const bodyMeasurementsController = require("./body_measurements/body_measurements.controller");
const faceAnalyzedController = require("./face_analyzed/face_analyzed.controller");
const foodAnalyzedController = require("./food_analyzed/food_analyzed.controller");

router.post(
  "/body-measurements",
  verifyJWT,
  bodyMeasurementsController.createBodyMeasurement
);
router.get(
  "/body-measurements",
  verifyJWT,
  bodyMeasurementsController.getBodyMeasurements
);

router.post(
  "/face-analyzed",
  verifyJWT,
  faceAnalyzedController.createFaceAnalyzed
);
router.get("/face-analyzed", verifyJWT, faceAnalyzedController.getFaceAnalyzed);

router.post(
  "/food-analyzed",
  verifyJWT,
  foodAnalyzedController.createFoodAnalyzed
);
router.get("/food-analyzed", verifyJWT, foodAnalyzedController.getFoodAnalyzed);

module.exports = router;
