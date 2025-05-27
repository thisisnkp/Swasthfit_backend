const { Op, Sequelize } = require("sequelize");
const Category = require("../models/FoodCategory");
const FoodItem = require("../models/FoodItem");
const ItemOffer = require("../models/ItemOffer");
const Restaurant = require("../models/Restaurant");
// const { v4: uuidv4 } = require("uuid");
const shortUUID = require("short-uuid");
// search api
exports.searchFoodItems = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    // Search for food items where menu_name or description matches the query
    const foodItems = await FoodItem.findAll({
      where: {
        [Op.or]: [
          { menu_name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: [
        "id",
        "menu_name",
        "description",
        "price",
        "menu_img",
        "is_veg",
      ],
    });

    return res.status(200).json({ message: "Search results", foodItems });
  } catch (error) {
    console.error("Error searching food items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get home data
exports.getHomeData = async (req, res) => {
  try {
    const { query } = req.query;

    // Generate short unique IDs
    const categoryId = shortUUID.generate();
    const offerId = shortUUID.generate();
    const foodItemsId = shortUUID.generate();
    const searchId = shortUUID.generate();

    const baseUrl = `${process.env.APP_URL}/uploads/`;

    // Fetch all food items
    let allFoodItems = await FoodItem.findAll({
      attributes: ["id", "menu_img", "menu_name", "rating", "distance"],
    });

    allFoodItems = allFoodItems.map((item) => ({
      ...item.toJSON(),
      menu_img: item.menu_img ? `${baseUrl}${item.menu_img}` : null,
    }));

    // Search functionality
    let searchResults = [];
    if (query) {
      const results = await FoodItem.findAll({
        where: {
          [Op.or]: [
            { menu_name: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        },
        attributes: [
          "id",
          "menu_name",
          "price",
          "menu_img",
          "rating",
          "distance",
        ],
      });

      searchResults = results.map((item) => ({
        ...item.toJSON(),
        menu_img: item.menu_img ? `${baseUrl}${item.menu_img}` : null,
      }));
    }

    // Fetch latest offers (Only image)
    let offers = await ItemOffer.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["image"],
    });

    offers = offers.map((offer) => ({
      ...offer.toJSON(),
      image: offer.image ? `${baseUrl}${offer.image}` : null,
    }));

    // Fetch categories (Only name and img)
    let categories = await Category.findAll({
      attributes: ["name", "img"],
    });

    categories = categories.map((cat) => ({
      ...cat.toJSON(),
      img: cat.img ? `${baseUrl}${cat.img}` : null,
    }));

    // Construct response
    const response = {
      AllSection: {
        categories: { id: categoryId, name: "Categories" },
        offers: { id: offerId, name: "Offers" },
        foodItems: { id: foodItemsId, name: "Food Items" },
        search: { id: searchId, name: "Search Results" },
      },
      data: {
        categories: {
          id: categoryId,
          data: categories,
        },
        offers: {
          id: offerId,
          data: offers,
        },
        foodItems: {
          id: foodItemsId,
          baseUrl,
          allFoodItems,
        },
        search: {
          id: searchId,
          query,
          totalResults: searchResults.length,
          results: searchResults,
        },
      },
    };

    return res.status(200).json({
      status: true,
      message: "Home data retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//  Custom Suggestion Logic - embedded in same file
const customSearchSuggestion = async (query, count = 5) => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("burger")) {
    // Simulated result (in real case you'd fetch from DB/model)
    const suggestionItems = Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      menu_name: `Suggested Veg Burger ${i + 1}`,
      description: "burger",
      price: 120 + i,
      menu_img: `suggested_burger_${i + 1}.jpg`,
      is_veg: true,
    }));

    return {
      suggestion: "You might be looking for burger items",
      category: "Veg Burger",
      items: suggestionItems,
    };
  }

  if (lowerQuery.includes("protein")) {
    const suggestionItems = Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      menu_name: `Suggested Protein Dish ${i + 1}`,
      description: "high protein item",
      price: 150 + i,
      menu_img: `protein_dish_${i + 1}.jpg`,
      is_veg: false,
    }));

    return {
      suggestion: "You might be interested in high-protein food",
      category: "Protein Rich",
      items: suggestionItems,
    };
  }

  return null;
};

//  Main Controller
exports.searchFoodItems = async (req, res) => {
  try {
    const { query, count } = req.query;
    const limit = parseInt(count) || 10;

    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    // Check suggestion logic
    const customResult = await customSearchSuggestion(query, limit);

    // Search food items in DB
    const foodItems = await FoodItem.findAll({
      where: {
        [Op.or]: [
          { menu_name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: [
        "id",
        "menu_name",
        "description",
        "price",
        "menu_img",
        "is_veg",
      ],
      limit, // apply count here
    });

    return res.status(200).json({
      message: customResult
        ? "Search results with suggestions"
        : "Search results",
      ...(customResult && { customResult }),
      foodItems,
    });
  } catch (error) {
    console.error("Error searching food items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

