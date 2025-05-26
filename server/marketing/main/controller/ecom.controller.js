
// const db = require("../../models/models");
// const Campaign = db.Campaign;
// const { Op } = require("sequelize");
// const { processWalletTransaction } = require('../../utils/walletUtils');

// const processEcomCampaign = async (req, res) => {
//   const { city, product_id } = req.body;
//   const module_type = 'ecom';

//   if (!product_id) {
//     return res.status(400).json({ message: "product_id is required" });
//   }

//   try {

//     const campaigns = await Campaign.findAll({
//       where: {
//         module_type,
//         product_id,
//         city: city 
//       },
//     });

//     const matchedCampaigns = [];
//     const walletUpdates = [];

//     for (const campaign of campaigns) {
//       matchedCampaigns.push(campaign.toJSON());

//       try {
//         const walletUpdate = await processWalletTransaction(campaign, null, null, product_id);
//         walletUpdates.push(walletUpdate);
//       } catch (error) {
//         return res.status(400).json({ message: error.message });
//       }
//     }

//     const isProductAvailable = matchedCampaigns.length > 0;

//     return res.status(200).json({
//       matchedCount: matchedCampaigns.length,
//       matchedCampaigns,
//       productAvailable: isProductAvailable,
//       walletUpdates: walletUpdates.length > 0 ? walletUpdates : null,
//       message: isProductAvailable
//         ? "Ecommerce product is available in the specified city and wallet has been updated"
//         : "Ecommerce product is not available in the specified city"
//     });
//   } catch (error) {
//     console.error("Error in ecomModule:", error);
//     return res.status(500).json({ message: "Something went wrong in ecom module", error: error.message });
//   }
// };

// module.exports = { processEcomCampaign };

