const express = require("express");
const router = express.Router();
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
// const UserController = require("../user/user.controller")
const {
  diningAdd,
  diningList,
  diningCreateOrUpdate,
} = require("./controllers/dining");
const commissionController = require("./controllers/comission");
const {
  promotionAdd,
  promotionList,
  promotionCreateOrUpdate,
} = require("./controllers/promotion");

const {
  authMiddleware,
  verifyToken,
} = require("../../middlewares/authMiddleware");
// const {verifyToken} =require("../../checkingAccess");
const autoprefixer = require("autoprefixer");
const { verify } = require("crypto");
// router.route("/register", UserController.userRegistration);

router.post("/signup", signup);
router.post("/signin", signin);
// router.post("/verifyToken", verifyToken);

/******************** Categories Section Start ******************/
router.route("/categories").get(verifyToken, categoryController.getCategories);
router
  .route("/category/create")
  .post(verifyToken, categoryController.createCategory);

// *********************subcategory ********************
router
  .route("/categories/subcategories")
  .get(verifyToken, categoryController.getSubCategories);
router.route("/categories/create").post(categoryController.createSubCategory);
router
  .route("/categories/:id")
  .get(verifyToken, categoryController.getCategoryById)
  .put(verifyToken, categoryController.updateCategory)  // Change this line
  .delete(verifyToken, categoryController.deleteCategory);
router
  .route("/categories/upddate/:id")
  .put(verifyToken, categoryController.updateCategory);
router.route("/category/delete/:id").delete(categoryController.deleteCategory);
router.route("/category/export").get(verifyToken, categoryController.exportCategories);
router.route("/category-import").post(verifyToken, categoryController.importCategories);
/******************** Categories Section End *********************/
router
  .route("/comission")
  .post(verifyToken, commissionController.createCommission);
router
  .route("/comission")
  .get(verifyToken, commissionController.getCommissions);
/***************** Vendor Section Route Start *****************/
router
  .route("/vendor")
  .get(verifyToken, vendorController.getRestVendors)
  .post(verifyToken, vendorController.createVendor);
router
  .route("/vendor/:id")

  .put(verifyToken, vendorController.updateVendor)
  .delete(verifyToken, vendorController.deleteVendor)
  .get(verifyToken, vendorController.getVendorById);
router
  .route("/vendors/:vendor_id/restaurants")
  .get(verifyToken, vendorController.getRestaurantsForVendor);
  router.route("/vendor/login").post( vendorController.vendorLogin)
/***************** Vendor Section Route End *****************/

/******************** Rest Section Start ******************/
router.route("/rest/login").post(restaurantController.Restlogin);
router.route("/rest/user-create").post(restaurantController.userRegistration)
router.route("/user-login").post(restaurantController.userLogin);
router
  .route("/rest")
  .get(verifyToken, restaurantController.getAllRestaurants)
  router.route("/rest/create").post( restaurantController.createRestaurant);
router
  .route("/rest/:restaurantId/orders")
  .get(verifyToken, restaurantController.getRestaurantOrders);
router
  .route("/rest/:id")
  .get(verifyToken, restaurantController.getRestaurantById); 
router
  .route("/menu/:id")
  .get(verifyToken, restaurantController.getRestaurantWithMenu);
router
  .route("/nearby-restaurants")
  .post(verifyToken, restaurantController.getNearbyRestaurants);

router
  .route("/rest/update/:id")
  .put(verifyToken, restaurantController.updateRestaurant);
router
  .route("/rest/delete/:id")
  .delete(verifyToken, restaurantController.deleteRestaurant);
router
  .route("/rest/diet/:id")
  .get(verifyToken, restaurantController.getRestaurantDietPackage);
router.route("/diet").get(verifyToken, restaurantController.getDiet);
router
  .route("/rest/:restaurantId/users")
  .get(verifyToken, restaurantController.getUsersForRestaurant);
router
  .route("/add-diet")
  .post(verifyToken, restaurantController.addDietPlanToRestaurant);
  router.route("/restaurant/:id/users").get(restaurantController.getUsersByRestaurantId);
  router.route("/diets-by-restaurant/:restaurantId").get(verifyToken, restaurantController.getAllDietsByRestaurant);
/******************** Rest Section End *********************/

/******************** Food Item Section Start ******************/
router
  .route("/food")
  .get(verifyToken, foodItemController.getFoodItems)
 router.route("/food/create-food") .post(verifyToken, foodItemController.createfoodItem);
router
  .route("/food/order")
  .get(verifyToken, foodItemController.getAllFoodItemsWithOrders);
router
  .route("/food/:restaurantId")
  .get(verifyToken, foodItemController.getFoodItemsByRestaurantId);

router
  .route("/food/update/:id")
  .put(verifyToken, foodItemController.updateFoodItem);
router
  .route("/food/delete/:food_item_id")
  .delete(verifyToken, foodItemController.deleteFoodItemById);
// .get(authMiddleware , foodItemController.getFoodItemsByRestaurantId)
router
  .route("/food/offer/:id")
  .get(verifyToken, foodItemController.getFoodItemsWithOffers);
/******************** Food Item Section End *********************/

/******************** Diet Package Section Start ******************/
router
  .route("/all-diet")
  .get(verifyToken, dietPackageController.getAllDietPackages);
router
  .route("/create-diet")
  .post(verifyToken, dietPackageController.createDietPackage);
router
  .route("/diet/:id")
  .put(verifyToken, dietPackageController.updateDietPackage)
  .delete(verifyToken, dietPackageController.deleteDietPackage)
  .get(verifyToken, dietPackageController.getDietPackageById);

