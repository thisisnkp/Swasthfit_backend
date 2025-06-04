const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Controllers
const {
  signup,
  signin,
  verifyToken,
  resetPassword,
  handlePasswordReset,
  sendSMS,
  sendEmail,
  registerGymOwner,
  getAdminProfile,
} = require("./admin.controller");

const {
  addingQNAData,
  updateAnswer,
  updateSpecificAnswer,
  deleteSpecificAnswer,
  deleteQuestion,
} = require("./controllers/questions.controllers");

const orderController = require("../admin/controllers/AdminOrder");
const userController = require("../admin/controllers/User");
const menuController = require("../admin/controllers/Menu");
const kycDetailsController = require("./controllers/kycdetails.controller");
const RolePermissionController = require("../admin/controllers/RoleAndPermission");
const dashboardController = require("./controllers/dashboardController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

// --- Multer Configuration for KYC File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/kyc/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const kycUpload = upload.fields([
  { name: "chequeDocuments", maxCount: 5 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "msmeCertificate", maxCount: 1 },
  { name: "shopCertificate", maxCount: 1 },
  { name: "additionalDocuments", maxCount: 10 },
]);

// --- Auth Routes ---
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/reset-password", resetPassword);
router.post("/reset-password-link", handlePasswordReset);
router.get("/profile/:id", authMiddleware, getAdminProfile);
router.post("/send-sms", sendSMS);
router.post("/mail", sendEmail);
router.post("/staff", registerGymOwner);

// --- KYC Route ---
router.post("/kyc/submit", kycUpload, kycDetailsController.submitAdminKyc);

// --- Role & Permissions Routes ---
router.post("/role", authMiddleware, RolePermissionController.createRole);
router.get("/roles", RolePermissionController.getRoles);
router.put("/role/:id", RolePermissionController.updateRole);
router.delete("/role/:id", RolePermissionController.deleteRole);

router.post("/module", RolePermissionController.createModule);
router.get("/modules", RolePermissionController.getModules);

router.post("/createPermission", RolePermissionController.createPermission);

router.get("/module-permission", RolePermissionController.getAllModulesWithPermissions);
router.get("/roles/:roleId/permissions", RolePermissionController.getPermissionsForRole);
router.post("/roles/:roleId/permissions", RolePermissionController.savePermissionsForRole);

// --- Question & Answer Routes ---
router.post("/questions", addingQNAData);
router.put("/questions/:id", updateAnswer);
router.put("/questions/:id/answer", updateSpecificAnswer);
router.delete("/questions/:id/answer", deleteSpecificAnswer);
router.delete("/questions/:id", deleteQuestion);

// --- Frontend Routes ---
const FrontRoute = require("./front-routes/front.routes");
router.use("/frontend", FrontRoute);

// --- Order Routes ---
router
  .route("/order")
  .get(authMiddleware, orderController.getAllOrders)
  .post(authMiddleware, orderController.createOrders);
router.route("/order/:id").delete(authMiddleware, orderController.deleteOrder);

// --- User Routes ---
router.route("/user/:id").get(authMiddleware, userController.getUserController);
router.route("/user").get(authMiddleware, userController.getAllUsersController);
router.route("/user").post(authMiddleware, userController.createUserController);
router.route("/user/:id/orders").get(authMiddleware, userController.getAllOrdersByUser);

// --- Menu Routes ---
router
  .route("/menu")
  .get(authMiddleware, menuController.getMenus)
  .post(authMiddleware, menuController.createMenu);

// --- Dashboard Routes ---
router.get(
  "/dashboard/revenue-summary-data",
  authMiddleware,
  dashboardController.getRevenueSummaryData
);
router.get(
  "/dashboard/order-chart-data",
  authMiddleware,
  dashboardController.getOrderChartData
);
router.get(
  "/dashboard/delivery-heatmap-data",
  authMiddleware,
  dashboardController.getDeliveryHeatmapData
);
router.get(
  "/dashboard/special-menu-items",
  authMiddleware,
  dashboardController.getDashboardSpecialMenuItems
);
router.get(
  "/dashboard/other-outlets",
  authMiddleware,
  dashboardController.getDashboardOtherOutlets
);

// --- Export the router ---
module.exports = router;
