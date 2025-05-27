const EasebuzzTransaction = require("../model/easebuzz_trans.model");
const EasebuzzRefund = require("../model/easebuzz_refund.model");
const EasebuzzWebhook = require("../model/easebuzz_webhook.model");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT;
const TRANSACTION_API_URL = process.env.TRANSACTION_API_URL;
const REFUND_API_URL = process.env.REFUND_API_URL;
const WEBHOOK_API_URL = process.env.WEBHOOK_API_URL;
/**
 * 🔹 Generate SHA512 Hash for Secure Transactions
 */
const generateHash = (dataString) => {
  return crypto.createHash("sha512").update(dataString).digest("hex");
};

/**
 * 🔹 Store Transaction Data from Easebuzz
 */
exports.storeTransaction = async (req, res) => {
  try {
    const {
      user_id,
      txnid,
      amount,
      firstname,
      email,
      phone,
      merchant_key,
      mode,
      status,
      bank_ref_num,
      easepayid,
    } = req.body;

    // Check if transaction already exists
    const existingTransaction = await EasebuzzTransaction.findOne({
      where: { txnid },
    });
    if (existingTransaction) {
      return res.status(400).json({ message: "Transaction already exists" });
    }

    // Store transaction in DB
    const transaction = await EasebuzzTransaction.create({
      user_id,
      txnid,
      amount,
      firstname,
      email,
      phone,
      merchant_key,
      mode,
      transaction_status: status,
      bank_ref_num,
      easepayid,
    });

    return res
      .status(201)
      .json({ message: "Transaction stored successfully", transaction });
  } catch (error) {
    console.error("Error storing transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.initiateRefund = async (req, res) => {
  try {
    const { txnid, refund_txnid, refund_amount, refund_reason } = req.body;

    return res
      .status(201)
      .json({ message: "Refund stored successfully", refund });
  } catch (error) {
    console.error("Error storing refund:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.initiateRefund = async (req, res) => {
  try {
    const {  txnid, refund_txnid, refund_amount, refund_reason } =
      req.body;

    // Check if transaction exists
    const transaction = await EasebuzzTransaction.findOne({ where: { txnid } });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if refund already exists
    const existingRefund = await EasebuzzRefund.findOne({
      where: { refund_txnid },
    });
    if (existingRefund) {
      return res.status(400).json({ message: "Refund already recorded" });
    }

    // Generate Hash: key|txnid|refund_amount|salt
    const hashString = `${EASEBUZZ_KEY}|${txnid}|${refund_amount}|${EASEBUZZ_SALT}`;
    const hash = generateHash(hashString);

    // Call Easebuzz Refund API
    const response = await axios.post(
      REFUND_API_URL,
      new URLSearchParams({
        key: EASEBUZZ_KEY,
        // user_id,
        txnid,
        refund_amount,
        refund_reason,
        hash,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Store refund in DB
    const refund = await EasebuzzRefund.create({
      // user_id,
      txnid,
      refund_txnid,
      refund_amount,
      refund_reason,
      refund_status: "pending",
    });

    return res
      .status(201)
      .json({
        message: "Refund initiated",
        refund,
        apiResponse: response.data,
      });
  } catch (error) {
    console.error("Error initiating refund:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.storeWebhook = async (req, res) => {
  try {
    const { txnid, event_type, webhook_data } = req.body;

    // Store webhook data in DB
    const webhook = await EasebuzzWebhook.create({
      txnid,
      event_type,
      webhook_data: JSON.stringify(webhook_data),
    });

    return res
      .status(201)
      .json({ message: "Webhook stored successfully", webhook });
  } catch (error) {
    console.error("Error storing webhook:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.getRefundByTxnid = async (req, res) => {
//   try {
//     const { txnid } = req.params;

//     // Fetch refund details
//     const refund = await EasebuzzRefund.findOne({ where: { txnid } });

//     if (!refund) {
//       return res.status(404).json({ message: "Refund not found" });
//     }

//     return res.status(200).json({ message: "Refund retrieved successfully", refund });
//   } catch (error) {
//     console.error("Error fetching refund details:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /**
//  * 🔹 3. Get All Refunds
//  */
// exports.getAllRefunds = async (req, res) => {
//   try {
//     const refunds = await EasebuzzRefund.findAll();
//     return res.status(200).json({ message: "All refunds retrieved successfully", refunds });
//   } catch (error) {
//     console.error("Error fetching all refunds:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
