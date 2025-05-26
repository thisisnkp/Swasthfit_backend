const express = require("express");
const router = express.Router();
const enquiryController = require("./enquiry.controller");
const authenticateJWT = require("../../authenticateJWT");

// Route to send a new enquiry message
router.post("/send", authenticateJWT, enquiryController.sendEnquiryMessage);

// Route to get enquiry messages for user or vender
router.get("/messages", authenticateJWT, enquiryController.getEnquiryMessages);

// Route to reply to an enquiry message
router.post("/reply", authenticateJWT, enquiryController.replyEnquiryMessage);

module.exports = router;
