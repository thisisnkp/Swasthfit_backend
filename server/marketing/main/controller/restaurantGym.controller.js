
// const db = require("../../models/models");
// const Campaign = db.Campaign;
// const { Op } = require("sequelize");
// const { getDistanceInMeters } = require('../../utils/geoUtils');
// const { processWalletTransaction } = require('../../utils/walletUtils');

// const processLocationBasedCampaign = async (req, res) => {
//   const { latitude, longitude, product_id, module_type } = req.body;
  
//   if (!product_id) {
//     return res.status(400).json({ message: "product_id is required" });
//   }

//   try {
//     const campaigns = await Campaign.findAll({
//       where: {
//         module_type, 
//         product_id,
//         latitude: { [Op.ne]: null },
//         longitude: { [Op.ne]: null },
//         radius: { [Op.ne]: null }
//       },
//     });

//     const matchedCampaigns = [];
//     const walletUpdates = [];

//     for (const campaign of campaigns) {
//       const distance = getDistanceInMeters(
//         latitude,
//         longitude,
//         parseFloat(campaign.latitude),
//         parseFloat(campaign.longitude)
//       );

//       if (distance <= campaign.radius) {
//         matchedCampaigns.push({ ...campaign.toJSON(), distance });

//         try {
//           const walletUpdate = await processWalletTransaction(campaign, latitude, longitude, product_id);
//           walletUpdates.push(walletUpdate);
//         } catch (error) {
//           return res.status(400).json({ message: error.message });
//         }
//       }
//     }

//     const isProductAvailable = matchedCampaigns.length > 0;
    

//     const moduleTypeDisplay = module_type === 'restorant' ? 'restaurant' : 'Gym';

//     return res.status(200).json({
//       matchedCount: matchedCampaigns.length,
//       matchedCampaigns,
//       productAvailable: isProductAvailable,
//       walletUpdates: walletUpdates.length > 0 ? walletUpdates : null,
//       message: isProductAvailable
//         ? `${moduleTypeDisplay} service is available in the specified area and wallet has been updated`
//         : `${moduleTypeDisplay} service is not available in the specified area`
//     });
//   } catch (error) {
//     console.error(`Error in ${req.body.module_type}Module:`, error);
//     return res.status(500).json({ 
//       message: `Something went wrong in ${req.body.module_type} module`, 
//       error: error.message 
//     });
//   }
// };

// module.exports = { processLocationBasedCampaign };