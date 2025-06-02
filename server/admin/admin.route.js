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
<<<<<<< HEAD
  getAdminProfile, // <-- ADD THIS
=======
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
//const RolePermissionController = require("../admin/controllers/RoleAndPermission");
const kycDetailsController = require("./controllers/kycdetails.controller");
const RolePermissionController = require("../admin/controllers/RoleAndPermission"); // Correct path as needed
const { authMiddleware } = require("../../middlewares/authMiddleware");
const dashboardController = require("./controllers/dashboardController");
=======
const RolePermissionController = require("../admin/controllers/RoleAndPermission");
const kycDetailsController = require("./controllers/kycdetails.controller");

const { authMiddleware } = require("../../middlewares/authMiddleware");
>>>>>>> restaurent_backend

// --- Multer Configuration for KYC File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
<<<<<<< HEAD
    cb(null, "uploads/kyc/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
=======
    cb(null, 'uploads/kyc/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
>>>>>>> restaurent_backend
});
const upload = multer({ storage: storage });

const kycUpload = upload.fields([
<<<<<<< HEAD
  { name: "chequeDocuments", maxCount: 5 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "msmeCertificate", maxCount: 1 },
  { name: "shopCertificate", maxCount: 1 },
  { name: "additionalDocuments", maxCount: 10 },
=======
  { name: 'chequeDocuments', maxCount: 5 },
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'msmeCertificate', maxCount: 1 },
  { name: 'shopCertificate', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 10 },
>>>>>>> restaurent_backend
]);
// --- End Multer Configuration ---

// --- Auth Routes ---
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/reset-password", resetPassword);
router.post("/reset-password-link", handlePasswordReset);
<<<<<<< HEAD
router.get("/profile/:id", authMiddleware, getAdminProfile);
=======
>>>>>>> restaurent_backend
router.post("/send-sms", sendSMS);
router.post("/mail", sendEmail);
router.post("/staff", registerGymOwner);

// --- KYC Route ---
router.post("/kyc/submit", kycUpload, kycDetailsController.submitAdminKyc);

// --- Role & Permissions Routes ---
<<<<<<< HEAD
router.post("/role", RolePermissionController.createRole);
router.get("/roles", RolePermissionController.getRoles); // For listing roles
router.put("/role/:id", RolePermissionController.updateRole); // For editing role name
router.delete("/role/:id", RolePermissionController.deleteRole); // For deleting a role

router.post("/module", RolePermissionController.createModule); // If you manage modules via API
router.get("/modules", RolePermissionController.getModules); // If you need to list modules

router.post("/createPermission", RolePermissionController.createPermission); // For defining new permissions

// To get all available modules and their permissions (for PermissionsPage.jsx UI)
router.get(
  "/module-permission",
  RolePermissionController.getAllModulesWithPermissions,
);

// To get a specific role's details and its currently assigned permission IDs
router.get(
  "/roles/:roleId/permissions",
  RolePermissionController.getPermissionsForRole,
);

// To save the assigned permissions for a role
router.post(
  "/roles/:roleId/permissions",
  RolePermissionController.savePermissionsForRole,
);

// Remove or re-evaluate this if its functionality is covered by the above
// router.post("/save", RolePermissionController.savePermissions);
// router.post("/assign-role", RolePermissionController.assignPermissionToRole); // This is for single assignment, savePermissionsForRole is for bulk.
// router.get("/roles/:role_id", RolePermissionController.getRoleWithPermissions); // getPermissionsForRole is more specific for the permissions page
=======
router.post("/role",authMiddleware, RolePermissionController.createRole);
router.post("/module", RolePermissionController.createModule);
router.post("/createPermission", RolePermissionController.createPermission);
router.post("/assign-role", RolePermissionController.assignPermissionToRole);
router.get("/roles/:role_id", RolePermissionController.getRoleWithPermissions);
router.get("/modules", RolePermissionController.getModules);
router.get("/roles", RolePermissionController.getRoles);
router.post("/save", RolePermissionController.savePermissions);
router.get("/module-permission", RolePermissionController.getAllModulesWithPermissions);
router.get("/roles/:roleId/permissions", RolePermissionController.getModulesWithPermissionsByRole);
>>>>>>> restaurent_backend

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
<<<<<<< HEAD
router
  .route("/order")
  .get(authMiddleware, orderController.getAllOrders)
  .post(authMiddleware, orderController.createOrders);
router.route("/order/:id").delete(authMiddleware, orderController.deleteOrder);
=======
router.route("/order")
  .get(authMiddleware, orderController.getAllOrders)
  .post(authMiddleware, orderController.createOrders);
router.route("/order/:id")
  .delete(authMiddleware, orderController.deleteOrder);
>>>>>>> restaurent_backend

// --- User Routes ---
router.route("/user/:id").get(authMiddleware, userController.getUserController);
router.route("/user").get(authMiddleware, userController.getAllUsersController);
router.route("/user").post(authMiddleware, userController.createUserController);
<<<<<<< HEAD
router
  .route("/user/:id/orders")
  .get(authMiddleware, userController.getAllOrdersByUser);

// --- Menu Routes ---
router
  .route("/menu")
  .get(authMiddleware, menuController.getMenus)
  .post(authMiddleware, menuController.createMenu);

router.get(
  "/dashboard/revenue-summary-data",
  authMiddleware,
  dashboardController.getRevenueSummaryData,
);
router.get(
  "/dashboard/order-chart-data",
  authMiddleware,
  dashboardController.getOrderChartData,
);
router.get(
  "/dashboard/delivery-heatmap-data",
  authMiddleware,
  dashboardController.getDeliveryHeatmapData,
);
// router.get("/dashboard/summary-card-trends", authMiddleware, dashboardController.getSummaryCardTrends); // If you implement this
router.get(
  "/dashboard/special-menu-items",
  authMiddleware,
  dashboardController.getDashboardSpecialMenuItems,
);
router.get(
  "/dashboard/other-outlets",
  authMiddleware,
  dashboardController.getDashboardOtherOutlets,
);

=======
router.route("/user/:id/orders").get(authMiddleware, userController.getAllOrdersByUser);

// --- Menu Routes ---
router.route("/menu")
  .get(authMiddleware, menuController.getMenus)
  .post(authMiddleware, menuController.createMenu);

>>>>>>> restaurent_backend
// --- Export the router ---
module.exports = router;
