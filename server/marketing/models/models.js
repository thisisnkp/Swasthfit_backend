const Sequelize = require("sequelize");
const sequelize = require("../../../sequelize");

const User = require("../../user/user.model");
const Vendor = require("./vendor.model");
const Product = require("./product.model");
const Campaign = require("./campaign.model");
const Bid = require("./bidInfo.model");
const WalletTransaction = require("./walletTransaction.model");
const CampaignAnalysis = require("./campaignAnalysis.model");
const VendorWalletPayments = require("./walletRacharge.model")
const VendorWallet = require("./vendorWallet");
const foodItems = require("./Restaurants/foodItems.model")
const Gym = require("../../gym/gym_owners/gym.model");
const { DataTypes } = Sequelize;


// user to vendor
User.hasOne(Vendor, { foreignKey: "user_id" });
Vendor.belongsTo(User, { foreignKey: "user_id" });

// vendor to product
Vendor.hasMany(Product, { foreignKey: "vendor_id" });
Product.belongsTo(Vendor, { foreignKey: "vendor_id" });

// optional: user to product (via vendor_id)
User.hasMany(Product, { foreignKey: 'vendor_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'vendor_id', as: 'vendor' });

// vendor to campaign
Vendor.hasMany(Campaign, { foreignKey: 'vendor_id', as: 'campaigns' });
Campaign.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

// Product to campaign
Product.hasMany(Campaign, { foreignKey: 'product_id', as: 'campaigns' });
Campaign.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// campaign to bid - Fixed relationship
Campaign.hasMany(Bid, {
  foreignKey: 'campaign_id',
  as: 'bids'
});
Bid.belongsTo(Campaign, {
  foreignKey: 'campaign_id',
  as: 'campaign'
});

// Vendor to wallet transactions
Vendor.hasMany(WalletTransaction, { foreignKey: "vendor_id", as: "wallet_transactions" });
WalletTransaction.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

// Product to wallet transactions
Product.hasMany(WalletTransaction, {
  foreignKey: "product_id",
  as: "transactions"
});
WalletTransaction.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});

// campaign analysis
// campaign to campaign_stat
Campaign.hasOne(CampaignAnalysis, { foreignKey: 'campaign_id', as: 'stat' });
CampaignAnalysis.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// vendor to campaign_stat
Vendor.hasMany(CampaignAnalysis, { foreignKey: 'vendor_id', as: 'stats' });
CampaignAnalysis.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });


// wallet connect to transaction of walllet
Vendor.hasOne(VendorWalletPayments, { foreignKey: 'vendor_id', as: 'wallet' });
VendorWalletPayments.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });



// Add this to the db object
Vendor.hasOne(VendorWallet, { foreignKey: 'vendor_id', as: 'wallet_info' });
VendorWallet.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Vendor.hasMany(foodItems, { foreignKey: "vendor_id", as: "menu_items" });
foodItems.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

// Add relationships for Gym
Vendor.hasMany(Gym, { foreignKey: "owner_id", as: "gyms" });
Gym.belongsTo(Vendor, { foreignKey: "owner_id", as: "owner" });

// Product to campaign for each module type
// For ecom
Product.hasMany(Campaign, { 
  foreignKey: 'product_id',
  as: 'ecom_campaigns',
  constraints: false,
  scope: {
    module_type: 'ecom'
  }
});

// For restaurant
foodItems.hasMany(Campaign, { 
  foreignKey: 'product_id',
  as: 'restaurant_campaigns',
  constraints: false,
  scope: {
    module_type: 'restaurant'
  }
});

// For gym
Gym.hasMany(Campaign, { 
  foreignKey: 'product_id',
  as: 'gym_campaigns',
  constraints: false,
  scope: {
    module_type: 'gym'
  }
});

// Add this to the db object
const db = {
  sequelize,
  User,
  Vendor,
  Product,
  Campaign,
  Bid,
  WalletTransaction,
  CampaignAnalysis,
  VendorWalletPayments,
  VendorWallet,
  foodItems,  // Add Menu model
  Gym    // Add Gym model
};

module.exports = db;