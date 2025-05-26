const db = require("../models/models");
const Campaign = db.Campaign;
const WalletTransaction = db.WalletTransaction;
const Bid = db.Bid;
const VendorWallet = db.VendorWallet;
const { Op } = require("sequelize");
const axios = require("axios");

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

const trackUserAction = async (req, res) => {
  const { latitude, longitude, module_type, product_id, action } = req.body;

  if (!module_type) {
    return res.status(400).json({ message: "module_type is required" });
  }

  const validModuleTypes = ['ecom', 'gym', 'restaurant'];
  if (!validModuleTypes.includes(module_type)) {
    return res.status(400).json({ 
      message: "Invalid module_type. Must be one of: ecom, gym, restaurant" 
    });
  }

  if (!product_id) {
    return res.status(400).json({ message: "product_id is required" });
  }

  if (!action) {
    return res.status(400).json({ message: "action is required" });
  }

  const validActions = ['single-view', 'add-to-cart', 'add-to-wish-list', 'buy'];
  if (!validActions.includes(action)) {
    return res.status(400).json({ 
      message: "Invalid action. Must be one of: single-view, add-to-cart, add-to-wish-list, buy" 
    });
  }

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    let campaigns;
    let city = null;

    if (module_type === 'ecom') {
      city = await getCityFromCoordinates(latitude, longitude);
      
      if (city) {
        console.log(`Detected city for ecom module: ${city}`);
        
        campaigns = await Campaign.findAll({
          where: {
            module_type,
            product_id,
            city
          },
        });
      } else {
        console.log("City detection failed, falling back to radius search");
        campaigns = await Campaign.findAll({
          where: {
            module_type,
            product_id,
            latitude: { [Op.ne]: null },
            longitude: { [Op.ne]: null },
            radius: { [Op.ne]: null }
          },
        });
      }
    } else {
      campaigns = await Campaign.findAll({
        where: {
          module_type,
          product_id,
          latitude: { [Op.ne]: null },
          longitude: { [Op.ne]: null },
          radius: { [Op.ne]: null }
        },
      });
    }

    if (campaigns.length === 0) {
      return res.status(404).json({ 
        message: "No campaigns found matching the criteria",
        campaignFound: false
      });
    }

    const matchedCampaigns = [];
    const walletUpdates = [];

    for (const campaign of campaigns) {
      let isMatch = false;
      let distance = null;
      
      if (module_type === 'ecom' && city) {
        isMatch = true;
      } else {
        distance = getDistanceInMeters(
          latitude,
          longitude,
          parseFloat(campaign.latitude),
          parseFloat(campaign.longitude)
        );
        
        isMatch = distance <= campaign.radius;
      }

      if (isMatch) {
        matchedCampaigns.push({
          ...campaign.toJSON(),
          distance,
          matchedByCity: module_type === 'ecom' && city ? true : false
        });

        const vendor_id = campaign.vendor_id;
        const campaign_id = campaign.id;

        const bid = await Bid.findOne({
          where: { campaign_id },
          order: [['created_at', 'DESC']]
        });

        if (!bid) {
          console.log(`No bid found for campaign ${campaign_id}`);
          continue;
        }

        const bidAmount = parseFloat(bid.bid_amount);

        const wallet = await VendorWallet.findOne({
          where: { vendor_id }
        });

        if (!wallet) {
          console.log(`Vendor wallet not found for vendor ${vendor_id}`);
          continue;
        }

        if (wallet.walletAmount < bidAmount) {
          console.log(`Insufficient wallet balance for vendor ${vendor_id}`);
          continue;
        }

        const today = new Date().toISOString().slice(0, 10);

        let transaction = await WalletTransaction.findOne({
          where: {
            vendor_id,
            product_id,
            date: today
          }
        });

        let newClick = 0;
        let newConversion = 0;

        if (action === 'buy') {
          newConversion = 1;
        } else if (['single-view', 'add-to-cart', 'add-to-wish-list'].includes(action)) {
          newClick = 1;
        }

        if (!transaction) {
          transaction = await WalletTransaction.create({
            vendor_id,
            product_id,
            module_type,
            date: today,
            reach: 0,
            click: newClick,
            conversion: newConversion,
            cost: bidAmount
          });
        } else {
          const updateValues = {};
          
          if (newClick > 0) {
            updateValues.click = transaction.click + newClick;
          }
          
          if (newConversion > 0) {
            updateValues.conversion = transaction.conversion + newConversion;
          }
          
          updateValues.cost = parseFloat(transaction.cost) + parseFloat(bidAmount);
          
          await transaction.update(updateValues);
        }

        const newWalletAmount = parseFloat(wallet.walletAmount) - bidAmount;
        await wallet.update({
          walletAmount: newWalletAmount
        });

        walletUpdates.push({
          vendor_id,
          deducted: bidAmount,
          newBalance: newWalletAmount,
          action,
          updated: {
            click: newClick > 0 ? '+1' : 0,
            conversion: newConversion > 0 ? '+1' : 0,
            reach: 0
          }
        });
      }
    }

    if (walletUpdates.length === 0) {
      return res.status(404).json({
        message: "No matching campaigns found in radius or eligible for update",
        campaignFound: false
      });
    }

    return res.status(200).json({
      success: true,
      matchedCount: matchedCampaigns.length,
      detectedCity: city,
      action,
      walletUpdates,
      message: `Successfully processed ${action} action and updated wallet transactions`
    });

  } catch (error) {
    console.error("Error in trackUserAction:", error);
    return res.status(500).json({ 
      message: "Something went wrong", 
      error: error.message 
    });
  }
};

module.exports = { trackUserAction };