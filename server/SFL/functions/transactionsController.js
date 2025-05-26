const Transaction = require("../models/coinTransaction");

exports.recordTransaction = async (req, res) => {
  try {
    const { user_id, type, amount, description } = req.body;

    // Validate required fields
    if (!user_id || !type || !amount) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "type", "amount"],
      });
    }

    // Validate transaction type
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type",
        allowed: ["credit", "debit"],
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const transaction = await Transaction.create({
      user_id,
      type,
      amount,
      description,
      date: new Date(),
    });

    res.status(201).json({
      message: "Transaction recorded successfully",
      transaction,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({
      message: "Error recording transaction",
      error: error.message,
    });
  }
};
