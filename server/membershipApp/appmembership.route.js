const express = require("express");
const router = express.Router();
const appmembershipController = require("./appmembership.controller");
const authenticateJWT = require("../../authenticateJWT");

router.post("/new/plans", authenticateJWT, appmembershipController.createPlan); // Create a new plan
router.delete(
  "/plans/:id",
  authenticateJWT,
  appmembershipController.deletePlan
); // Delete a plan by id
router.put("/plans/:id", authenticateJWT, appmembershipController.updatePlan); // Update a plan by id (optional)
router.get("/plans", authenticateJWT, appmembershipController.getAllPlans); // Get all plans

router.post(
  "/user-selection",
  authenticateJWT,
  appmembershipController.userPlanSelection
); // User selection

// New route for user subscription confirmation
router.post(
  "/user-subscription-confirmation",
  authenticateJWT,
  appmembershipController.userSubscriptionConfirmation
);

module.exports = router;
