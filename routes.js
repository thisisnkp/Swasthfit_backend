/**
 *
 * @swagger
 *
 */

const express = require("express");
const router = express.Router();
const path = require("path");

/**
 * Application Route Configuration
 * -------------------------------
 * This file organizes routes by modules for better maintainability
 * and scalability of the application.
 *
 * Purpose:
 * - Define and group all API or web routes related to specific modules.
 * - Ensure clean separation of concerns by organizing routes logically.
 *
 * Guidelines:
 * - Each module should have its own set of routes.
 * - Follow RESTful conventions wherever possible.
 * - Update this file whenever new routes or modules are added.
 *
 * Author: Neeraj Krishna
 * Last Updated: 2024-12-19
 *
 * Example:
 * - Module: User
 *   Endpoint: GET /api/users
 *   Description: Fetches a list of all users.
 */

//const path = require("path");

router.get("/", (req, res) => {
  // Update the path to your actual 'home.html' file
  const filePath = path.join(__dirname, "home.html");

  // Serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res
        .status(err.status || 500)
        .send("An error occurred while serving the file.");
    }
  });
});

// Admin Routes
const AdminRoute = require("./server/admin/admin.route");
router.use("/admin/site/apis", AdminRoute);

// Mutual Fund Routes
const mutualRoute = require("./server/mutual-fund/mutual.route");
router.use("/mutual-fund/site/apis", mutualRoute);

// Food Routes
const foodRoute = require("./server/food/food.route");
router.use("/food/site/apis", foodRoute);

// TODO: Add these routes once the corresponding route files are ready
const userRoute = require("./server/user/user.route");
router.use("/user/site/apis", userRoute);

const gymRoute = require("./server/gym/gym.route");
router.use("/gym/site/apis", gymRoute);

// const gymRoute = require("./server/gym/gym.route");
const gymAboutRoute = require("./server/gym/gym.route");
router.use("/gym/site/apis", gymAboutRoute);

// const gymRoutes = require("./routes/gym.route");
// Marketing Suite
const marketingRoute = require("./server/marketing/market.route");
router.use("/marketing/site/apis", marketingRoute);

// insurance routes
const insuranceRoutes = require("./server/getData/insurance_dekho/insurance.route");
router.use("/insurance/site/apis", insuranceRoutes);

const dietRoutes = require("./server/admin/Diet/diet.route");
router.use("/diet/site/apis", dietRoutes);

// const gymRoutes = require("./server/gym/gym.route");
// router.use("/gym/site/apis", gymRoutes);

// membership routes
// const membershipRoutes = require("./server/membership/membership.route");

const membershipRoutes = require("./server/membership/membership.route");
router.use("/membership/site/apis", membershipRoutes);

// appmembership routes
const appMembershipRoutes = require("./server/membershipApp/appmembership.route");
router.use("/appmembership/site/apis", appMembershipRoutes);

const empRoutes = require("./server/add_emp/emp.router");
router.use("/emp/site/apis", empRoutes);

const Sfl = require("./server/SFL/sfl.route");
router.use("/sfl/site/apis", Sfl);

const easyBuzzRoutes = require("./server/easeBuzz_payment/payment.router");
router.use("/easeBuzz/site/apis", easyBuzzRoutes);

// Register ZEGOCLOUD channel routes under /channel
const channelRouter = require("./server/zegocloud/channel/channel.route");
router.use("/channel/site/apis", channelRouter);

// Register ZEGOCLOUD chat routes under /chat
const zegoRouter = require("./server/zegocloud/zegocloud.route");
router.use("/chat/site/apis", zegoRouter);

const paymentRoute = require("./server/payments/payment.route");
const allTransactionsRoute = require("./server/payments/allTransactions.route");
router.use("/payments/site/apis", paymentRoute);
router.use("/payments/site/apis", allTransactionsRoute);

// Catch-all for Undefined Routes
router.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
module.exports = router;
