const AllTransactions = require("./allTransactions.model");
const Trainer = require("../../models/trainer")(
  require("../../sequelize"),
  require("sequelize").DataTypes
);

async function createTransaction(req, res) {
  try {
    const {
      vendor_id,
      vendor_type,
      transaction_type,
      for: paymentFor,
    } = req.body;

    // Extract 'from' from authenticated user token details
    const from = req.user
      ? req.user.id || req.user.username || "unknown"
      : "unknown";

    // Validate required fields
    if (!vendor_id || !vendor_type || !transaction_type || !paymentFor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate vendor_type
    if (vendor_type !== "gym" && vendor_type !== "trainer") {
      return res.status(400).json({ error: "Invalid vendor_type" });
    }

    // Validate transaction_type
    if (transaction_type !== "pay in" && transaction_type !== "pay out") {
      return res.status(400).json({ error: "Invalid transaction_type" });
    }

    // If vendor_type is trainer, verify vendor_id exists in Trainer table
    if (vendor_type === "trainer") {
      const trainer = await Trainer.findByPk(vendor_id, { attributes: ["id"] });
      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }
    }

    // Create the transaction record
    const transaction = await AllTransactions.create({
      vendor_id,
      vendor_type,
      transaction_type,
      from,
      for: paymentFor,
    });

    return res
      .status(201)
      .json({ message: "Transaction created", transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getTransactions(req, res) {
  try {
    const { vendor_id, vendor_type } = req.query;

    const whereClause = {};
    if (vendor_id) {
      whereClause.vendor_id = vendor_id;
    }
    if (vendor_type) {
      whereClause.vendor_type = vendor_type;
    }

    const transactions = await AllTransactions.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createTransaction,
  getTransactions,
};
