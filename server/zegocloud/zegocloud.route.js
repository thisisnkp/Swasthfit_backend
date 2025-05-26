const express = require("express");
const router = express.Router();
const authMiddleware = require("../../authenticateJWT");
const zegoController = require("./zegocloud.controller");

// All routes below are JWT-protected
// router.get("/get-token", authMiddleware, zegoController.getZegoToken);
// router.post("/send-message", authMiddleware, zegoController.sendMessage);
// router.get("/chat-history", authMiddleware, zegoController.getChatHistory);

// For local testing WITHOUT auth
router.get("/get-token", zegoController.getZegoToken);
router.post("/send-message", zegoController.sendMessage);
router.get("/chat-history", zegoController.getChatHistory);

module.exports = router;
