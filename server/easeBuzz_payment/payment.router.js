const express = require("express");
const router = express.Router();
const {
  storeTransaction,
  initiateRefund,
  storeWebhook,
} = require("./controllers/Easebuzz.controller");

// Payment API

// Store transaction data
router.post("/transactions/store", storeTransaction);

// Store refund data
router.post("/refunds/store", initiateRefund);

// Store webhook data
router.post("/webhooks/store", storeWebhook);


// Get refund details by txnid
// router.get("/refunds/:txnid", EasebuzzRefundController.getRefundByTxnid);

// Get all refunds
// router.get("/refunds", EasebuzzRefundController.getAllRefunds);

module.exports = router;

