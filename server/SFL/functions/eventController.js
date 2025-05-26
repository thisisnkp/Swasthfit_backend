const Event = require("../models/Event");
const UserActivity = require("../models/UserActivities");
const Transaction = require("../models/coinTransaction");
const { Op } = require("sequelize");

// Function to create events
exports.createEvent = async (req, res) => {
  try {
    const { event_type, event_name, target_days, target_achievement, coins } =
      req.body;

    // Validate required fields
    if (
      !event_type ||
      !event_name ||
      !target_days ||
      !target_achievement ||
      !coins
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "event_type",
          "event_name",
          "target_days",
          "target_achievement",
          "coins",
        ],
      });
    }

    // Create the event
    const event = await Event.create({
      event_type,
      event_name,
      target_days,
      target_achievement,
      coins,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();

    res.status(200).json({
      message: "Events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({
      message: "Error retrieving events",
      error: error.message,
    });
  }
};

// Function to send event and check if user qualifies for rewards
exports.sendEvent = async (req, res) => {
  try {
    const { user_id, event_type } = req.body;

    // Validate required fields
    if (!user_id || !event_type) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "event_type"],
      });
    }

    // Find events of the specified type
    const events = await Event.findAll({
      where: { event_type },
    });

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found for the specified type",
      });
    }

    // Get today's date
    const today = new Date();

    // Process each event
    const results = await Promise.all(
      events.map(async (event) => {
        // Calculate the date range for the target days
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - event.target_days);
        const startDateStr = startDate.toISOString().split("T")[0];
        const todayStr = today.toISOString().split("T")[0];

        // Get user activities within the date range
        const userActivities = await UserActivity.findAll({
          where: {
            user_id,
            date: {
              [Op.between]: [startDateStr, todayStr],
            },
          },
        });

        // Calculate total achievement (e.g., steps, calories)
        const totalAchievement = userActivities.reduce(
          (sum, activity) => sum + (activity.value || 0),
          0
        );

        // Check if user qualifies for the event reward
        const qualifies = totalAchievement >= event.target_achievement;

        if (qualifies) {
          // Record the transaction for the reward
          await Transaction.create({
            user_id,
            type: "credit",
            amount: event.coins,
            description: `Reward for completing ${event.event_name}`,
            date: new Date(),
          });

          return {
            event_name: event.event_name,
            qualified: true,
            coins_earned: event.coins,
            total_achievement: totalAchievement,
            target_achievement: event.target_achievement,
          };
        }

        return {
          event_name: event.event_name,
          qualified: false,
          total_achievement: totalAchievement,
          target_achievement: event.target_achievement,
        };
      })
    );

    res.status(200).json({
      message: "Event processing completed",
      results,
    });
  } catch (error) {
    console.error("Error processing event:", error);
    res.status(500).json({
      message: "Error processing event",
      error: error.message,
    });
  }
};
