const db = require('../../models/models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

exports.getVendorAnalytics = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData); // Debug log

    if (!userData || !userData.vendor_id) {
      return res.status(400).json({ 
        success: false,
        message: "Vendor ID missing in token" 
      });
    }

    const vendorId = userData.vendor_id;
    const moduleType = userData.module_type;

    if (!moduleType) {
      return res.status(400).json({
        success: false,
        message: "Module type is required (ecom, restaurant, or gym)"
      });
    }

    const walletInfo = await db.VendorWallet.findOne({
      where: { 
        vendor_id: vendorId,
        module_type: moduleType
      }
    });

    if (!walletInfo) {
      return res.status(404).json({
        success: false,
        message: "Wallet information not found for this vendor and module type"
      });
    }

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    const todayTransactions = await db.WalletTransaction.findAll({
      where: {
        vendor_id: vendorId,
        date: formattedToday
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('reach')), 'total_reach'],
        [Sequelize.fn('SUM', Sequelize.col('conversion')), 'total_conversion'],
        [Sequelize.fn('SUM', Sequelize.col('click')), 'total_clicks'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost']
      ],
      raw: true
    });

    const allTimeTransactions = await db.WalletTransaction.findAll({
      where: {
        vendor_id: vendorId
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('reach')), 'total_reach'],
        [Sequelize.fn('SUM', Sequelize.col('conversion')), 'total_conversion'],
        [Sequelize.fn('SUM', Sequelize.col('click')), 'total_clicks'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'total_cost']
      ],
      raw: true
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];

    const dailyTransactions = await db.WalletTransaction.findAll({
      where: {
        vendor_id: vendorId,
        date: {
          [Op.between]: [formattedThirtyDaysAgo, formattedToday]
        }
      },
      attributes: [
        'date',
        [Sequelize.fn('SUM', Sequelize.col('reach')), 'daily_reach'],
        [Sequelize.fn('SUM', Sequelize.col('conversion')), 'daily_conversion'],
        [Sequelize.fn('SUM', Sequelize.col('click')), 'daily_clicks'],
        [Sequelize.fn('SUM', Sequelize.col('cost')), 'daily_cost']
      ],
      group: ['date'],
      order: [['date', 'ASC']],
      raw: true
    });

    // 🔥 Fetch recharge payment data
    const rechargePayments = await db.VendorWalletPayments.findAll({
      where: { vendor_id: vendorId },
      order: [['created_at', 'DESC']] // optional: show latest first
    });

    return res.status(200).json({
      success: true,
      data: {
        wallet_balance: walletInfo.walletAmount || 0,
        module_type: moduleType,
        today_stats: {
          reach: todayTransactions[0]?.total_reach || 0,
          conversion: todayTransactions[0]?.total_conversion || 0,
          clicks: todayTransactions[0]?.total_clicks || 0,
          cost: todayTransactions[0]?.total_cost || 0
        },
        all_time_stats: {
          reach: allTimeTransactions[0]?.total_reach || 0,
          conversion: allTimeTransactions[0]?.total_conversion || 0,
          clicks: allTimeTransactions[0]?.total_clicks || 0,
          cost: allTimeTransactions[0]?.total_cost || 0
        },
        daily_transactions: dailyTransactions,
        recharge_history: rechargePayments // 💸 Recharge payments added here
      }
    });

  } catch (error) {
    console.error("Error fetching vendor analytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Keep the other existing functions in the file
exports.analyzeVendorData = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    
    if (!vendor_id) {
      return res.status(400).json({ success: false, message: 'Vendor ID is required' });
    }

    // Get all campaign analysis data for the vendor
    const campaignStats = await db.CampaignAnalysis.findAll({
      where: { vendor_id },
      include: [
        {
          model: db.Campaign,
          as: 'campaign',
          attributes: ['id', 'product_id']
        }
      ]
    });

    if (!campaignStats || campaignStats.length === 0) {
      return res.status(404).json({ success: false, message: 'No campaign data found for this vendor' });
    }

    const results = [];

    // Process each campaign's data
    for (const stat of campaignStats) {
      const campaign_id = stat.campaign_id;
      const product_id = stat.campaign?.product_id;
      
      if (!product_id) {
        console.log(`Missing product_id for campaign ${campaign_id}`);
        continue;
      }

      // Get all bids for this campaign
      const bids = await db.Bid.findAll({
        where: { campaign_id }
      });

      // Calculate total bid amount
      let totalBidAmount = 0;
      if (bids && bids.length > 0) {
        totalBidAmount = bids.reduce((sum, bid) => sum + parseFloat(bid.bid_amount), 0);
      }

      // Calculate cost (total bid amount * reach)
      const reach = stat.reach || 0;
      const cost = totalBidAmount * reach;

      // Create wallet transaction
      const transaction = await db.WalletTransaction.create({
        vendor_id,
        product_id,
        reach,
        click: stat.click || 0,
        conversion: stat.conversion || 0,
        cost
      });

      results.push({
        transaction_id: transaction.id,
        campaign_id,
        product_id,
        reach,
        click: stat.click || 0,
        conversion: stat.conversion || 0,
        total_bid_amount: totalBidAmount,
        cost
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor data analyzed and wallet transactions created successfully',
      data: results
    });
  } catch (error) {
    console.error('Error in analyzeVendorData:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while analyzing vendor data',
      error: error.message
    });
  }
};

exports.getVendorWalletTransactions = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    
    if (!vendor_id) {
      return res.status(400).json({ success: false, message: 'Vendor ID is required' });
    }

    const transactions = await db.WalletTransaction.findAll({
      where: { vendor_id },
      include: [
        {
          model: db.Vendor,
          as: 'vendor',
          attributes: ['id', 'user_id']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error in getVendorWalletTransactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet transactions',
      error: error.message
    });
  }
};