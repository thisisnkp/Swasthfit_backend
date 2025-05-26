const db = require("../../models/models"); 
const { WalletTransaction, VendorWallet, Vendor, VendorWalletPayments } = db;

const deductFromWallet = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData); // Debug log
    
    if (!userData || !userData.vendor_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: vendor information not available in token"
      });
    }
    
    const vendorId = userData.vendor_id;
    console.log("Vendor ID from token:", vendorId);

    const today = new Date().toISOString().split('T')[0];

    // 🔍 Step 1: Sum all transaction costs for today for this vendor
    const transactions = await WalletTransaction.findAll({
      where: {
        vendor_id: vendorId,
        date: today
      }
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No transactions found for today.' 
      });
    }

    const totalCostToDeduct = transactions.reduce((acc, txn) => acc + parseFloat(txn.cost), 0);

    // 🔍 Step 2: Get the vendor's wallet
    const wallet = await VendorWallet.findOne({
      where: { vendor_id: vendorId }
    });

    if (!wallet) {
      return res.status(404).json({ 
        success: false,
        message: 'Vendor wallet not found.' 
      });
    }

    if (wallet.walletAmount < totalCostToDeduct) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient wallet balance.' 
      });
    }

    // 💰 Step 3: Deduct total cost and update wallet
    wallet.walletAmount -= totalCostToDeduct;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet updated successfully.',
      deducted: totalCostToDeduct,
      remaining: wallet.walletAmount
    });

  } catch (error) {
    console.error('Error deducting wallet amount:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error.',
      error: error.message
    });
  }
};

const rechargeVendorWallet = async (req, res) => {
  try {
    const userData = req.user;
    console.log("User data from JWT:", userData); 
    
    if (!userData || !userData.vendor_id || !userData.module_type) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: vendor information or module type not available in token"
      });
    }
    
    const vendor_id = userData.vendor_id;
    const module_type = userData.module_type;
    const {
      recharge_amount,
      transaction_id,
      payment_mode
    } = req.body;

    // Make sure to include module_type explicitly in the create call
    const payment = await VendorWalletPayments.create({
      vendor_id,
      module_type, // Explicitly including module_type from JWT
      recharge_amount,
      transaction_id,
      payment_mode
    });

    const [wallet, created] = await VendorWallet.findOrCreate({
      where: { 
        vendor_id,
        module_type  // Using module_type from JWT for lookup
      },
      defaults: { 
        walletAmount: 0.00,
        module_type  // Important: Also set module_type in defaults
      }
    });

    wallet.walletAmount = parseFloat(wallet.walletAmount) + parseFloat(recharge_amount);
    
    // Ensure module_type is set before saving
    wallet.module_type = module_type;
    
    await wallet.save();
    console.log(wallet);

    return res.status(201).json({
      success: true,
      message: 'Wallet recharged successfully',
      payment,
      wallet
    });
  } catch (error) {
    console.error('Recharge Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  deductFromWallet,
  rechargeVendorWallet
};