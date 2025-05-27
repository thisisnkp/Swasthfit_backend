const express = require("express");
const router = express.Router();
const path = require("path");
const { signup, signin, verifyToken } = require("./admin.controller");
const {
  createAdminKYC,
  getAdminKYC,
  updateAdminKYC,
  deleteAdminKYC,
} = require("./admin_kyc_details/admin.kyc.controller");
const {
  addingQNAData,
  updateAnswer,
  updateSpecificAnswer,
  deleteSpecificAnswer,
  deleteQuestion,
} = require("./controllers/questions.controllers");
const verifyJWT = require("../../checkingAccess");
// const router = express.Router();

// router.post('/signup', signup);
router.post("/signin", signin);
router.post("/verifyToken", verifyToken);

/**
 * -------------------------------------------------------
 * ----------- Question Routes By InfoTechZone -----------
 * -------------------------------------------------------
 */

// Post questions and answers
router.post("/questions", addingQNAData);

// Update all possible answers for a question
router.put("/questions/:id", updateAnswer);

// Update a specific answer for a question
router.put("/questions/:id/answer", updateSpecificAnswer);

// Delete a specific answer from a question
router.delete("/questions/:id/answer", deleteSpecificAnswer);

// Delete a question
router.delete("/questions/:id", deleteQuestion);

/**
 * ----------------------------------------------------------------------
 * --------- Frontend Routes File For User App And Trainer App ----------
 * ----------------------------------------------------------------------
 */
// Frontend Routes
const FrontRoute = require("./front-routes/front.routes");
router.use("/frontend", FrontRoute);

// Gym Routes
const gymRoutes = require("./front-routes/gym.routes");
router.use("/gym", gymRoutes);

const AdminDetailsController = require("./admin_personal_details/admin_details.controller");

// Create new admin details
router.post(
  "/createAdminDetails",
  verifyJWT,
  AdminDetailsController.createAdmin
);

// Get all admin details
router.get("/getAdminDetails", AdminDetailsController.getAllAdmins);

// Get admin details by ID
router.get(
  "/getAdminDetailsById",
  verifyJWT,
  AdminDetailsController.getAdminById
);

// Update admin details by ID
router.put(
  "/updateAdminDetails",
  verifyJWT,
  AdminDetailsController.updateAdmin
);

// Delete admin details by ID
router.delete("/deleteAdminDetails/:id", AdminDetailsController.deleteAdmin);

router.post("/createKyc", createAdminKYC);
router.get("/geyKyc/:id", getAdminKYC);
router.put("/updateKyc/:id", updateAdminKYC);
router.delete("/deleteKyc/:id", deleteAdminKYC);

const AmenitiesController = require("./amenties/amenties.controller");

// Create new amenities
router.post("/createAmenities", AmenitiesController.createAmenities);

// Get all amenities
router.get("/getAmenities", AmenitiesController.getAllAmenities);

// Get amenities by ID
router.get(
  "/getAmenitiesById/:id",
  verifyJWT,
  AmenitiesController.getAmenitiesById
);

// Update amenities by ID
router.put("/updateAmenities/:id", AmenitiesController.updateAmenities);

// Delete amenities by ID
router.delete("/deleteAmenities/:id", AmenitiesController.deleteAmenities);

module.exports = router;
