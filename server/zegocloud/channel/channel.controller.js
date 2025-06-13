const Channel = require("./models/channel.model");
const TrainerHiringData = require("../../payments/payment.model");
const TrainerAvailability = require("./models/trainer_availability.model");
const ScheduledMeeting = require("./models/scheduled_meetings.model");
const Transcription = require("./models/transcription.model");
const { Op } = require("sequelize");
const {
  startRecordingAndTranscription,
  stopRecordingAndTranscription,
} = require("../recording/recording.controller");

// Get trainer availability for a given trainer
exports.getTrainerAvailability = async (req, res) => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res
        .status(400)
        .json({ success: false, message: "trainerId is required" });
    }
    const availability = await TrainerAvailability.findAll({
      where: { trainer_id: trainerId },
    });
    res.json({ success: true, availability });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List scheduled meetings for a trainer or client
exports.listScheduledMeetings = async (req, res) => {
  try {
    const { trainerId, clientId } = req.query;
    if (!trainerId && !clientId) {
      return res
        .status(400)
        .json({ success: false, message: "trainerId or clientId is required" });
    }
    const whereClause = {};
    if (trainerId) whereClause.trainer_id = trainerId;
    if (clientId) whereClause.client_id = clientId;

    const meetings = await ScheduledMeeting.findAll({ where: whereClause });
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.scheduleMeeting = async (req, res) => {
  try {
    console.log("Authenticated user info:", req.user); // Debug log for user info

    const { trainer_id, meeting_date, start_time } = req.body;
    const client_id = req.user.id; // Extract client_id from authenticated user token

    // Validate required fields
    if (!trainer_id || !client_id || !meeting_date || !start_time) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Calculate end_time as 15 minutes after start_time
    const startDateTime = new Date(`${meeting_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + 15 * 60000);
    const end_time = endDateTime.toTimeString().split(" ")[0];

    // Log the incoming request data for debugging
    console.log("Scheduling meeting with data:", {
      trainer_id,
      client_id,
      meeting_date,
      start_time,
      end_time,
    });

    // Check trainer availability on the day of week
    const dayOfWeek = new Date(meeting_date).toLocaleString("en-US", {
      weekday: "long",
    });
    const availability = await TrainerAvailability.findOne({
      where: {
        trainer_id,
        day_of_week: dayOfWeek,
        start_time: { [Op.lte]: start_time },
        end_time: { [Op.gte]: end_time },
      },
    });

    if (!availability) {
    } else {
      return res.status(400).json({
        success: false,
        message: "Trainer is not available at this time",
      });
    }

    // Calculate 30-minute block end time for conflict check
    const blockEndDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    const block_end_time = blockEndDateTime.toTimeString().split(" ")[0];

    // Check if slot is already taken considering 30-minute block
    const conflictingMeeting = await ScheduledMeeting.findOne({
      where: {
        trainer_id,
        meeting_date,
        [Op.or]: [
          {
            start_time: { [Op.between]: [start_time, block_end_time] },
          },
          {
            end_time: { [Op.between]: [start_time, block_end_time] },
          },
          {
            start_time: { [Op.lte]: start_time },
            end_time: { [Op.gte]: block_end_time },
          },
        ],
        status: "scheduled",
      },
    });

    if (conflictingMeeting) {
      // Find the max end_time of conflicting meetings on the same date
      const conflictingMeetings = await ScheduledMeeting.findAll({
        where: {
          trainer_id,
          meeting_date,
          [Op.or]: [
            {
              start_time: { [Op.between]: [start_time, block_end_time] },
            },
            {
              end_time: { [Op.between]: [start_time, block_end_time] },
            },
            {
              start_time: { [Op.lte]: start_time },
              end_time: { [Op.gte]: block_end_time },
            },
          ],
          status: "scheduled",
        },
      });

      let maxEndTime = start_time;
      conflictingMeetings.forEach((meeting) => {
        if (meeting.end_time > maxEndTime) {
          maxEndTime = meeting.end_time;
        }
      });

      // Calculate next available time as maxEndTime + cooldown (15 minutes)
      const maxEndDateTime = new Date(`${meeting_date}T${maxEndTime}`);
      const nextAvailableDateTime = new Date(
        maxEndDateTime.getTime() + 15 * 60000
      );
      const nextAvailableTime = nextAvailableDateTime
        .toTimeString()
        .split(" ")[0];

      return res.status(400).json({
        success: false,
        message: `Time slot is already booked. Trainer will be available at ${nextAvailableTime}`,
        nextAvailableTime,
      });
    }

    // Create scheduled meeting with 15 minutes duration
    const meeting = await ScheduledMeeting.create({
      trainer_id,
      client_id,
      meeting_date,
      start_time,
      end_time,
      status: "scheduled",
    });

    // Create corresponding Channel entry for video call scheduling
    const channelName = `channel_${trainer_id}_${client_id}_${meeting_date}_${start_time.replace(
      /:/g,
      ""
    )}`;
    const scheduledAt = new Date(`${meeting_date}T${start_time}`);

    await Channel.create({
      channelName,
      participant1: client_id.toString(),
      participant2: trainer_id.toString(),
      scheduledAt,
      status: "scheduled",
    });

    // Start recording and transcription automatically when meeting is scheduled
    await startRecordingAndTranscription(meeting.id, channelName);

    // Log the created meeting for debugging
    console.log("Scheduled meeting created:", meeting);

    return res.status(201).json({
      success: true,
      message: `15 minutes call has been scheduled at ${start_time}`,
      meeting,
    });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// New endpoint to stop recording and transcription when meeting ends
exports.endMeeting = async (req, res) => {
  try {
    const { meeting_id, channel_name } = req.body;
    if (!meeting_id || !channel_name) {
      return res.status(400).json({
        success: false,
        message: "meeting_id and channel_name are required",
      });
    }

    await stopRecordingAndTranscription(meeting_id, channel_name);

    res.json({ success: true, message: "Meeting ended and recording saved" });
  } catch (error) {
    console.error("Error ending meeting:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// New: Save transcription data for a meeting
exports.saveTranscription = async (req, res) => {
  try {
    const { meeting_id, channel_name, transcription_text, summary_text } =
      req.body;

    if (!meeting_id || !channel_name) {
      return res.status(400).json({
        success: false,
        message: "meeting_id and channel_name are required",
      });
    }

    // Upsert transcription record
    let transcription = await Transcription.findOne({
      where: { meeting_id, channel_name },
    });

    if (transcription) {
      transcription.transcription_text =
        transcription_text || transcription.transcription_text;
      transcription.summary_text = summary_text || transcription.summary_text;
      await transcription.save();
    } else {
      transcription = await Transcription.create({
        meeting_id,
        channel_name,
        transcription_text,
        summary_text,
      });
    }

    res.json({ success: true, transcription });
  } catch (error) {
    console.error("Error saving transcription:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// New: Get transcription data for a meeting
exports.getTranscription = async (req, res) => {
  try {
    const { meeting_id } = req.params;
    if (!meeting_id) {
      return res.status(400).json({
        success: false,
        message: "meeting_id is required",
      });
    }

    const transcription = await Transcription.findOne({
      where: { meeting_id },
    });
    if (!transcription) {
      return res.status(404).json({
        success: false,
        message: "Transcription not found",
      });
    }

    res.json({ success: true, transcription });
  } catch (error) {
    console.error("Error fetching transcription:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.scheduleMeetingByTrainer = async (req, res) => {
  try {
    const trainer_id = req.user.id; // Extract trainer_id from authenticated user token
    const { client_id, meeting_date, start_time } = req.body;

    // Validate required fields
    if (!trainer_id || !client_id || !meeting_date || !start_time) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Calculate end_time as 15 minutes after start_time
    const startDateTime = new Date(`${meeting_date}T${start_time}`);
    const endDateTime = new Date(startDateTime.getTime() + 15 * 60000);
    const end_time = endDateTime.toTimeString().split(" ")[0];

    // Log the incoming request data for debugging
    console.log("Scheduling meeting by trainer with data:", {
      trainer_id,
      client_id,
      meeting_date,
      start_time,
      end_time,
    });

    // Check trainer availability on the day of week
    const dayOfWeek = new Date(meeting_date).toLocaleString("en-US", {
      weekday: "long",
    });
    const availability = await TrainerAvailability.findOne({
      where: {
        trainer_id,
        day_of_week: dayOfWeek,
        start_time: { [Op.lte]: start_time },
        end_time: { [Op.gte]: end_time },
      },
    });

    if (!availability) {
      // If no availability entry found, consider trainer available
      // So do not reject the request
    } else {
      return res.status(400).json({
        success: false,
        message: "Trainer is not available at this time",
      });
    }

    // Calculate 30-minute block end time for conflict check
    const blockEndDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    const block_end_time = blockEndDateTime.toTimeString().split(" ")[0];

    // Check if slot is already taken considering 30-minute block
    const conflictingMeeting = await ScheduledMeeting.findOne({
      where: {
        trainer_id,
        meeting_date,
        [Op.or]: [
          {
            start_time: { [Op.between]: [start_time, block_end_time] },
          },
          {
            end_time: { [Op.between]: [start_time, block_end_time] },
          },
          {
            start_time: { [Op.lte]: start_time },
            end_time: { [Op.gte]: block_end_time },
          },
        ],
        status: "scheduled",
      },
    });

    if (conflictingMeeting) {
      // Find the max end_time of conflicting meetings on the same date
      const conflictingMeetings = await ScheduledMeeting.findAll({
        where: {
          trainer_id,
          meeting_date,
          [Op.or]: [
            {
              start_time: { [Op.between]: [start_time, block_end_time] },
            },
            {
              end_time: { [Op.between]: [start_time, block_end_time] },
            },
            {
              start_time: { [Op.lte]: start_time },
              end_time: { [Op.gte]: block_end_time },
            },
          ],
          status: "scheduled",
        },
      });

      let maxEndTime = start_time;
      conflictingMeetings.forEach((meeting) => {
        if (meeting.end_time > maxEndTime) {
          maxEndTime = meeting.end_time;
        }
      });

      // Calculate next available time as maxEndTime + cooldown (15 minutes)
      const maxEndDateTime = new Date(`${meeting_date}T${maxEndTime}`);
      const nextAvailableDateTime = new Date(
        maxEndDateTime.getTime() + 15 * 60000
      );
      const nextAvailableTime = nextAvailableDateTime
        .toTimeString()
        .split(" ")[0];

      return res.status(400).json({
        success: false,
        message: `Time slot is already booked. Trainer will be available at ${nextAvailableTime}`,
        nextAvailableTime,
      });
    }

    // Create scheduled meeting with 15 minutes duration
    const meeting = await ScheduledMeeting.create({
      trainer_id,
      client_id,
      meeting_date,
      start_time,
      end_time,
      status: "scheduled",
    });

    // Create corresponding Channel entry for video call scheduling
    const channelName = `channel_${trainer_id}_${client_id}_${meeting_date}_${start_time.replace(
      /:/g,
      ""
    )}`;
    const scheduledAt = new Date(`${meeting_date}T${start_time}`);

    await Channel.create({
      channelName,
      participant1: client_id.toString(),
      participant2: trainer_id.toString(),
      scheduledAt,
      status: "scheduled",
    });

    // Start recording and transcription automatically when meeting is scheduled
    await startRecordingAndTranscription(meeting.id, channelName);

    // Log the created meeting for debugging
    console.log("Scheduled meeting created by trainer:", meeting);

    return res.status(201).json({
      success: true,
      message: `15 minutes call has been scheduled at ${start_time}`,
      meeting,
    });
  } catch (error) {
    console.error("Error scheduling meeting by trainer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
