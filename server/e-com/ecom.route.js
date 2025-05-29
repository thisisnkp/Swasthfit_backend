const express = require("express");
const router = express.Router();

// vardor routes
const  VandorRoutes = require("./vandor/ecom-vandor.router.js")
router.use("/vandor",VandorRoutes);
// Export the router
module.exports = router;