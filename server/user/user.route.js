const express = require("express");
const router = express.Router();
const loginAccess = require("../../login.middleware");
const userController = require("./user.controller");
const trainerController = require("./trainer.controller");
const userDetailsController = require("./user-details/user.details.controller");
const refreshJWT = require("../config/refreshJWT");
const verifyJWT = require("../../checkingAccess");
const authenticateJWT = require("../../authenticateJWT");
const enquiryRoutes = require("../enquiry/enquiry.route");

//route to create a user
router.post(
  "/login",
  // loginAccess(),
  userController.userLogin
);

//route to create a user
router.post(
  "/register",
  // loginAccess(),
  userController.userRegistration
);

//route to create a trainer
router.post("/trainer/register", trainerController.trainerRegistration); //trainer registration
router.post("/trainer/verify-otp", trainerController.verifyOtp); //trainer otp verification
router.put("/trainer/profile", verifyJWT, userController.updateTrainerProfile); //triner profile update

//route to create a user
router.post("/refreshToken", loginAccess(), refreshJWT.refreshToken);
// Delete a user by ID
router.delete("/user/:userId", loginAccess(), userController.deleteUser);

// Fetch all users with pagination
router.get("/userslist", verifyJWT, userController.getAllUsersWithPagination);

//Update user by ID
router.put("/users/:id", verifyJWT, userController.updateUser);

// Route to fetch user details
router.get("/profile", verifyJWT, userController.getUserDetails);
router.get("/getUserByEmail/:email", verifyJWT, userController.getUserByEmail);

// Route to fetch a specific trainer by ID
router.get("/trainers/:id", verifyJWT, userController.getTrainerById);
router.get("/trainers", verifyJWT, userController.getAllTrainers);
// Route to book trainer details by ID
router.post("/book-trainer", authenticateJWT, userController.bookTrainer);
//trainer photos
router.get("/trainer/photos/:trainerId", userController.getTrainerPhotos);

// Route to fetch all uaers fit data details by ID
router.get("/user-fit-data", verifyJWT, userController.getAllUserFitData);
// Route to fetch fit data for a specific user, sorted by id DESC
router.get(
  "/user-fit-data/:userId",
  verifyJWT,
  userController.getUserFitDataByUserId
);

router.put("/user-details", verifyJWT, userController.updateUserDetails);

router.get(
  "/user-details/:userId",
  verifyJWT,
  userDetailsController.getUserDetailsByUserId
);

// Enquiry routes
router.use("/enquiry", enquiryRoutes);
// Export the router
module.exports = router;
