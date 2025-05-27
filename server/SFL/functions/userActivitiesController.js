// controllers/userActivitiesController.js
const UserActivity = require("../models/UserActivities");
const UserStreak = require("../models/UserStreak");

// Log a user activity
exports.logActivity = async (req, res) => {
  try {
    const { user_id, activity_id, value, coins_earned } = req.body;

    // Validate required fields
    if (!user_id || !activity_id || !coins_earned) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "activity_id", "coins_earned"],
      });
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Create activity record
    const userActivity = await UserActivity.create({
      user_id,
      activity_id,
      value: value || 0,
      date: today,
      coins_earned,
    });

    // Update user streak
    await updateUserStreak(user_id, activity_id, today);

    res.status(201).json({
      message: "Activity logged successfully",
      userActivity,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res
      .status(500)
      .json({ message: "Error logging activity", error: error.message });
  }
};

// Helper function to update user streak
async function updateUserStreak(user_id, activity_id, today) {
  try {
    // Find existing streak or create new one
    let streak = await UserStreak.findOne({
      where: { user_id, activity_id },
    });

    if (!streak) {
      // Create new streak record
      streak = await UserStreak.create({
        user_id,
        activity_id,
        current_streak: 1,
        last_activity_date: today,
      });
      return;
    }

    // Calculate days since last activity
    const lastDate = new Date(streak.last_activity_date);
    const currentDate = new Date(today);
    const dayDifference = Math.floor(
      (currentDate - lastDate) / (1000 * 60 * 60 * 24)
    );

    // Update streak based on day difference
    if (dayDifference === 1) {
      // Consecutive day, increment streak
      streak.current_streak += 1;
    } else if (dayDifference > 1) {
      // Streak broken, reset to 1
      streak.current_streak = 1;
    }
    // If dayDifference is 0 (same day), don't change the streak

    // Update last activity date
    streak.last_activity_date = today;
    await streak.save();
  } catch (error) {
    console.error("Error updating streak:", error);
    // Don't throw error to prevent activity logging failure
  }
}
