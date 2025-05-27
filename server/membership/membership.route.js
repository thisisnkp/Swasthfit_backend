const express = require("express");
const loginAccess = require("../../login.middleware");
const verifyJWT = require("../../checkingAccess");
const router = express.Router();
const {
  createMembership,
  filterMemberships,
  updateMembership,
  deleteMembership,
  getAllMemberships,
  getMembershipByUserId,
  getMembershipById,
  getMembershipDetailsById,
  getAllMembershipDetails,
  deleteMembershipById,
  updateMembershipStatus,
} = require("./membership/membership.controller");

const {
  createMembershipPlan,
  updateMembershipPlan,
  getMembershipPlansByGym,
} = require("./membership-plans/membership_plans_controller");
const { createCoupon } = require("./coupons/coupons.controller");

router.use(express.json());

// Membership routes
router.post("/createMembership", createMembership);
router.get("/filtered-memberships", filterMemberships);
router.put("/updateMembership/:id", updateMembership);
router.delete("/deleteMembership/:id", deleteMembership);
router.get("/getMemberships", getAllMemberships);
router.get("/getMembershipsByUserId/:UserId", getMembershipByUserId);
router.get("/getMembership/:id", getMembershipById);
router.get("/getMembershipDetails/:id", getMembershipDetailsById);
router.get("/getAllMembershipDetails", getAllMembershipDetails);
router.delete("/deleteMembershipById/:id", deleteMembershipById);
router.put("/updateMembershipStatus/:id", updateMembershipStatus);

// --------------------Plan routes--------------------
// create plan
router.post("/createMembership-plans", verifyJWT, createMembershipPlan);
router.put("/updateMembership-plans/:id", updateMembershipPlan);
router.get("/getMembershipPlans", verifyJWT, getMembershipPlansByGym);

// // Routes for Coupons
router.post("/createCoupons", createCoupon);
// router.get("/coupons", couponController.getAllCoupons);
// router.get("/coupons/:id", couponController.getCouponById);
// router.put("/coupons/:id", couponController.updateCoupon);
// router.delete("/coupons/:id", couponController.deleteCoupon);

module.exports = router;
