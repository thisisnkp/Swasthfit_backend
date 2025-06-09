const express = require("express");
const router = express.Router();
const channelController = require("./channel.controller");
const authenticateJWT = require("../../../authenticateJWT");
const { uploadVideo } = require("../recording/recording.controller");

router.get(
  "/availability/:trainerId",
  channelController.getTrainerAvailability
);
router.get("/meetings", channelController.listScheduledMeetings);
router.post(
  "/meetings/schedule",
  authenticateJWT,
  channelController.scheduleMeeting
);

// New routes for transcription
router.post(
  "/meetings/transcription",
  authenticateJWT,
  channelController.saveTranscription
);

router.get(
  "/meetings/:meeting_id/transcription",
  authenticateJWT,
  channelController.getTranscription
);

// New route to end meeting and stop recording
router.post("/meetings/end", authenticateJWT, channelController.endMeeting);

// New route to upload recorded video
router.post(
  "/meetings/upload-video",
  authenticateJWT,
  uploadVideo,
  async (req, res) => {
    try {
      const { meeting_id, channel_name } = req.body;
      if (!meeting_id || !channel_name) {
        return res.status(400).json({
          success: false,
          message: "meeting_id and channel_name are required",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Video file is required",
        });
      }
      const videoUrl = `/uploads/recordings/${req.file.filename}`;
      // Save video URL in transcription record
      const transcription = await channelController.saveTranscription({
        meeting_id,
        channel_name,
        transcription_text: null,
        video_url: videoUrl,
      });
      res.json({ success: true, videoUrl });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
