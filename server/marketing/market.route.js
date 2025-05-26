const express = require("express");
const router = express.Router();
const path = require("path");
const loginAccess = require("../../login.middleware");
const verifyJWT = require("../../checkAccess");



// get veriify
const getVerify = require("./main/getVerify");
router.get("/verify", verifyJWT, getVerify.verifyJWT);

// for whatsapp
const getDashboardData = require("./function/Dashboard/dashboard.controller")
router.get("/dashboardAnalytics",verifyJWT, getDashboardData.getWalletAnalytics);


// products of vendor for product page 
const productController = require("./function/PromotionProduct/product.controller");
router.get("/products",verifyJWT,  productController.getProductsByLoggedInUser);
router.get("/products/:restaurant_id", verifyJWT, productController.getFoodItemsByRestaurantId);

// New route for getting food items by restaurant ID
router.get("/products/:restaurant_id", verifyJWT, productController.getFoodItemsByRestaurantId);

// create campaign with this 
const createCampaignHandler = require("./function/CreateCampaign/createCampaign.controller");
router.post('/createCampaign',verifyJWT, createCampaignHandler.createCampaignHandler);

// wallet page get api 
const vendorAnalyticsController = require("./function/Wallet/walletTransactionPost.controller");
router.get("/vendor-analytics", verifyJWT, vendorAnalyticsController.getVendorAnalytics);

// wallet recharge and campaign transaction
const walletController = require('./function/Wallet/walletRechargeTransaction.controller');
router.get('/walletTransaction',verifyJWT, walletController.getWalletTransactionsByVendor);
router.get('/walletRecharge',verifyJWT, walletController.getAllVendorWalletPayments);
router.post('/payWalletRecharge',verifyJWT, walletController.createVendorWalletPayment);

// wallet deduct and add money
const walletDeductionController = require('./function/Wallet/walletDeduct.controller');
router.post('/deductWallet',verifyJWT, walletDeductionController.deductFromWallet);
router.post('/addMoney',verifyJWT, walletDeductionController.rechargeVendorWallet);

// get all report of campaign for report page 
const reportController = require("./function/report/campaignReport.controller");
router.get("/report",verifyJWT, reportController.getVendorCampaignsByModuleType);

const  contactController = require("./function/ManageSocialMedia/getQuotaForm.controller");
router.post('/getquota',verifyJWT, contactController.authenticateAndSubmitContact);


// facebook auth login apis
const facebookAuthController = require("./function/AuthenticationFacebook/authFacebook");

router.get("/facebook",verifyJWT, facebookAuthController.facebookLogin);

router.get("/facebook/callback", facebookAuthController.facebookCallback, facebookAuthController.facebookSuccess);

router.get("/facebook/success",verifyJWT, facebookAuthController.facebookSuccess);

router.get("/facebook/error", facebookAuthController.facebookError);

router.get("/facebook/signout", facebookAuthController.facebookSignout);

router.get("/facebook/check-auth", verifyJWT, facebookAuthController.checkFacebookAuth);

router.get("/facebook/get-user",verifyJWT, facebookAuthController.getUserByToken);

router.get("/redirect/facebook", facebookAuthController.redirectToFacebookAuth);

// post on facebook page
const facebookPostController = require("./function/AuthenticationFacebook/postOnFacebook");
router.post("/facebook/post",verifyJWT, facebookPostController.postToFacebook);

// post on instagram 
const instagramPostController = require("./function/Instagram/postOnInstagram.controller");
router.post("/instagram/post",verifyJWT, instagramPostController.postToInstagram);

// schedule post on facebook
const schedulePostController = require("./function/ManageSocialMedia/schedulePost");
router.post("/schedule/post",verifyJWT, schedulePostController.createFacebookPost);

// get the post of facebook 
const getPostByStatusController = require("./function/ManageSocialMedia/getPostByStatus.controller");
router.get("/facebook/getPosts",verifyJWT, getPostByStatusController.getPostsByStatus);

const getPostByIdController = require("./function/ManageSocialMedia/getAllPagesOfFacebook.controller");
router.get("/facebook/getAllPages",verifyJWT, getPostByIdController.getAllFacebookPages);

// main APIs fo other modules
const latitudeLongitude = require("./main/marketingMain.controller");
router.post("/campaigns/checkradius", latitudeLongitude.checkCampaignInRadius);

const clickMarketing = require("./main/clickMarketing.controller");
router.post("/campaigns/clickMarketing", clickMarketing.trackUserAction);
module.exports = router;
