const express = require("express");
const router = express.Router();
const loginAccess = require("../../login.middleware");
const userController = require("./user.controller");
const refreshJWT = require("../config/refreshJWT");
const {verifyToken} = require("../admin/admin.controller")

// route to create a user
router.post("/login", loginAccess(), userController.userLogin);

//route to create a user
// router.post("/register", userController.userRegistration);

//route to create a user
router.get("/refreshToken", loginAccess(), refreshJWT.refreshToken);

// Delete a user by ID
router.delete('/user/:userId',loginAccess(), userController.deleteUser);

// Fetch all users with pagination
router.get('/userslist', userController.getAllUsersWithPagination);

//Update user by ID
router.put('/users/:id', userController.updateUser);


// Route to fetch user details
router.get('/profile/:id', userController.getUserDetails);

// Export the router
module.exports = router;

