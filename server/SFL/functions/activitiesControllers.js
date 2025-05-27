// controllers/activitiesController.js
const Activity = require("../models/Activities");
const UserActivity = require("../models/UserActivities");
const UserStreak = require("../models/UserStreak");
const Transaction = require("../models/coinTransaction");
const PurchaseReward = require("../models/PurchaseReward");

const CoinCalculator = require("../services/coinCalculator");
const { Op } = require("sequelize");
const UserSubscription = require("../models/UserSubscription");

// Initialize health activities (run once)
const initHealthActivities = async (req, res) => {
  try {
    const activities = [
      {
        name: "Steps Count",
        base_coin_value: 100,
        daily_target: 6000,
        streak_bonuses: { 3: 100, 7: 300, 15: 900, 30: 2000 },
        category: "fitness",
      },
      {
        name: "Calorie Target",
        base_coin_value: 150,
        daily_target: 2000,
        streak_bonuses: { 3: 150, 7: 600, 15: 1300, 30: 2500 },
        category: "fitness",
      },
      {
        name: "Food Scan",
        base_coin_value: 20,
        max_daily_scans: 8,
        scan_rewards: { first_4: 25, after_4: 5, after_8: 1 },
        streak_bonuses: { 3: 100, 7: 300, 15: 800, 30: 2000 },
        category: "nutrition",
      },
      {
        name: "Body Scan",
        base_coin_value: 20,
        max_daily_scans: 8,
        scan_rewards: { first_4: 25, after_4: 5, after_8: 1 },
        streak_bonuses: { 3: 100, 7: 300, 15: 800, 30: 2000 },
        category: "fitness",
      },
      {
        name: "Face Scan",
        base_coin_value: 20,
        max_daily_scans: 8,
        scan_rewards: { first_4: 25, after_4: 5, after_8: 1 },
        streak_bonuses: { 3: 100, 7: 300, 15: 800, 30: 2000 },
        category: "wellness",
      },
      {
        name: "Posture Analysis",
        base_coin_value: 20,
        max_daily_scans: 8,
        scan_rewards: { first_4: 25, after_4: 5, after_8: 1 },
        streak_bonuses: { 3: 100, 7: 300, 15: 800, 30: 2000 },
        category: "fitness",
      },
      {
        name: "Activity Scan",
        base_coin_value: 20,
        max_daily_scans: 8,
        scan_rewards: { first_4: 25, after_4: 5, after_8: 1 },
        streak_bonuses: { 3: 100, 7: 300, 15: 800, 30: 2000 },
        category: "fitness",
      },
      {
        name: "Sleep Well-Being",
        base_coin_value: 100,
        streak_bonuses: { 3: 200, 7: 600, 15: 1000, 30: 2500 },
        category: "wellness",
      },
      {
        name: "Daily Goals",
        base_coin_value: 100,
        sleep_quality_rewards: { Good: 100, Okay: 80, "Not Good": 60 },
        streak_bonuses: { 3: 200, 7: 600, 15: 1400, 30: 2500 },
        category: "wellness",
      },
      {
        name: "Social",
        base_coin_value: 0,
        streak_bonuses: { 3: 100, 7: 300, 15: 700, 30: 1500 },
        category: "engagement",
      },
    ];

    await Activity.bulkCreate(activities, {
      updateOnDuplicate: [
        "base_coin_value",
        "daily_target",
        "streak_bonuses",
        "category",
        "scan_rewards",
        "sleep_quality_rewards",
      ],
    });

    res.status(201).json({
      message: "Health activities initialized successfully",
      count: activities.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error initializing activities",
      error: error.message,
    });
  }
};

