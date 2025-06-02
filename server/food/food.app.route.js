const express = require("express");
const router = express.Router();
// const { signup, signin, verifyToken } = require('../admin/admin.controller');

const homeController = require('./controllers/apis/home');
const orderController = require('./controllers/apis/order');
const restController = require('./controllers/rest')
const { authMiddleware } = require('../../middlewares/authMiddleware');


// router.post('/signup', signup);
router.post('/signin', homeController.signin);
// router.post('/verifyToken', verifyToken);

/******************** Home Section Start ******************/
router.route('/categories').get( homeController.getCategories);
router.route('/food-items').get( homeController.getAllFoodItems);
router.route('/restaurants').get(authMiddleware, homeController.getAllRestaurants);

router.route('/special-items').post(authMiddleware, homeController.getSpecialFoodItems);
/******************** Home Section End *********************/

router.route('/address').get(authMiddleware, homeController.getAllAddresses)
    .post(authMiddleware, homeController.addAddressApi);
router.route('/address-details').post(authMiddleware, homeController.getUserAddressDetails);

router.route('/food-items-details').post(authMiddleware, homeController.getFoodItemDetails);
router.route('/rest-details').post(authMiddleware, homeController.getRestDetails);



// Define route for fetching nearby restaurants
router.route('/nearby-restaurants').post(authMiddleware, restController.getNearbyRestaurants)

router.route('/favorite-items').post(authMiddleware, homeController.addFavoriteItem);
router.route('/favorite-restaurants').post(authMiddleware, homeController.addFavoriteRestaurant);


/***********************  Order Section Start  *****************/
router.route('/create-order').post(authMiddleware, orderController.createOrder);
// router.route('/order-list').post(authMiddleware, orderController.getOrders);
router.route('/update-status').post(authMiddleware, orderController.updateOrderStatus);

// Export the router
module.exports = router;

