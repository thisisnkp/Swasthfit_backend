const express = require("express");
const router = express.Router();
const swasthfitStaffController = require("./controllers/swasthfitStaff.controller");
const swasthfitStaffRegistrationController = require("./controllers/swasthfitStaff.registration.controller");

router.post(
  "/hr/add/trainer",
  swasthfitStaffRegistrationController.hrAddTrainer
);
router.post(
  "/hr/add/junior-trainer",
  swasthfitStaffRegistrationController.hrAddJuniorTrainer
);

router.get("/junior-trainers", swasthfitStaffController.getJuniorTrainers);
router.post(
  "/assign/tosenior",
  swasthfitStaffController.linkJuniorToSeniorTrainer
);

router.get("/connections", swasthfitStaffController.getAllConnections);

router.delete("/connection", swasthfitStaffController.deleteConnection);

router.post(
  "/assign/tojunior",
  swasthfitStaffController.assignClientToJuniorTrainer
);

router.get(
  "/connections/junior-to-clients",
  swasthfitStaffController.getJuniorClientConnectionsbyid
);

router.delete(
  "/connection/junior-to-client",
  swasthfitStaffController.deleteJuniorClientConnection
);

// New route to get junior trainers and clients by staff ID using query parameter
router.get(
  "/staff/junior-trainers-clients",
  swasthfitStaffController.getJuniorTrainersWithClientsByStaffId
);

module.exports = router;
