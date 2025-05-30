const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
} = require("./allTransactions.controller");
const authenticateJWT = require("../../authenticateJWT");

// Route to create a new transaction with authentication
router.post("/all-transactions", authenticateJWT, createTransaction);

// Route to get transactions with optional filters and authentication
router.get("/all-transactions", authenticateJWT, getTransactions);

module.exports = router;
