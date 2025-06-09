const express = require("express");
const router = express.Router();
const loginAccess = require("../../login.middleware");
const userController = require("./user.controller");
const trainerController = require("./trainer.controller");
const otpController = require("./otp.controller");
const userDetailsController = require("./user-details/user.details.controller");
const refreshJWT = require("../config/refreshJWT");
const verifyJWT = require("../../checkingAccess");
const authenticateJWT = require("../../authenticateJWT");
const enquiryRoutes = require("../enquiry/enquiry.route");

// Debug log to check userController.userLogin
console.log("userController.userLogin:", typeof userController.userLogin);

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
router.post("/trainer/verify-otp", otpController.verifyOtp); //trainer otp verification
router.put(
  "/trainer/profile",
  verifyJWT,
  trainerController.updateTrainerProfile
); //trainer profile update

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

router.get("/trainers/:id", verifyJWT, userController.getTrainerById);
router.get("/trainers", verifyJWT, userController.getAllTrainers);

router.post("/book-trainer", authenticateJWT, userController.bookTrainer);

router.get("/user-fit-data", verifyJWT, userController.getAllUserFitData);
router.get(
  "/user-fit-data/:userId",
  verifyJWT,
  userController.getUserFitDataByUserId
); //get user fit data by user id

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
