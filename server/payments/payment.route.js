const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../authenticateJWT");
const { hireTrainer } = require("./payments.controller");

// Route to hire a trainer with authentication
router.post("/trainer-hiring", authenticateJWT, hireTrainer);

module.exports = router;
