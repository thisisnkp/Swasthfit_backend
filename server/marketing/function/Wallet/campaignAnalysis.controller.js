

// const { Campaign, CampaignAnalysis } = require("../../models/models");

// const updateCampaignAnalysiss = async (req, res) => {
//   const { campaign_id } = req.params;

//   if (!campaign_id) {
//     return res.status(400).json({ message: "campaign_id is required in URL" });
//   }

//   try {
//     // 1. Get the campaign to extract vendor_id
//     const campaign = await Campaign.findOne({ where: { id: campaign_id } });

//     if (!campaign) {
//       return res.status(404).json({ message: "Campaign not found" });
//     }

//     const vendor_id = campaign.vendor_id;

//     // 2. Find existing campaign stat
//     let stat = await CampaignAnalysis.findOne({ where: { campaign_id } });

//     if (!stat) {
//       // 3. Create new stat record
//       stat = await CampaignAnalysis.create({
//         campaign_id,
//         vendor_id,
//         click: 1,
//         reach: 1,
//         conversion: 1,
//       });
//     } else {
//       // 4. Increment stats
//       stat.click += 1;
//       stat.reach += 1;
//       stat.conversion += 1;
//       await stat.save();
//     }

//     return res.status(200).json({ message: "Stats updated", data: stat });

//   } catch (error) {
//     console.error("Error updating campaign stats:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { updateCampaignAnalysiss };

const { Campaign, Bid, WalletTransaction } = require("../../models/models");

const updateCampaignAnalysiss = async (req, res) => {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res.status(400).json({ message: "campaign_id is required in URL" });
  }

  try {

    const campaign = await Campaign.findOne({ where: { id: campaign_id } });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const vendor_id = campaign.vendor_id;
    const product_id = campaign.product_id;


    const today = new Date().toISOString().slice(0, 10);

    const bids = await Bid.findAll({ where: { campaign_id } });

    let totalBidAmount = 0;
    if (bids && bids.length > 0) {
      totalBidAmount = bids.reduce((sum, bid) => sum + parseFloat(bid.bid_amount), 0);
    }

    const clickIncrement = 1;
    const reachIncrement = 1;
    const conversionIncrement = 1;

    const costIncrement = totalBidAmount * reachIncrement;

    let transaction = await WalletTransaction.findOne({
      where: {
        vendor_id,
        product_id,
        date: today,
      },
    });

    if (!transaction) {
      transaction = await WalletTransaction.create({
        vendor_id,
        product_id,
        date: today,
        click: clickIncrement,
        reach: reachIncrement,
        conversion: conversionIncrement,
        cost: costIncrement,
      });
    } else {
      transaction.click += clickIncrement;
      transaction.reach += reachIncrement;
      transaction.conversion += conversionIncrement;
      transaction.cost = parseFloat(transaction.cost || 0) + parseFloat(costIncrement);

      await transaction.save();
    }

    return res.status(200).json({
      message: "Wallet transaction updated with cost based on bid amount",
      data: {
        transaction_id: transaction.id,
        vendor_id,
        product_id,
        reach: transaction.reach,
        click: transaction.click,
        conversion: transaction.conversion,
        total_bid_amount: totalBidAmount,
        cost: transaction.cost,
      },
    });

  } catch (error) {
    console.error("Error updating wallet transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateCampaignAnalysiss };




