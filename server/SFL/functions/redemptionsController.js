const Redemption = require("../models/Redemption");
const Reward = require("../models/Reward");
const CoinCalculator = require("../services/coinCalculator");

exports.redeem = async (req, res) => {
  try {
    const {
      user_id,
      reward_id,
      purchase_amount,
      business_category,
      description,
    } = req.body;

    // Find the reward
    const reward = await Reward.findByPk(reward_id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    // Validate minimum purchase amount
    if (purchase_amount < reward.min_purchase_amount) {
      return res.status(400).json({
        message: "Purchase amount does not meet minimum requirement",
        min_required: reward.min_purchase_amount,
      });
    }

    // Calculate coins earned
    const coins_earned = CoinCalculator.calculatePurchaseReward(
      reward.reward_type,
      purchase_amount
    );

    // Cap rewards at max_reward_coins if specified
    const final_coins = Math.min(coins_earned, reward.max_reward_coins);

    // Create redemption record
    const redemption = await Redemption.create({
      user_id,
      reward_id,
      purchase_amount,
      coins_earned: final_coins,
      business_category,
      description,
      date: new Date(),
    });

    res.status(201).json({
      message: "Redemption processed successfully",
      redemption,
      coins_earned: final_coins,
    });
  } catch (error) {
    console.error("Redemption error:", error);
    res
      .status(500)
      .json({ message: "Error processing redemption", error: error.message });
  }
};
