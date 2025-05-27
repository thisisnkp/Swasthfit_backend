const Category = require('../../models/FoodCategory');
const Restaurant = require('../../models/Restaurant');
const foodItem = require('../../models/FoodItem');
const UserAddress = require('../../models/UserAddress');
const jwt = require('jsonwebtoken');
const FavoriteItem = require('../../models/favoriteItem');
const FavoriteRestaurant = require('../../models/favoriteRestaurant');

const ItemOfferSpecial = require('../../models/ItemOffer');

const Sequelize = require('sequelize');

/**********************************************************/
exports.signin = async (req, res) => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
    return res.status(200).json({
        id: 1,
        token
    });
};
/**********************************************************/

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({
            status: true, message: 'Categories fetch successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                categories
            }
        });
    } catch (error) {
        return res.status(500).json({ status: true, message: error.message });
    }
};

// Get all Items
exports.getAllFoodItems = async (req, res) => {
    try {
        const { menu_name, is_favourite, category_id, is_recommended } = req.body;

        let foodItems;

        const address = await UserAddress.findOne({
            where: {
                user_id: req?.user?.id ?? 1,
                is_default: true
            },
            attributes: ['latitude', 'longitude']
        });

        const userLatitude = address.latitude;
        const userLongitude = address.longitude;
        // Define the maximum distance in kilometers
        const maxDistance = 10;

        if (menu_name) {
            foodItems = await foodItem.findAll({
                attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'price', 'created_by', 'createdAt', 'updatedAt'],
                where: {
                    menu_name: {
                        [Sequelize.Op.like]: `%${menu_name}%`
                    }
                }
            });
        } else {
            if (is_favourite) {
                const favoriteItems = await FavoriteItem.findAll({
                    where: {
                        user_id: req?.user?.id ?? 1
                    },
                    attributes: ['item_id']
                });

                const itemIds = favoriteItems.map(fav => fav.item_id);

                foodItems = await foodItem.findAll({
                    attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'price', 'created_by', 'createdAt', 'updatedAt'],
                    where: {
                        id: {
                            [Sequelize.Op.in]: itemIds
                        }
                    }
                });
            } else if (category_id) {
                foodItems = await foodItem.findAll({
                    attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'price', 'createdAt', 'created_by', 'updatedAt'],
                    where: {
                        category_id: category_id
                    }
                });
            } else if (is_recommended) {
                foodItems = await foodItem.findAll({
                    attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'price', 'createdAt', 'created_by', 'updatedAt'],
                    where: {
                        is_recommended: true
                    }
                });
            }
            else {
                foodItems = await foodItem.findAll({
                    attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'created_by', 'price', 'createdAt', 'updatedAt']
                });
            }
        }

        const formattedFoodItems = await Promise.all(foodItems.map(async (item) => {
            const restaurant = await Restaurant.findOne({
                where: { id: item.created_by },
                attributes: ['id', 'title', 'latitude', 'longitude']
            });

            // Calculate distance using Haversine formula
            const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);

            if (distance <= maxDistance) {
                return {
                    title: item.menu_name,
                    menu_img: item.menu_img,
                    price: item.price,
                    distance: distance.toFixed(2),
                    desc: item.description,
                    rating: 3.4,
                    rest_name: restaurant.title
                };
            }
            return null;
        }));
        const filteredFoodItems = formattedFoodItems.filter(item => item !== null);

        return res.status(200).json({
            status: true, message: 'Food Items fetch successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                foodItems: filteredFoodItems
            }
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all special Items
exports.getSpecialFoodItems = async (req, res) => {
    try {
        const { menu_name, is_favourite, category_id, is_recommended } = req.body;

        let foodItems;

        const address = await UserAddress.findOne({
            where: {
                user_id: req?.user?.id ?? 1,
                is_default: true
            },
            attributes: ['latitude', 'longitude']
        });

        const userLatitude = address.latitude;
        const userLongitude = address.longitude;
        // Define the maximum distance in kilometers
        const maxDistance = 10;

        const specialItems = await ItemOfferSpecial.findAll({

        });

        const formattedFoodItems = await Promise.all(specialItems.map(async (item) => {
            const foodItems = await foodItem.findOne({
                attributes: ['id', 'menu_name', 'description', 'menu_img', 'status', 'price', 'created_by', 'createdAt', 'updatedAt'],
                where: {
                    id: item.item_id
                }
            });
            const restaurant = await Restaurant.findOne({
                where: { id: foodItems.created_by },
                attributes: ['id', 'title', 'latitude', 'longitude']
            });

            // Calculate distance using Haversine formula
            const distance = calculateDistance(userLatitude, userLongitude, restaurant.latitude, restaurant.longitude);

            if (distance <= maxDistance) {
                return {
                    special_item_id: item.id,
                    food_item_id: foodItems.id,
                    title: foodItems.menu_name,
                    menu_img: foodItems.menu_img,
                    quantity: item.min_quantity,
                    price: item.offer_price,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    distance: distance.toFixed(2),
                    desc: foodItems.description,
                    rating: 3.4,
                    rest_name: restaurant.title
                };
            }
            return null;
        }));
        const filteredFoodItems = formattedFoodItems.filter(item => item !== null);

        return res.status(200).json({
            status: true, message: 'Food Items fetch successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                foodItems: filteredFoodItems
            }
        });
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const { title, is_favourite, is_recommended } = req.body;

        let restaurants;

        const address = await UserAddress.findOne({
            where: {
                user_id: req?.user?.id ?? 1,
                is_default: true
            },
            attributes: ['latitude', 'longitude']
        });

        const userLatitude = address.latitude;
        const userLongitude = address.longitude;
        // Define the maximum distance in kilometers
        const maxDistance = 10;

        if (title) {
            restaurants = await Restaurant.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                6371 * acos(
                                    cos(radians(${userLatitude})) * 
                                    cos(radians(latitude)) * 
                                    cos(radians(longitude) - radians(${userLongitude})) + 
                                    sin(radians(${userLatitude})) * 
                                    sin(radians(latitude))
                                )
                            )`),
                            'distance'
                        ]
                    ]
                },
                where: {
                    title: {
                        [Sequelize.Op.like]: `%${title}%`
                    },
                    [Sequelize.Op.and]: [
                        Sequelize.where(
                            Sequelize.literal(`(
                                6371 * acos(
                                    cos(radians(${userLatitude})) * 
                                    cos(radians(latitude)) * 
                                    cos(radians(longitude) - radians(${userLongitude})) + 
                                    sin(radians(${userLatitude})) * 
                                    sin(radians(latitude))
                                )
                            )`),
                            { [Sequelize.Op.lte]: maxDistance } // Filter by distance
                        )
                    ]
                },
                order: [[Sequelize.literal('distance'), 'ASC']],
            });

        } else {
            if (is_favourite) {
                const favoriteRestaurants = await FavoriteRestaurant.findAll({
                    where: {
                        user_id: req?.user?.id ?? 1
                    },
                    attributes: ['rest_id']
                });

                const restIds = favoriteRestaurants.map(fav => fav.rest_id);

                restaurants = await Restaurant.findAll({
                    attributes: ['id', 'title', 'rimg', 'latitude', 'longitude', 'sdesc', 'is_popular', 'is_fitmode', 'is_dietpkg', 'is_dining', 'createdAt', 'updatedAt'],
                    where: {
                        id: {
                            [Sequelize.Op.in]: restIds
                        }
                    }
                });
            } else if (is_recommended) {
                restaurants = await Restaurant.findAll({
                    attributes: {
                        include: [
                            [
                                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                                'distance'
                            ]
                        ]
                    },
                    where: {
                        is_recommended: true,
                        [Sequelize.Op.and]: [
                            Sequelize.where(
                                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                                { [Sequelize.Op.lte]: maxDistance } // Filter by distance
                            )
                        ]
                    },
                    order: [[Sequelize.literal('distance'), 'ASC']],
                });
            }
            else {
                restaurants = await Restaurant.findAll({
                    attributes: {
                        include: [
                            [
                                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                                'distance'
                            ]
                        ]
                    },
                    where: {
                        [Sequelize.Op.and]: [
                            Sequelize.where(
                                Sequelize.literal(`(
                                    6371 * acos(
                                        cos(radians(${userLatitude})) * 
                                        cos(radians(latitude)) * 
                                        cos(radians(longitude) - radians(${userLongitude})) + 
                                        sin(radians(${userLatitude})) * 
                                        sin(radians(latitude))
                                    )
                                )`),
                                { [Sequelize.Op.lte]: maxDistance } // Filter by distance
                            )
                        ]
                    },
                    order: [[Sequelize.literal('distance'), 'ASC']],
                });
            }
        }
        const formattedFoodRests = restaurants.map(item => ({
            id: item.id,
            title: item.title,
            rimg: item.rimg,
            distance: parseFloat(item.getDataValue('distance') ?? 0).toFixed(3),
            desc: item.sdesc,
            rating: 4.2,
        }));
        return res.status(200).json({
            status: true, message: 'Restaurants fetch successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                restaurants: formattedFoodRests
            }
        });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const address = await UserAddress.findAll({});
        return res.status(200).json({
            status: true, message: 'Address fetch successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                address
            }
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get address details
exports.getUserAddressDetails = async (req, res) => {
    try {
        const { address_id } = req.body;
        const addressDetails = await UserAddress.findByPk(address_id ?? 1);
        return res.status(200).json({
            status: true, message: 'Address details fetched successfully', data: {
                addressDetails
            }
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add address
exports.addAddressApi = async (req, res) => {
    try {
        const { address_id, user_name, phone_number, house_no, city, address, latitude, longitude, is_default } = req.body;
        const created_by = req?.user?.id ?? 1;
        let addUpdatedAddress = {};
        if (address_id) {
            const update = await UserAddress.update(
                {
                    user_name: user_name,
                    phone_number: phone_number,
                    house_no: house_no,
                    city: city,
                    address: address,
                    latitude: latitude,
                    longitude: longitude,
                    is_default: is_default
                },
                {
                    where: { id: address_id }
                }
            );
            addUpdatedAddress = await UserAddress.findByPk(address_id ?? 1);
        } else {
            addUpdatedAddress = await UserAddress.create({
                user_id: created_by,
                user_name: user_name,
                phone_number: phone_number,
                house_no: house_no,
                city: city,
                address: address,
                latitude: latitude,
                longitude: longitude,
                is_default: is_default
            });
        }
        await UserAddress.update(
            { is_default: false },
            {
                where: {
                    user_id: created_by,
                    id: { [Sequelize.Op.ne]: addUpdatedAddress.id }
                }
            }
        );
        return res.status(200).json({
            status: true, message: 'Address added successfully', data: {
                addUpdatedAddress
            }
        });
    } catch (error) {
        console.error('Error fetching addresss:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get order details
exports.getFoodItemDetails = async (req, res) => {
    try {
        const { item_id } = req.body;
        const foodItemDetails = await foodItem.findByPk(item_id ?? 1);
        return res.status(200).json({
            status: true, message: 'Item details fetched successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                foodItemDetails: {
                    menu_name: foodItemDetails.menu_name,
                    menu_img: foodItemDetails.menu_img,
                    description: foodItemDetails.description,
                    price: foodItemDetails.price,
                    delivery_type: "Free",
                    rating: 3.4,
                    delivery_time: 10
                }
            }
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get rest details
exports.getRestDetails = async (req, res) => {
    try {
        const { rest_id } = req.body;
        const restDetails = await Restaurant.findByPk(rest_id ?? 1);
        return res.status(200).json({
            status: true, message: 'Resturant details fetched successfully', data: {
                baseUrl: `${process.env.APP_URL}uploads/`,
                restDetails: {
                    title: restDetails.title,
                    rimg: restDetails.rimg,
                    sdesc: restDetails.sdesc,
                    delivery_type: "Free",
                    rating: 3.4,
                    delivery_time: 10
                }
            }
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add Favorite Item
exports.addFavoriteItem = async (req, res) => {
    const { user_id, item_id } = req.body;

    try {
        const favoriteItem = await FavoriteItem.create({ user_id, item_id });
        return res.status(200).json({
            status: true, message: 'Favorite Item Added Successfully', data: {
                favoriteItem
            }
        });
    } catch (error) {
        console.error('Error adding favorite item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add Favorite Restaurant
exports.addFavoriteRestaurant = async (req, res) => {
    const { user_id, rest_id } = req.body;

    try {
        const favoriteRestaurant = await FavoriteRestaurant.create({ user_id, rest_id });
        return res.status(200).json({
            status: true, message: 'Favorite Item Restaurant Successfully', data: {
                favoriteRestaurant
            }
        });
    } catch (error) {
        console.error('Error adding favorite restaurant:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

