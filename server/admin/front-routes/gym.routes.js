const express = require("express");
const router = express.Router();
const { LoginApi } = require("../controllers/gym.controller"); // Ensure correct path

// Route for login
router.post("/login", LoginApi);

module.exports = router;