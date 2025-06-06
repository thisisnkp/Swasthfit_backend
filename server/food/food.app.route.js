const express = require("express");
const router = express.Router();

// Controller Imports
const { signup, signin } = require("../admin/admin.controller");
const vendorController = require("./controllers/vendor");
const categoryController = require("./controllers/category");
const restaurantController = require("./controllers/rest");
const foodItemController = require("./controllers/foodItem");
const dietPackageController = require("./controllers/dietPackage");
const userController = require("./controllers/user");
const offerController = require("./controllers/offer");
const orderController = require("./controllers/order");
const homeController = require("./controllers/home");
const subCategoryController = require("./controllers/subcategory");
const invoiceController = require("./controllers/invoice");
const clientdietplanController = require("./controllers/clientdietplan");
const reportController = require("./controllers/report");
const riderController = require("./controllers/rider");
const commissionController = require("./controllers/comission");
const { diningAdd, diningList, diningCreateOrUpdate } = require("./controllers/dining");
const { promotionAdd, promotionList, promotionCreateOrUpdate } = require("./controllers/promotion");

// Middleware
const { authMiddleware, verifyToken } = require("../../middlewares/authMiddleware");

// Auth Routes
router.post("/signup", signup);
router.post("/signin", signin);

// Categories
router.get("/categories", verifyToken, categoryController.getCategories);
router.post("/category/create", verifyToken, categoryController.createCategory);
router.get("/categories/subcategories", verifyToken, categoryController.getSubCategories);
router.post("/categories/create", categoryController.createSubCategory);
router.route("/categories/:id")
  .get(verifyToken, categoryController.getCategoryById)
  .put(verifyToken, categoryController.updateCategory)
  .delete(verifyToken, categoryController.deleteCategory);
router.put("/categories/upddate/:id", verifyToken, categoryController.updateCategory);
router.delete("/category/delete/:id", categoryController.deleteCategory);
router.get("/category/export", verifyToken, categoryController.exportCategories);
router.post("/category-import", verifyToken, categoryController.importCategories);

// Commission
router.route("/comission")
  .post(verifyToken, commissionController.createCommission)
  .get(verifyToken, commissionController.getCommissions);

// Vendors
router.route("/vendor")
  .get(verifyToken, vendorController.getRestVendors)
  .post(verifyToken, vendorController.createVendor);
router.route("/vendor/:id")
  .put(verifyToken, vendorController.updateVendor)
  .delete(verifyToken, vendorController.deleteVendor)
  .get(verifyToken, vendorController.getVendorById);
router.get("/vendors/:vendor_id/restaurants", verifyToken, vendorController.getRestaurantsForVendor);
router.post("/vendor/login", vendorController.vendorLogin);

// Restaurants
router.post("/rest/login", restaurantController.Restlogin);
router.post("/rest/user-create", restaurantController.userRegistration);
router.post("/user-login", restaurantController.userLogin);
router.get("/rest", verifyToken, restaurantController.getAllRestaurants);
router.post("/rest/create", restaurantController.createRestaurant);
router.get("/rest/:restaurantId/orders", verifyToken, restaurantController.getRestaurantOrders);
router.get("/rest/:id", verifyToken, restaurantController.getRestaurantById);
router.get("/menu/:id", verifyToken, restaurantController.getRestaurantWithMenu);
router.post("/nearby-restaurants", verifyToken, restaurantController.getNearbyRestaurants);
router.put("/rest/update/:id", verifyToken, restaurantController.updateRestaurant);
router.delete("/rest/delete/:id", verifyToken, restaurantController.deleteRestaurant);
router.get("/rest/diet/:id", verifyToken, restaurantController.getRestaurantDietPackage);
router.get("/diet", verifyToken, restaurantController.getDiet);
router.get("/rest/:restaurantId/users", verifyToken, restaurantController.getUsersForRestaurant);
router.post("/add-diet", verifyToken, restaurantController.addDietPlanToRestaurant);
router.get("/restaurant/:id/users", restaurantController.getUsersByRestaurantId);

// Food Items
router.get("/food", verifyToken, foodItemController.getFoodItems);
router.post("/food/create-food", verifyToken, foodItemController.createfoodItem);
router.get("/food/order", verifyToken, foodItemController.getAllFoodItemsWithOrders);
router.get("/food/:restaurantId", verifyToken, foodItemController.getFoodItemsByRestaurantId);
router.put("/food/update/:id", verifyToken, foodItemController.updateFoodItem);
router.delete("/food/delete/:food_item_id", verifyToken, foodItemController.deleteFoodItemById);
router.get("/food/offer/:id", verifyToken, foodItemController.getFoodItemsWithOffers);

