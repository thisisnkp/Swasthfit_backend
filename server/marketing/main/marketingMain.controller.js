const db = require("../models/models");
const Campaign = db.Campaign;
const WalletTransaction = db.WalletTransaction;
const Bid = db.Bid;
const VendorWallet = db.VendorWallet;
const foodItems = db.foodItems; // For restaurant module (fooditems table)
const Product = db.Product; // For ecom module
const Gym = db.Gym; // For gym module
const { Op } = require("sequelize");
const axios = require("axios");

const toRadians = (deg) => (deg * Math.PI) / 180;

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Function to get city from coordinates using reverse geocoding
const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
    );
    
    if (response.data && response.data.address) {
      return response.data.address.city || 
             response.data.address.town || 
             response.data.address.village || 
             response.data.address.county ||
             null;
    }
    return null;
  } catch (error) {
    console.error("Error getting city from coordinates:", error);
    return null;
  }
};

// Function to search products by name in the appropriate module
const searchProductsByName = async (module_type, productName) => {
  try {
    let products = [];
    const searchTerm = `%${productName}%`; // For partial matching with LIKE

    switch(module_type) {
      case 'ecom':
        products = await Product.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: searchTerm } },
              { short_name: { [Op.like]: searchTerm } }
            ]
          },
          limit: 10  // Limit results to avoid excessive matches
        });
        break;
        
      case 'restaurant':  // Note the spelling matches your code
        products = await foodItems.findAll({
          where: {
            [Op.or]: [
              { menu_name: { [Op.like]: searchTerm } },
              { description: { [Op.like]: searchTerm } }
            ]
          },
          limit: 10
        });
        break;
        
      case 'gym':
        products = await Gym.findAll({
          where: {
            gym_name: { [Op.like]: searchTerm }
          },
          limit: 10
        });
        break;
        
      default:
        return [];
    }
    
    return products;
  } catch (error) {
    console.error(`Error searching products by name for ${module_type}:`, error);
    return [];
  }
};

// Function to get product details by ID from the appropriate module
const getProductById = async (module_type, productId) => {
  try {
    let product = null;
    
    switch(module_type) {
      case 'ecom':
        product = await Product.findByPk(productId);
        break;
        
      case 'restaurant':
        product = await foodItems.findByPk(productId);
        break;
        
      case 'gym':
        product = await Gym.findByPk(productId);
        break;
        
      default:
        return null;
    }
    
    if (!product) {
      console.log(`No ${module_type} product found with ID: ${productId}`);
    }
    
    return product;
  } catch (error) {
    console.error(`Error getting product by ID for ${module_type}:`, error);
    return null;
  }
};

