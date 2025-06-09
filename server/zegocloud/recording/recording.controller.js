const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Transcription = require("../channel/models/transcription.model");

// Configure multer storage for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/recordings");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Placeholder for ZEGOCLOUD SDK integration
// This should include methods to start transcription and recording,
// listen to transcription events, and stop recording.

// Start transcription and recording when meeting starts
async function startRecordingAndTranscription(meetingId, channelName) {
  // TODO: Integrate ZEGOCLOUD real-time transcription and recording start logic here
  console.log(
    `Starting recording and transcription for meeting ${meetingId} on channel ${channelName}`
  );
}

// Stop transcription and recording when meeting ends
async function stopRecordingAndTranscription(meetingId, channelName) {
  // TODO: Integrate ZEGOCLOUD stop logic here
  // After stopping, save transcription text and video URL to DB
  console.log(
    `Stopping recording and transcription for meeting ${meetingId} on channel ${channelName}`
  );
}

// Express middleware to handle video upload
const uploadVideo = upload.single("video");

// Save transcription text and video URL to DB
async function saveTranscriptionData(
  meetingId,
  channelName,
  transcriptionText,
  videoUrl
) {
  let transcription = await Transcription.findOne({
    where: { meeting_id: meetingId, channel_name: channelName },
  });

  if (transcription) {
    transcription.transcription_text =
      transcriptionText || transcription.transcription_text;
    transcription.video_url = videoUrl || transcription.video_url;
    await transcription.save();
  } else {
    transcription = await Transcription.create({
      meeting_id: meetingId,
      channel_name: channelName,
      transcription_text: transcriptionText,
      video_url: videoUrl,
    });
  }
  return transcription;
}

module.exports = {
  startRecordingAndTranscription,
  stopRecordingAndTranscription,
  uploadVideo,
  saveTranscriptionData,
};
