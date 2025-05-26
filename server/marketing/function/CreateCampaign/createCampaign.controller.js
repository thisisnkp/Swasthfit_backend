const db = require("../../models/models.js");

const { Vendor, Campaign, Bid } = db;

const createCampaignHandler = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData);

    if (!userData || !userData.vendor_id) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication failed: vendor information not available in token",
      });
    }

    const vendorId = userData.vendor_id;
    const moduleType = userData.module_type;
    const campaignData = req.body;

    console.log("Received campaign data:", campaignData);
    console.log("Vendor ID from token:", vendorId);
    console.log("Module type from token:", moduleType);

    if (
      !campaignData.bid ||
      !Array.isArray(campaignData.bid) ||
      campaignData.bid.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one bid is required",
      });
    }

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const { bid, ...campaignOnly } = campaignData;

    const newCampaign = await Campaign.create({
      ...campaignOnly,
      vendor_id: vendorId,
      module_type: moduleType,
    });

    const createdBids = await Promise.all(
      campaignData.bid.map((bidData) => {
        return Bid.create({
          page: bidData.page,
          from: bidData.from,
          to: bidData.to,
          bid_amount: bidData.bid_amount,
          campaign_id: newCampaign.id,
        });
      })
    );

    res.status(201).json({
      success: true,
      message: "Campaign created successfully with bids",
      campaign: newCampaign,
      bids: createdBids,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  }
};

module.exports = { createCampaignHandler };