// Diet Packages
router.get("/all-diet", verifyToken, dietPackageController.getAllDietPackages);
router.post("/create-diet", verifyToken, dietPackageController.createDietPackage);
router.route("/diet/:id")
  .put(verifyToken, dietPackageController.updateDietPackage)
  .delete(verifyToken, dietPackageController.deleteDietPackage)
  .get(verifyToken, dietPackageController.getDietPackageById);

// Users
router.get("/all-user", verifyToken, userController.getAllUsers);
router.get("/user/profile/:id", verifyToken, userController.getUserProfile);
router.route("/user")
  .get(verifyToken, userController.getUserProfile)
  .post(verifyToken, userController.createFoodOrder)
  .put(verifyToken, orderController.updateOrderStatus);
router.post("/login/user", userController.loginUser);
router.post("/signup/user", userController.createUser);
router.put("/user/cancel-order", verifyToken, userController.cancelOrder);
router.route("/user/:id")
  .put(verifyToken, userController.updateUser)
  .delete(verifyToken, userController.deleteUser)
  .get(verifyToken, userController.getUserById);
router.post("/track", verifyToken, userController.createUserProductAction);

// Client Diet Plan
router.get("/user/diet/:id", verifyToken, clientdietplanController.getClientDietPlanById);
router.post("/user/create-diet", verifyToken, clientdietplanController.createClientDietPlan);
router.post("/user/workout", verifyToken, clientdietplanController.createClientWorkout);
router.put("/user/diet-update/:planId", verifyToken, clientdietplanController.updateClientDietPlan);
router.get("/diet-plans/:userId/:trainerId", verifyToken, clientdietplanController.getDietPlansByUserAndTrainer);

// Offers
router.post("/offer", verifyToken, offerController.createItemOffer);
router.get("/offer", verifyToken, offerController.getOffers);
router.put("/offer/:id", verifyToken, offerController.updateItemOffer);

// Reports
router.post("/report/create", verifyToken, reportController.createStockReport);
router.get("/report-all", verifyToken, reportController.getAllStockReports);
router.delete("/report/delete/:id", verifyToken, reportController.deleteStockReport);
router.get("/report/:id", verifyToken, reportController.getStockReportById);

// Riders
router.post("/rider-create", verifyToken, riderController.createRider);
router.get("/rider/all", verifyToken, riderController.getAllRiders);
router.get("/rider/:id", verifyToken, riderController.getRiderById);
router.delete("/rider/delete/:id", verifyToken, riderController.deleteRider);

// Dining
router.get("/dining/add", diningAdd);
router.get("/dining/edit/:id", diningAdd);
router.get("/dining/list", diningList);
router.post("/dining/create", diningCreateOrUpdate);

// Orders
router.get("/order", verifyToken, orderController.getAllOrders);
router.post("/order/create", verifyToken, orderController.createorder);
router.post("/order/orders-between-dates", verifyToken, orderController.getOrdersBetweenDates);
router.put("/update", verifyToken, orderController.updateOrderStatus);
router.post("/order/orders-by-range", verifyToken, orderController.getOrdersByRange);
router.post("/orders-by-date", verifyToken, orderController.getOrdersByDateRange);
router.get("/order/:order_id", verifyToken, orderController.getOrderStatus);
router.delete("/order/delete/:orderId", verifyToken, orderController.deleteOrder);
router.get("/order/user/all-order", verifyToken, orderController.getAllUsersWithOrders);

// Home
router.get("/search", verifyToken, homeController.searchFoodItems);
router.get("/search/market", verifyToken, homeController.searchFoodItems);
router.get("/home", verifyToken, homeController.getHomeData);

// Invoices
router.post("/invoices/create", verifyToken, invoiceController.createInvoice);
router.route("/invoices/:id")
  .get(verifyToken, invoiceController.getInvoiceById)
  .put(verifyToken, invoiceController.updateInvoice);
router.get("/invoice-all", verifyToken, invoiceController.getInvoicesAll);
router.delete("/invoice/delete/:id", verifyToken, invoiceController.deleteInvoice);

// Promotions
router.get("/promotion/add", promotionAdd);
router.get("/promotion/edit/:id", promotionAdd);
router.get("/promotion/list", promotionList);
router.post("/promotion/create", promotionCreateOrUpdate);

// Export router
module.exports = router;
