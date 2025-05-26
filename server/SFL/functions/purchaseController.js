const Transaction = require("../models/coinTransaction");
const CoinCalculator = require("../services/coinCalculator");
const UserSubscription = require("../models/UserSubscription");
const { Op } = require("sequelize");

exports.recordPurchase = async (req, res) => {
  try {
    const { user_id, business_category, purchase_amount, transaction_id } =
      req.body;

    // Validate required fields
    if (!user_id || !business_category || !purchase_amount) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "business_category", "purchase_amount"],
      });
    }

    // Calculate base reward based on business category
    const baseReward = CoinCalculator.calculateBusinessCategoryReward(
      business_category,
      purchase_amount
    );

    // Check if user has an active subscription for additional multiplier
    const today = new Date().toISOString().split("T")[0];
    const subscription = await UserSubscription.findOne({
      where: {
        user_id,
        is_active: true,
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
      },
    });

    // Apply subscription multiplier if applicable
    let finalReward = baseReward;
    if (subscription) {
      finalReward = CoinCalculator.calculateSubscriptionBonus(
        subscription.subscription_type,
        baseReward
      );
    }

    // Record the transaction
    const transaction = await Transaction.create({
      user_id,
      type: "credit",
      amount: finalReward,
      description: `Purchase reward for ${business_category} (${
        transaction_id || "N/A"
      })`,
      date: new Date(),
    });

    // Return the result
    res.status(201).json({
      message: "Purchase reward recorded successfully",
      business_category,
      purchase_amount,
      base_reward: baseReward,
      subscription: subscription ? subscription.subscription_type : null,
      multiplier: subscription ? subscription.multiplier : 1,
      final_reward: finalReward,
      transaction,
    });
  } catch (error) {
    console.error("Error recording purchase reward:", error);
    res.status(500).json({
      message: "Error recording purchase reward",
      error: error.message,
    });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing user_id parameter",
      });
    }

    // Get purchase-related transactions
    const transactions = await Transaction.findAll({
      where: {
        user_id,
        description: {
          [Op.like]: "Purchase reward for %",
        },
      },
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({
      message: "Error fetching purchase history",
      error: error.message,
    });
  }
};
