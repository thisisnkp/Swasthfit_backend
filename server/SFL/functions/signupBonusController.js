const Transaction = require("../models/coinTransaction");

exports.awardSignupBonus = async (req, res) => {
  try {
    const { user_id, acquisition_mode } = req.body;

    if (!user_id || !acquisition_mode) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "acquisition_mode"],
      });
    }

    // Define bonus amounts based on acquisition mode
    const bonusAmounts = {
      "B2B: Corporate": 12000,
      "B2B: Fitness Freelancers": 10000,
      "B2B: Gym": 10000,
      "B2C: Self or via Swasthfit": 8000,
    };

    // Get bonus amount based on acquisition mode
    const bonusAmount = bonusAmounts[acquisition_mode] || 8000; // Default to B2C amount

    // Record transaction
    const transaction = await Transaction.create({
      user_id,
      type: "credit",
      amount: bonusAmount,
      description: `Signup bonus (${acquisition_mode})`,
      date: new Date(),
    });

    res.status(201).json({
      message: "Signup bonus awarded successfully",
      user_id,
      acquisition_mode,
      bonus_amount: bonusAmount,
      transaction,
    });
  } catch (error) {
    console.error("Error awarding signup bonus:", error);
    res.status(500).json({
      message: "Error awarding signup bonus",
      error: error.message,
    });
  }
};

// For B2B: Corporate custom bonus
exports.awardCustomCorporateBonus = async (req, res) => {
  try {
    const { user_id, bonus_amount, performance_note } = req.body;

    if (!user_id || !bonus_amount || bonus_amount < 0 || bonus_amount > 10000) {
      return res.status(400).json({
        message: "Invalid parameters",
        required: ["user_id", "bonus_amount (0-10000)"],
      });
    }

    // Record transaction
    const transaction = await Transaction.create({
      user_id,
      type: "credit",
      amount: bonus_amount,
      description: `Corporate performance bonus: ${
        performance_note || "Monthly allocation"
      }`,
      date: new Date(),
    });

    res.status(201).json({
      message: "Corporate bonus awarded successfully",
      user_id,
      bonus_amount,
      performance_note,
      transaction,
    });
  } catch (error) {
    console.error("Error awarding corporate bonus:", error);
    res.status(500).json({
      message: "Error awarding corporate bonus",
      error: error.message,
    });
  }
};
