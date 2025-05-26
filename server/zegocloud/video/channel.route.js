const express = require("express");
const router = express.Router();
const channelController = require("./channel.controller");

router.post("/schedule", channelController.scheduleChannel);
router.get("/list", channelController.listChannels);
router.post("/update-status", channelController.updateChannelStatus);

module.exports = router;
