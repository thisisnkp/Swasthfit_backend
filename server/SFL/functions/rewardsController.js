const Reward = require("../models/Reward");

// Add a reward
exports.addReward = async (req, res) => {
  try {
    const {
      business_category,
      reward_type,
      min_purchase_amount,
      max_reward_coins,
      description,
      active,
    } = req.body;

    const reward = await Reward.create({
      business_category,
      reward_type,
      min_purchase_amount,
      max_reward_coins,
      description,
      active,
    });

    res.status(201).json({
      message: "Reward added successfully",
      reward,
    });
  } catch (error) {
    console.error("Error adding reward:", error);
    res.status(500).json({ message: "Error adding reward", error });
  }
};

// Update a reward
exports.updateReward = async (req, res) => {
  try {
    const { reward_id } = req.params;
    const {
      business_category,
      reward_type,
      min_purchase_amount,
      max_reward_coins,
      description,
      active,
    } = req.body;

    const reward = await Reward.findByPk(reward_id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    reward.business_category = business_category;
    reward.reward_type = reward_type;
    reward.min_purchase_amount = min_purchase_amount;
    reward.max_reward_coins = max_reward_coins;
    reward.description = description;
    reward.active = active;

    await reward.save();
    res.json({
      message: "Reward updated successfully",
      reward,
    });
  } catch (error) {
    console.error("Error updating reward:", error);
    res.status(500).json({ message: "Error updating reward", error });
  }
};