const logHealthActivity = async (req, res) => {
  try {
    const { user_id, activity_name, value, sleep_quality } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const activity = await Activity.findOne({ where: { name: activity_name } });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // 🛑 Check if already logged today
    const alreadyLogged = await UserActivity.findOne({
      where: {
        user_id,
        activity_id: activity.id,
        date: today,
      },
    });

    if (alreadyLogged) {
      return res.status(409).json({
        message: "Activity already logged for today",
        activity: alreadyLogged,
      });
    }

    let todayScans = 0;
    if (activity.name.includes("Scan")) {
      todayScans = await UserActivity.count({
        where: {
          user_id,
          activity_id: activity.id,
          date: today,
        },
      });
    }

    let coinsEarned = CoinCalculator.calculateActivityCoins(
      activity,
      value,
      todayScans,
      sleep_quality
    );

    const streak = await updateStreak(user_id, activity.id);
    const streakBonus = CoinCalculator.calculateStreakBonus(
      activity,
      streak.current_streak
    );
    coinsEarned += streakBonus;

    const subscription = await UserSubscription.findOne({
      where: {
        user_id,
        is_active: true,
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
      },
    });

    let finalCoins = coinsEarned;
    let subscriptionType = null;
    let multiplier = 1;

    if (subscription) {
      subscriptionType = subscription.subscription_type;
      multiplier = subscription.multiplier;
      finalCoins = CoinCalculator.calculateSubscriptionBonus(
        subscriptionType,
        coinsEarned
      );
    }

    const [userActivity] = await Promise.all([
      UserActivity.create({
        user_id,
        activity_id: activity.id,
        value,
        date: today,
        achieved_target: value >= (activity.daily_target || 0),
        coins_earned: finalCoins,
      }),
      Transaction.create({
        user_id,
        type: "credit",
        amount: finalCoins,
        description: `${activity.name} reward${
          subscription ? " (with subscription bonus)" : ""
        }`,
      }),
    ]);

    res.status(201).json({
      activity: userActivity,
      streak: streak.current_streak,
      streak_bonus: streakBonus,
      base_coins: coinsEarned,
      subscription: subscriptionType,
      multiplier,
      total_coins: finalCoins,
    });
  } catch (error) {
    console.error("Activity logging error:", error);
    res.status(500).json({
      message: "Error logging activity",
      error: error.message,
    });
  }
};

const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await UserActivity.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Activity,
          as: "activity",
          attributes: ["name", "category", "base_coin_value"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    res.json(activities);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

const addActivity = async (req, res) => {
  try {
    const {
      name,
      base_coin_value,
      daily_target,
      streak_bonuses,
      category,
      scan_rewards,
    } = req.body;

    const activity = await Activity.create({
      name,
      base_coin_value,
      daily_target,
      streak_bonuses,
      category,
      scan_rewards,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { activity_id } = req.params;
    const updates = req.body;

    const [updated] = await Activity.update(updates, {
      where: { id: activity_id },
    });

    if (updated) {
      const updatedActivity = await Activity.findByPk(activity_id);
      res.status(200).json(updatedActivity);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const initPurchaseRewards = async (req, res) => {
  try {
    const rewards = [
      { business_category: "E-Commerce", reward_type: "double" },
      { business_category: "Food Order", reward_type: "double" },
      { business_category: "Travel Booking", reward_type: "double" },
      { business_category: "Insurance", reward_type: "double" },
      { business_category: "Blood Test", reward_type: "double" },
      { business_category: "Subscription", reward_type: "triple" },
    ];

    await PurchaseReward.bulkCreate(rewards, {
      updateOnDuplicate: ["reward_type"],
    });

    res.status(201).json({
      message: "Purchase rewards initialized successfully",
      count: rewards.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error initializing purchase rewards",
      error: error.message,
    });
  }
};

const calculatePurchaseReward = async (req, res) => {
  try {
    const { user_id, business_category, purchase_amount } = req.body;

    const reward = await PurchaseReward.findOne({
      where: { business_category },
    });

    if (!reward) {
      return res.status(404).json({ message: "Reward category not found" });
    }

    const coinsEarned = CoinCalculator.calculatePurchaseReward(
      reward.reward_type,
      purchase_amount
    );

    await Transaction.create({
      user_id,
      type: "credit",
      amount: coinsEarned,
      description: `Purchase reward for ${business_category}`,
    });

    res.status(200).json({
      coins_earned: coinsEarned,
      business_category,
      reward_type: reward.reward_type,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating purchase reward",
      error: error.message,
    });
  }
};

async function updateStreak(userId, activityId) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const [streak] = await UserStreak.findOrCreate({
    where: { user_id: userId, activity_id: activityId },
    defaults: {
      current_streak: 1,
      last_activity_date: today,
    },
  });

  if (streak.last_activity_date === today) {
    return streak;
  }

  if (streak.last_activity_date === yesterday) {
    streak.current_streak += 1;
  } else {
    streak.current_streak = 1;
  }

  streak.last_activity_date = today;
  await streak.save();
  return streak;
}

module.exports = {
  initHealthActivities,
  logHealthActivity,
  getUserActivities,
  addActivity,
  updateActivity,
  initPurchaseRewards,
  calculatePurchaseReward,
  updateStreak,
};
