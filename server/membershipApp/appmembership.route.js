const express = require("express");
const router = express.Router();
const appmembershipController = require("./appmembership.controller");

router.post(
  "/appmembership/plans",
  appmembershipController.createMembershipPlan
);
router.get("/appmembership/plans", appmembershipController.getMembershipPlans);

module.exports = router;