/******************** Diet Package Section End *********************/

/******************** User Section Start ******************/
router.route("/all-user").get(verifyToken, userController.getAllUsers);
router.route("/user/profile/:id")
  .get(verifyToken, userController.getUserProfile);
router
  .route("/user")


  .post(verifyToken, userController.createFoodOrder)
  .put(verifyToken, orderController.updateOrderStatus);
router.route("/login/user").post(userController.loginUser);
router.route("/signup/user").post(userController.createUser);
router.route("/user/cancel-order").put(verifyToken, userController.cancelOrder);
router
  .route("/user/:id")
  .put(verifyToken, userController.updateUser)
  .delete(verifyToken, userController.deleteUser)
  .get(verifyToken, userController.getUserById);
// user action track rouute
router
  .route("/track")
  .post(verifyToken, userController.createUserProductAction);

// diet create by trianer
router
  .route("/user/diet/:id")
  .get(verifyToken, clientdietplanController.getClientDietPlanById);
router
  .route("/user/create-diet")
  .post(verifyToken, clientdietplanController.createClientDietPlan);
router
  .route("/user/workout")
  .post(verifyToken, clientdietplanController.createClientWorkout);
router
  .route("/user/diet-update/:planId")
  .put(verifyToken, clientdietplanController.updateClientDietPlan);
router
  .route("/diet-plans/:userId/:trainerId")
  .get(verifyToken, clientdietplanController.getDietPlansByUserAndTrainer);
/******************** User Section End *********************/

/******************** Offer Section Start ******************/
router.route("/offer").post(verifyToken, offerController.createItemOffer);
router.route("/offer").get(verifyToken, offerController.getOffers);
router.route("/offer/:id").put(verifyToken, offerController.updateItemOffer);
/******************** Offer Section End *********************/

/******************** Report Section Start *********************/
router
  .route("/report/create")
  .post(verifyToken, reportController.createStockReport);
router
  .route("/report-all")
  .get(verifyToken, reportController.getAllStockReports);
router
  .route("/report/delete/:id")
  .delete(verifyToken, reportController.deleteStockReport);
router
  .route("/report/:id")
  .get(verifyToken, reportController.getStockReportById);
/******************** Report Section End *********************/

/***************** Rider Section Route Start *****************/
router.route("/rider-create").post(verifyToken, riderController.createRider);
router.route("/rider/all").get(verifyToken, riderController.getAllRiders);
router.route("/rider/:id").get(verifyToken, riderController.getRiderById);
router
  .route("/rider/delete/:id")
  .delete(verifyToken, riderController.deleteRider);
/***************** Dining Section Route Start *****************/
router.get("/dining/add", diningAdd);
router.get("/dining/edit/:id", diningAdd);
router.get("/dining/list", diningList);
router.post("/dining/create", diningCreateOrUpdate);
/***************** Dining Section Route End *****************/

/***************** Order Section Route Start *****************/
router.route("/order").get(verifyToken, orderController.getAllOrders);
router.route("/order/create").post(verifyToken, orderController.createorder);
router
  .route("/order/orders-between-dates")
  .post(verifyToken, orderController.getOrdersBetweenDates);
router.route("/update").put(verifyToken, orderController.updateOrderStatus);
router
  .route("/order/orders-by-range")
  .post(verifyToken, orderController.getOrdersByRange);
router
  .route("/orders-by-date")
  .post(verifyToken, orderController.getOrdersByDateRange);
router
  .route("/order/:order_id")
  .get(verifyToken, orderController.getOrderStatus);
router
  .route("/order/delete/:orderId")
  .delete(verifyToken, orderController.deleteOrder);
  router.route("/order/user/all-order").get(verifyToken , orderController.getAllUsersWithOrders)
/***************** Order Section Route End *****************/

// home section Route start
router.route("/search").get(verify, homeController.searchFoodItems);
router.route("/search/market").get(verifyToken, homeController.searchFoodItems);
router.route("/home").get(verifyToken, homeController.getHomeData);

// router.route("/near").get(authMiddleware , homeController.getNearbySearchedFoodItems);
router
  .route("/home")
  .get(verifyToken, orderController.getUserAddressDetails)
  .get(verifyToken, orderController.getFoodItemDetails)
  .post(verifyToken, orderController.addFavoriteItem)
  .post(verifyToken, orderController.addFavoriteRestaurant)
  .post(verifyToken, orderController.getSpecialFoodItems)
  .post(verifyToken, orderController.getRestDetails)
  .post(verifyToken, orderController.getUserAddressDetails)
  .post(verifyToken, orderController.addAddressApi);
/***************** Invoice Section Route Start *****************/
router
  .route("/invoices/create")
  .post(verifyToken, invoiceController.createInvoice);
router
  .route("/invoices/:id")
  .get(verifyToken, invoiceController.getInvoiceById);
router.route("/invoice-all").get(verifyToken, invoiceController.getInvoicesAll);
router
  .route("/invoice/delete/:id")
  .delete(verifyToken, invoiceController.deleteInvoice);
/***************** Promotion Section Route Start *****************/
router.get("/promotion/add", promotionAdd);
router.get("/promotion/edit/:id", promotionAdd);
router.get("/promotion/list", promotionList);
router.post("/promotion/create", promotionCreateOrUpdate);
/***************** Promotion Section Route End *****************/

// ... existing code ...

// // ... existing code ...

// Export the router
module.exports = router;
