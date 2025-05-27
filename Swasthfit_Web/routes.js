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
            res.status(err.status || 500).send("An error occurred while serving the file.");
        }
    });
});

// Admin Routes
const AdminRoute = require("./server/admin/admin.route");
router.use("/admin/site/apis", AdminRoute);


// Mutual Fund Routes
const mutualRoute = require("./server/mutual-fund/mutual.route");
router.use("/mutual-fund/site/apis", mutualRoute);

// Food Section Routes
const foodRoute = require("./server/food/food.route");
const foodAppRoute = require("./server/food/food.app.route");
router.use("/food/site/apis", foodRoute);
router.use("/food/app/apis", foodAppRoute);

// TODO: Add these routes once the corresponding route files are ready

const userRoute = require("./server/food/food.route");
router.use("/user/site/apis", userRoute);

const gymRoute = require("./server/gym/gym.route");
router.use("/gym/site/apis", gymRoute);

// vendor routes 
const vendorRoute = require("./server/food/food.route");
router.use("/vendor/site/apis" , vendorRoute);

// offer route 
const offerRoute = require("./server/food/food.route");
router.use("/offer/site/apis", offerRoute);

// category Route 
const categoryRoute = require ("./server/food/food.route");
router.use("/category/site/apis" , categoryRoute);
// order route 
const orderRoute = require("./server/food/food.route");
router.use("/order/site/apis" , orderRoute);

// home route 
const homeRoute = require("./server/food/food.route");
router.use("/home/site/apis" , homeRoute);


// Marketing Suite
// const MarketingRoute = require("./server/marketing/market.route.js");
// router.use("/marketing", MarketingRoute);

// const ecomRoute = require("./server/e-com/ecom.route");
// router.use("/e-com/site/apis", ecomRoute);

// Catch-all for Undefined Routes
router.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

module.exports = router;
