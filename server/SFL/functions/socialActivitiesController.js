const SocialActivity = require("../models/SocialActivity");
const UserStreak = require("../models/UserStreak");
const Transaction = require("../models/coinTransaction");
const CoinCalculator = require("../services/coinCalculator");

exports.recordSocialActivity = async (req, res) => {
  try {
    const { user_id, activity_type, content_id, product_id, purchase_value } =
      req.body;

    // Validate required fields
    if (!user_id || !activity_type) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "activity_type"],
      });
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Count today's activities of this type
    const todayActivities = await SocialActivity.count({
      where: {
        user_id,
        activity_type,
        date: today,
      },
    });

    // Calculate coins based on activity type and count
    let coins_earned = CoinCalculator.calculateSocialReward(
      activity_type,
      todayActivities + 1
    );

    // For product shares with purchases
    if (activity_type === "product_share" && purchase_value) {
      coins_earned = Math.floor(purchase_value * 0.05); // 5% of purchase value
    }

    // Create social activity record
    const socialActivity = await SocialActivity.create({
      user_id,
      activity_type,
      content_id,
      product_id,
      purchase_value,
      coins_earned,
      date: today,
    });

    // Record transaction
    await Transaction.create({
      user_id,
      type: "credit",
      amount: coins_earned,
      description: `Reward for ${activity_type} activity`,
      date: new Date(),
    });

    // Update social streak
    await updateSocialStreak(user_id, today);

    res.status(201).json({
      message: "Social activity recorded successfully",
      activity: socialActivity,
      coins_earned,
    });
  } catch (error) {
    console.error("Error recording social activity:", error);
    res.status(500).json({
      message: "Error recording social activity",
      error: error.message,
    });
  }
};

// Helper function to update social streak
async function updateSocialStreak(user_id, today) {
  try {
    // Find existing streak or create new one
    // Using a fixed activity_id for social activities
    const SOCIAL_ACTIVITY_ID = 10; // Assuming 10 is reserved for social activities

    let streak = await UserStreak.findOne({
      where: { user_id, activity_id: SOCIAL_ACTIVITY_ID },
    });

    if (!streak) {
      // Create new streak record
      streak = await UserStreak.create({
        user_id,
        activity_id: SOCIAL_ACTIVITY_ID,
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
    console.error("Error updating social streak:", error);
  }
}

exports.recordReferral = async (req, res) => {
  try {
    const { referrer_id, referred_id } = req.body;

    // Validate required fields
    if (!referrer_id || !referred_id) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["referrer_id", "referred_id"],
      });
    }

    // Calculate referral reward
    const coins_earned = 2000;

    // Record social activity
    const socialActivity = await SocialActivity.create({
      user_id: referrer_id,
      activity_type: "referral",
      content_id: referred_id,
      coins_earned,
      date: new Date().toISOString().split("T")[0],
    });

    // Record transaction
    await Transaction.create({
      user_id: referrer_id,
      type: "credit",
      amount: coins_earned,
      description: "Referral reward",
      date: new Date(),
    });

    res.status(201).json({
      message: "Referral recorded successfully",
      activity: socialActivity,
      coins_earned,
    });
  } catch (error) {
    console.error("Error recording referral:", error);
    res.status(500).json({
      message: "Error recording referral",
      error: error.message,
    });
  }
};

exports.recordProductShare = async (req, res) => {
  try {
    const { user_id, product_id, purchase_value, purchaser_id } = req.body;

    // Validate required fields
    if (!user_id || !product_id || !purchase_value) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "product_id", "purchase_value"],
      });
    }

    // Calculate 5% of purchase value
    const coins_earned = Math.floor(purchase_value * 0.05);

    // Record social activity
    const socialActivity = await SocialActivity.create({
      user_id,
      activity_type: "product_share",
      content_id: purchaser_id,
      product_id,
      purchase_value,
      coins_earned,
      date: new Date().toISOString().split("T")[0],
    });

    // Record transaction
    await Transaction.create({
      user_id,
      type: "credit",
      amount: coins_earned,
      description: `Product share reward for purchase of ₹${purchase_value}`,
      date: new Date(),
    });

    res.status(201).json({
      message: "Product share reward recorded successfully",
      activity: socialActivity,
      coins_earned,
    });
  } catch (error) {
    console.error("Error recording product share reward:", error);
    res.status(500).json({
      message: "Error recording product share reward",
      error: error.message,
    });
  }
};
