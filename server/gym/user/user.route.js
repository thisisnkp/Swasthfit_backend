// const express = require("express");
const router = express.Router();

// Example routes
router.post("/signup", (req, res) => {
  res.send("Signup route");
});

router.post("/signin", (req, res) => {
  res.send("Signin route");
});

router.post("/verifyToken", (req, res) => {
  res.send("Verify Token route");
});

// Export the router
module.exports = router;
