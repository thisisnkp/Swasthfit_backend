const Campaign = require('../../models/campaign.model');

const getVendorCampaignsByModuleType = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData);
    
    if (!userData || !userData.vendor_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: vendor information not available in token"
      });
    }
    
    const vendorId = userData.vendor_id;
    const module_type = userData.module_type;
   
    console.log('Received module type:', module_type);
    
    if (!module_type) {
      return res.status(400).json({
        success: false,
        message: "module_type parameter is required"
      });
    }
    
    const whereClause = { 
      vendor_id: vendorId,
      module_type: module_type
    };
    
    const campaigns = await Campaign.findAll({
      where: whereClause
    });
    
    const campaignCount = campaigns.length;
    
    if (campaignCount === 0) {
      return res.status(404).json({
        success: false,
        message: `No campaigns found for vendor with module type: ${module_type}`
      });
    }
    
    res.status(200).json({
      success: true,
      count: campaignCount,
      data: campaigns,
    });
  } catch (error) {
    console.error('Error fetching vendor campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getVendorCampaignsByModuleType
};