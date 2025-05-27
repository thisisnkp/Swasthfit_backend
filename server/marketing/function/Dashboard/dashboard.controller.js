const db = require("../../models/models");
const { WalletTransaction } = db;
const { Op } = require('sequelize');


const getWalletAnalytics = async (req, res) => {
  try {
    const userData = req.user;

    
    if (!userData || !userData.vendor_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: vendor information not available in token"
      });
    }
    
    const vendorId = userData.vendor_id;
    
    const today = new Date().toISOString().split('T')[0];
    
    const transactions = await WalletTransaction.findAll({
      where: { 
        vendor_id: vendorId
      },
    });
    
    const totalReach = transactions.reduce((sum, t) => sum + t.reach, 0);
    const totalClicks = transactions.reduce((sum, t) => sum + t.click, 0);
    const totalConversions = transactions.reduce((sum, t) => sum + t.conversion, 0);
    const totalCost = transactions.reduce((sum, t) => sum + parseFloat(t.cost), 0).toFixed(2);
    
    let sales;
    if (totalConversions < 50) {
      sales = totalConversions + 50;
    } else if (totalConversions < 100) {
      sales = totalConversions + 100;
    } else if (totalConversions >= 200) {
      sales = totalConversions + 200;
    } else {
      sales = totalConversions;
    }
    
    const newUsers = totalClicks * 2;
    
    const todayTransactions = transactions.filter(t => t.date === today);
    const newOrders = todayTransactions.reduce((sum, t) => sum + t.conversion, 0);
    
    const analyticsData = {
      totalReach,
      totalClicks,
      totalConversions,
      totalCost,
      enhancedMetrics: {
        sales,
        newUsers,
        newOrders
      }
    };
    
    res.status(200).json({
      success: true,
      data: analyticsData
    });
    
  } catch (error) {
    console.error("Error fetching wallet analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getWalletAnalytics
};