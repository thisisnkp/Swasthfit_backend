const express = require("express");
const router = express.Router();

// Import all controllers
const activitiesController = require("../SFL/functions/activitiesControllers");
const rewardsController = require("../SFL/functions/rewardsController");
const redemptionsController = require("../SFL/functions/redemptionsController");
const transactionsController = require("../SFL/functions/transactionsController");
const userActivitiesController = require("../SFL/functions/userActivitiesController");
const coinRedemptionController = require("./functions/coinRedemptionController");
const socialActivitiesController = require("./functions/socialActivitiesController");
const subscriptionController = require("./functions/subscriptionController");
const purchaseController = require("./functions/purchaseController");
const gullakController = require("./functions/gullakController");
const signupBonusController = require("./functions/signupBonusController");
const eventController = require("./functions/eventController");
const competitionController = require("./functions/competitionController");
const competitionBannerController = require("./functions/competitionBannerController");
const coinAuctionController = require("./functions/coinAuctionController");

// Health Activities Routes
router.post("/health/init", activitiesController.initHealthActivities);
router.post("/health/log", activitiesController.logHealthActivity);
router.get("/health/user/:userId", activitiesController.getUserActivities);

// Activity Routes (existing)
router.post("/activities", activitiesController.addActivity);
router.put("/activities/:activity_id", activitiesController.updateActivity);
router.post("/purchase-rewards/init", activitiesController.initPurchaseRewards);

// Reward Routes (existing)
router.post("/rewards", rewardsController.addReward);
router.put("/rewards/:reward_id", rewardsController.updateReward);

// Redemption Routes (existing)
router.post("/redemptions", redemptionsController.redeem);

// Transaction Routes (existing)
router.post("/transactions", transactionsController.recordTransaction);

// User Activity Routes (existing)
router.post("/user-activities", userActivitiesController.logActivity);

router.post("/pricing/calculate", coinRedemptionController.calculatePricing);
router.post("/coins/redeem", coinRedemptionController.redeemCoins);
// Social Activity Routes
router.post(
  "/social-activities",
  socialActivitiesController.recordSocialActivity
);
router.post("/referrals", socialActivitiesController.recordReferral);
router.post("/product-shares", socialActivitiesController.recordProductShare);

// Subscription Routes
router.post("/subscriptions", subscriptionController.createSubscription);
router.get(
  "/subscriptions/user/:user_id",
  subscriptionController.getUserSubscription
);
router.delete(
  "/subscriptions/user/:user_id",
  subscriptionController.cancelSubscription
);

// Purchase Routes (new)
router.post("/purchases", purchaseController.recordPurchase);
router.get("/purchases/user/:user_id", purchaseController.getPurchaseHistory);

// Gullak Routes
router.get("/gullak/user/:user_id", gullakController.getGullakBalance);
router.post("/gullak/add", gullakController.addToGullak);
router.post("/gullak/use", gullakController.useFromGullak);
router.get(
  "/gullak/dashboard/:user_id",
  gullakController.getGullakBalanceForDashboard
);
router.post("/signup-bonus", signupBonusController.awardSignupBonus);
router.post(
  "/corporate-bonus",
  signupBonusController.awardCustomCorporateBonus
);

//Event Routes
router.get("/events", eventController.getEvents);
router.post("/events", eventController.createEvent);
router.post("/events/process", eventController.sendEvent);

// Competition routes
router.post("/competitions", competitionController.createCompetition);
router.post("/competitions/prizes", competitionController.createPrize);
router.post("/competitions/join", competitionController.joinCompetition);
router.post("/competitions/progress", competitionController.calculateProgress);
router.post("/competitions/check-winners", competitionController.checkWinners);
router.post("/competitions/refund", competitionController.refundNonWinners);
router.get("/competitions", competitionController.getAllCompetitions);
router.get("/competitions/:id", competitionController.getCompetitionDetails);
router.post(
  "/competitions/update-coins",
  competitionController.updateUserCoins
);

router.post(
  "/competitions/by-location",
  competitionController.getCompetitionsByLocation
);

router.post("/banners", competitionBannerController.createBanner);
router.get("/banners/active", competitionBannerController.getActiveBanners);

// Coin Auction Routes
router.post("/auction/create", coinAuctionController.createAuction);
router.post("/auction/bid", coinAuctionController.placeBid);
router.post("/auction/resolve", coinAuctionController.resolveAuction);

router.get("/auction/all", coinAuctionController.getAllAuctions);
router.get(
  "/auctions/:auction_id/bidding-details/:user_id",
  coinAuctionController.getAuctionBiddingDetails
);

module.exports = router;