const checkCampaignInRadius = async (req, res) => {
  const { latitude, longitude, product_name, module_type, product_id } = req.body;

  if (!module_type) {
    return res.status(400).json({ message: "module_type is required" });
  }

  const validModuleTypes = ['ecom', 'gym', 'restaurant'];
  if (!validModuleTypes.includes(module_type)) {
    return res.status(400).json({ message: "Invalid module_type. Must be one of: ecom, gym, restaurant" });
  }

  // Check if either product_name or product_id is provided
  if (!product_name && !product_id) {
    return res.status(400).json({ message: "Either product_name or product_id is required" });
  }

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    let productIds = [];
    let searchedProducts = [];
    
    // If product_name is provided, search by name
    if (product_name) {
      searchedProducts = await searchProductsByName(module_type, product_name);
      
      if (searchedProducts.length === 0) {
        return res.status(404).json({ 
          message: `No ${module_type} products found matching '${product_name}'`, 
          productFound: false 
        });
      }
      
      productIds = searchedProducts.map(product => product.id);
    } else {
      // If only product_id is provided, use it directly
      productIds = [product_id];
    }

    let campaigns;
    let city = null;

    // Special handling for ecom module - get city and search by city
    if (module_type === 'ecom') {
      city = await getCityFromCoordinates(latitude, longitude);
      
      if (city) {
        console.log(`Detected city for ecom module: ${city}`);
        
        // Search campaigns by city and product_id
        campaigns = await Campaign.findAll({
          where: {
            module_type,
            product_id: { [Op.in]: productIds },
            city: city
          },
        });
      } else {
        // If city detection fails, fall back to radius search
        console.log("City detection failed, falling back to radius search");
        campaigns = await Campaign.findAll({
          where: {
            module_type,
            product_id: { [Op.in]: productIds },
            latitude: { [Op.ne]: null },
            longitude: { [Op.ne]: null },
            radius: { [Op.ne]: null }
          },
        });
      }
    } else {
      // For non-ecom modules, use the original radius search
      campaigns = await Campaign.findAll({
        where: {
          module_type,
          product_id: { [Op.in]: productIds },
          latitude: { [Op.ne]: null },
          longitude: { [Op.ne]: null },
          radius: { [Op.ne]: null }
        },
      });
    }

    const matchedCampaigns = [];
    const walletUpdates = [];
    
    // Collect all unique product IDs from matched campaigns for batch fetching
    const campaignProductIds = [...new Set(campaigns.map(campaign => campaign.product_id))];
    const productDetailsMap = {};
    
    // Fetch product details for all campaign product IDs in one go
    for (const prodId of campaignProductIds) {
      const product = await getProductById(module_type, prodId);
      if (product) {
        productDetailsMap[prodId] = product;
      }
    }

    for (const campaign of campaigns) {
      let isMatch = false;
      let distance = null;
      
      if (module_type === 'ecom' && city) {
        // For ecom with city, we already matched by city in the query
        isMatch = true;
      } else {
        // For other modules or if city detection failed, calculate distance
        distance = getDistanceInMeters(
          latitude,
          longitude,
          parseFloat(campaign.latitude),
          parseFloat(campaign.longitude)
        );
        
        isMatch = distance <= campaign.radius;
      }

      if (isMatch) {
        // Get the product details from our map
        const productDetail = productDetailsMap[campaign.product_id] || null;

        // Add product details to the campaign object
        const campaignWithDetails = { 
          ...campaign.toJSON(), 
          distance,
          matchedByCity: module_type === 'ecom' && city ? true : false,
          productDetails: productDetail ? formatProductDetails(module_type, productDetail) : null
        };
        
        matchedCampaigns.push(campaignWithDetails);

        const vendor_id = campaign.vendor_id;
        const campaign_id = campaign.id;

        const bid = await Bid.findOne({
          where: { campaign_id },
          order: [['created_at', 'DESC']]
        });

        const bidAmount = bid ? parseFloat(bid.bid_amount) : 0;

        const wallet = await VendorWallet.findOne({
          where: { vendor_id }
        });

        if (!wallet) {
          return res.status(404).json({ message: `Vendor wallet not found for vendor ${vendor_id}.` });
        }

        if (wallet.walletAmount < bidAmount) {
          return res.status(400).json({ 
            message: `Insufficient wallet balance for vendor ${vendor_id}.`,
            walletAmount: wallet.walletAmount,
            requiredAmount: bidAmount
          });
        }

        const today = new Date().toISOString().slice(0, 10); 

        const existingTransaction = await WalletTransaction.findOne({
          where: {
            vendor_id,
            product_id: campaign.product_id,
            date: today
          }
        });

        if (!existingTransaction) {
          await WalletTransaction.create({
            vendor_id,
            product_id: campaign.product_id,
            reach: 1,
            cost: bidAmount,
            date: today
          });
        } else {
          const newReach = existingTransaction.reach + 1;
          const newCost = parseFloat(existingTransaction.cost) + parseFloat(bidAmount);

          await existingTransaction.update({
            reach: newReach,
            cost: newCost
          });
        }

        wallet.walletAmount = parseFloat(wallet.walletAmount) - parseFloat(bidAmount);
        await wallet.save();

        walletUpdates.push({
          vendor_id,
          deducted: bidAmount,
          newBalance: wallet.walletAmount
        });
      }
    }

    const isProductAvailable = matchedCampaigns.length > 0;

    return res.status(200).json({
      matchedCount: matchedCampaigns.length,
      matchedCampaigns,
      detectedCity: city,
      searchedProducts: product_name ? formatSearchedProducts(module_type, searchedProducts) : null,
      productAvailable: isProductAvailable,
      walletUpdates: walletUpdates.length > 0 ? walletUpdates : null,
      message: isProductAvailable
        ? "Product is available in the specified area and wallet has been updated"
        : "Product is not available in the specified area"
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Format product details based on module type
const formatProductDetails = (module_type, product) => {
  switch(module_type) {
    case 'ecom':
      return {
        id: product.id,
        name: product.name,
        short_name: product.short_name,
        price: product.price,
        offer_price: product.offer_price,
        image: product.thumb_image,
        description: product.short_description,
        category_id: product.category_id,
        vendor_id: product.vendor_id
      };
      
    case 'restaurant':
      return {
        id: product.id,
        name: product.menu_name,
        price: product.price,
        description: product.description,
        image: product.menu_img,
        is_veg: product.is_veg,
        is_recommended: product.is_recommended,
        rating: product.rating,
        restaurant_id: product.restaurant_id,
        vendor_id: product.vendor_id
      };
      
    case 'gym':
      return {
        id: product.id,
        name: product.gym_name,
        address: product.gym_address,
        logo: product.gym_logo,
        facilities: product.facilities,
        about: product.about_us,
        ratings: product.ratings,
        owner_id: product.owner_id
      };
      
    default:
      return product;
  }
};

// Format searched products for response
const formatSearchedProducts = (module_type, products) => {
  return products.map(product => formatProductDetails(module_type, product));
};

module.exports = { checkCampaignInRadius };