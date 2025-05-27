const db = require("../../models/models");
 const { WalletTransaction, VendorWallet, Vendor, VendorWalletPayments } = db;


const getWalletTransactionsByVendor = async (req, res) => {
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

    const transactions = await WalletTransaction.findAll({
      where: { vendor_id: vendorId }
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


const getAllVendorWalletPayments = async (req, res) => {
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
    
    const payments = await VendorWalletPayments.findAll({
      where: { vendor_id: vendorId }
    });
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No payments found for vendor`
      });
    }
    
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching vendor wallet payments:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// const createVendorWalletPayment = async (req, res) => {
//   try {
//     const userData = req.user;
    
//     if (!userData || !userData.vendor_id || !userData.module_type) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication failed: vendor information not available in token"
//       });
//     }

//     const {
//       recharge_amount,
//       gst,
//       payment_mode,
//       billing_address,
//       business_address
//     } = req.body;

//     // Validate required fields
//     if (!recharge_amount || !payment_mode || !billing_address || !business_address) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields"
//       });
//     }

//     try {
//       // Here you would integrate your payment gateway
//       // This is a placeholder for payment gateway integration
//       const paymentResult = await processPayment({
//         amount: recharge_amount,
//         vendorId: userData.vendor_id,
//         paymentMode: payment_mode
//       });

//       if (!paymentResult.success) {
//         return res.status(400).json({
//           success: false,
//           message: "Payment failed",
//           error: paymentResult.error
//         });
//       }

//       // If payment successful, create database entry
//       const payment = await VendorWalletPayments.create({
//         vendor_id: userData.vendor_id,
//         module_type: userData.module_type,
//         recharge_amount,
//         transaction_id: paymentResult.transactionId,
//         payment_mode,
//         billing_address: JSON.stringify(billing_address),
//         business_address: JSON.stringify(business_address),
//         gst,
//         created_at: new Date(),
//         updated_at: new Date()
//       });
      
//       res.status(200).json({
//         success: true,
//         message: "Payment processed successfully",
//         data: payment
//       });

//     } catch (paymentError) {
//       console.error('Payment processing error:', paymentError);
//       return res.status(400).json({
//         success: false,
//         message: "Payment processing failed",
//         error: paymentError.message
//       });
//     }

//   } catch (error) {
//     console.error('Error in wallet payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };



const createVendorWalletPayment = async (req, res) => {
  try {
    const userData = req.user;

    if (!userData || !userData.vendor_id || !userData.module_type) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: vendor information not available in token"
      });
    }

    const {
      recharge_amount,
      gst,
      payment_mode,
      billing_address,
      business_address
    } = req.body;

    // Validate required fields
    if (!recharge_amount || !payment_mode || !billing_address || !business_address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Simulate or call your actual payment gateway here
    const paymentResult = await processPayment({
      amount: recharge_amount,
      vendorId: userData.vendor_id,
      paymentMode: payment_mode
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
        error: paymentResult.error
      });
    }

    // Payment successful, record it in VendorWalletPayments
    const payment = await VendorWalletPayments.create({
      vendor_id: userData.vendor_id,
      module_type: userData.module_type,
      recharge_amount,
      transaction_id: paymentResult.transactionId,
      payment_mode,
      billing_address: JSON.stringify(billing_address),
      business_address: JSON.stringify(business_address),
      gst,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update or create VendorWallet
    const [wallet, created] = await VendorWallet.findOrCreate({
      where: {
        vendor_id: userData.vendor_id,
        module_type: userData.module_type
      },
      defaults: {
        walletAmount: 0.00,
        module_type: userData.module_type
      }
    });

    // Update wallet amount
    wallet.walletAmount = parseFloat(wallet.walletAmount) + parseFloat(recharge_amount);
    wallet.module_type = userData.module_type;
    await wallet.save();

    return res.status(200).json({
      success: true,
      message: "Wallet recharged and recorded successfully",
      data: {
        payment,
        wallet
      }
    });

  } catch (error) {
    console.error('Error in wallet payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};


// Helper function for payment processing (placeholder)
const processPayment = async ({ amount, vendorId, paymentMode }) => {
  // This is where you'll integrate your actual payment gateway
  // For now, returning a mock successful response
  return {
    success: true,
    transactionId: `TXN_${Date.now()}_${vendorId}`,
    message: "Payment processed successfully"
  };
};



module.exports = {
  getWalletTransactionsByVendor,
  getAllVendorWalletPayments,  
  createVendorWalletPayment
};