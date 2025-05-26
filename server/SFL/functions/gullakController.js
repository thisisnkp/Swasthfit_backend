const Gullak = require("../models/gullak");
const Transaction = require("../models/coinTransaction");
const { Op } = require("sequelize");

// Get user's Gullak balance
exports.getGullakBalance = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing user_id parameter",
      });
    }

    // Find or create user's Gullak
    const [gullak, created] = await Gullak.findOrCreate({
      where: { user_id },
      defaults: {
        amount: 0,
        total_saved: 0,
      },
    });

    res.status(200).json({
      user_id,
      current_balance: gullak.amount,
      total_saved: gullak.total_saved,
      created_now: created,
    });
  } catch (error) {
    console.error("Error fetching Gullak balance:", error);
    res.status(500).json({
      message: "Error fetching Gullak balance",
      error: error.message,
    });
  }
};

// ... existing code ...

// Get user's Gullak balance with additional information for dashboard
exports.getGullakBalanceForDashboard = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing user_id parameter",
      });
    }

    // Find or create user's Gullak
    const [gullak, created] = await Gullak.findOrCreate({
      where: { user_id },
      defaults: {
        amount: 0,
        total_saved: 0,
      },
    });

    // Get recent transactions for context
    const recentTransactions = await Transaction.findAll({
      where: {
        user_id,
        description: {
          [Op.like]: "%Gullak%",
        },
      },
      order: [["date", "DESC"]],
      limit: 3,
    });

    res.status(200).json({
      user_id,
      current_balance: gullak.amount,
      total_saved: gullak.total_saved,
      coin_value_in_rupees: parseFloat(gullak.amount) / 10, // Assuming 10 coins = 1 rupee
      recent_transactions: recentTransactions,
      can_redeem: parseFloat(gullak.amount) > 0,
      last_updated: gullak.last_updated,
    });
  } catch (error) {
    console.error("Error fetching Gullak balance for dashboard:", error);
    res.status(500).json({
      message: "Error fetching Gullak balance",
      error: error.message,
    });
  }
};

// ... existing code ...

// Add amount to Gullak
exports.addToGullak = async (req, res) => {
  try {
    const { user_id, amount, description } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid parameters",
        required: ["user_id", "amount (positive number)"],
      });
    }

    // Find or create user's Gullak
    const [gullak, created] = await Gullak.findOrCreate({
      where: { user_id },
      defaults: {
        amount: 0,
        total_saved: 0,
      },
    });

    // Update Gullak
    const newAmount = parseFloat(gullak.amount) + parseFloat(amount);
    const newTotalSaved = parseFloat(gullak.total_saved) + parseFloat(amount);

    await gullak.update({
      amount: newAmount,
      total_saved: newTotalSaved,
      last_updated: new Date(),
    });

    // Record transaction
    await Transaction.create({
      user_id,
      type: "credit",
      amount,
      description: description || "Added to Gullak savings",
      date: new Date(),
    });

    res.status(200).json({
      message: "Amount added to Gullak successfully",
      user_id,
      amount_added: amount,
      new_balance: newAmount,
      total_saved: newTotalSaved,
    });
  } catch (error) {
    console.error("Error adding to Gullak:", error);
    res.status(500).json({
      message: "Error adding to Gullak",
      error: error.message,
    });
  }
};

// Use amount from Gullak
exports.useFromGullak = async (req, res) => {
  try {
    const { user_id, amount, description } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid parameters",
        required: ["user_id", "amount (positive number)"],
      });
    }

    // Find user's Gullak
    const gullak = await Gullak.findOne({
      where: { user_id },
    });

    if (!gullak) {
      return res.status(404).json({
        message: "Gullak not found for this user",
      });
    }

    // Check if sufficient balance
    if (parseFloat(gullak.amount) < parseFloat(amount)) {
      return res.status(400).json({
        message: "Insufficient Gullak balance",
        requested: amount,
        available: gullak.amount,
      });
    }

    // Update Gullak
    const newAmount = parseFloat(gullak.amount) - parseFloat(amount);

    await gullak.update({
      amount: newAmount,
      last_updated: new Date(),
    });

    // Record transaction
    await Transaction.create({
      user_id,
      type: "debit",
      amount,
      description: description || "Used from Gullak savings",
      date: new Date(),
    });

    res.status(200).json({
      message: "Amount used from Gullak successfully",
      user_id,
      amount_used: amount,
      new_balance: newAmount,
    });
  } catch (error) {
    console.error("Error using from Gullak:", error);
    res.status(500).json({
      message: "Error using from Gullak",
      error: error.message,
    });
  }
};
