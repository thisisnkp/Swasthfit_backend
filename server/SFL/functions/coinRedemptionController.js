const ProductPricing = require("../models/ProductPricing");
const Transaction = require("../models/coinTransaction");
const Gullak = require("../models/gullak");
const CoinCalculator = require("../services/coinCalculator");

const calculatePricing = async (req, res) => {
  try {
    const { product_id, purchase_price, mrp, business_category } = req.body;

    if (!product_id || !purchase_price || !business_category) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["product_id", "purchase_price", "business_category"],
      });
    }

    // Calculate reward margin based on business category
    let reward_margin;
    switch (business_category) {
      case "E-Commerce":
        reward_margin = purchase_price * 0.4; // Y = 0.4*X
        break;
      case "Food Order":
        reward_margin = purchase_price * 0.25; // Y = 0.25*X
        break;
      case "Travel Booking":
      case "Insurance":
      case "Blood Test":
        reward_margin = purchase_price * 1.0; // Y = 1.0*X
        break;
      default:
        reward_margin = purchase_price * 0.5; // Default to 50% if not in table
    }

    // Calculate selling price
    const selling_price = purchase_price + reward_margin;

    // Calculate coin applicability based on business category
    let coin_applicability;
    let swaasthfiit_margin;
    let gullak_percentage;

    switch (business_category) {
      case "E-Commerce":
      case "Food Order":
        coin_applicability = reward_margin * 0.5; // Apply Coins = 0.5*Y
        swaasthfiit_margin = reward_margin * 0.5; // Swaasthfiit Margin = 0.5*Y
        gullak_percentage = 0.5; // Money Deposit in Gullak = 0.5*Y
        break;
      case "Travel Booking":
        coin_applicability = reward_margin * 0.7; // Apply Coins = 0.7*Y
        swaasthfiit_margin = reward_margin * 0.3; // Swaasthfiit Margin = 0.3*Y
        gullak_percentage = 0.7; // Money Deposit in Gullak = 0.7*Y
        break;
      case "Insurance":
      case "Blood Test":
        coin_applicability = reward_margin * 0.6; // Apply Coins = 0.6*Y
        swaasthfiit_margin = reward_margin * 0.4; // Swaasthfiit Margin = 0.4*Y
        gullak_percentage = 0.6; // Money Deposit in Gullak = 0.6*Y
        break;
      default:
        coin_applicability = reward_margin * 0.5;
        swaasthfiit_margin = reward_margin * 0.5;
        gullak_percentage = 0.9; // Default to 90% if not in table
    }

    // Calculate Gullak amount
    const gullak_amount = swaasthfiit_margin * gullak_percentage;
    const swaasthfiit_savings = swaasthfiit_margin - gullak_amount;

    // Create pricing record
    const pricing = await ProductPricing.create({
      product_id,
      purchase_price,
      mrp: mrp || purchase_price * 1.2, // Default MRP if not provided
      business_category,
      reward_margin_percentage: (reward_margin / purchase_price) * 100,
      swaasthfiit_margin_percentage: (swaasthfiit_margin / reward_margin) * 100,
      gullak_percentage: gullak_percentage * 100,
    });

    res.status(201).json({
      pricing,
      calculations: {
        reward_margin,
        selling_price,
        distributions: {
          brand_amount: purchase_price,
          swaasthfiit_margin,
          coin_applicability,
          gullak_amount,
          swaasthfiit_savings,
        },
      },
    });
  } catch (error) {
    console.error("Pricing calculation error:", error);
    res.status(500).json({
      message: "Error calculating pricing",
      error: error.message,
    });
  }
};

const redeemCoins = async (req, res) => {
  try {
    const { user_id, product_id, coins_to_redeem, business_category } =
      req.body;

    const pricing = await ProductPricing.findOne({
      where: { product_id },
    });

    if (!pricing) {
      return res.status(404).json({ message: "Product pricing not found" });
    }

    // Get business category from pricing if not provided in request
    const category = business_category || pricing.business_category;

    // Calculate reward margin based on business category
    let reward_margin;
    switch (category) {
      case "E-Commerce":
        reward_margin = pricing.purchase_price * 0.4; // Y = 0.4*X
        break;
      case "Food Order":
        reward_margin = pricing.purchase_price * 0.25; // Y = 0.25*X
        break;
      case "Travel Booking":
      case "Insurance":
      case "Blood Test":
        reward_margin = pricing.purchase_price * 1.0; // Y = 1.0*X
        break;
      default:
        reward_margin = pricing.purchase_price * 0.5; // Default to 50%
    }

    // Calculate max redeemable coins and other values based on business category
    let max_redeemable_coins;
    let swaasthfiit_margin;
    let gullak_percentage;

    switch (category) {
      case "E-Commerce":
      case "Food Order":
        max_redeemable_coins = reward_margin * 0.5; // Apply Coins = 0.5*Y
        swaasthfiit_margin = reward_margin * 0.5; // Swaasthfiit Margin = 0.5*Y
        gullak_percentage = 0.5; // Money Deposit in Gullak = 0.5*Y
        break;
      case "Travel Booking":
        max_redeemable_coins = reward_margin * 0.7; // Apply Coins = 0.7*Y
        swaasthfiit_margin = reward_margin * 0.3; // Swaasthfiit Margin = 0.3*Y
        gullak_percentage = 0.7; // Money Deposit in Gullak = 0.7*Y
        break;
      case "Insurance":
      case "Blood Test":
        max_redeemable_coins = reward_margin * 0.6; // Apply Coins = 0.6*Y
        swaasthfiit_margin = reward_margin * 0.4; // Swaasthfiit Margin = 0.4*Y
        gullak_percentage = 0.6; // Money Deposit in Gullak = 0.6*Y
        break;
      default:
        max_redeemable_coins = reward_margin * 0.5;
        swaasthfiit_margin = reward_margin * 0.5;
        gullak_percentage = 0.9; // Default to 90%
    }

    // Calculate Gullak amount
    const gullak_amount = swaasthfiit_margin * gullak_percentage;

    // Convert to coins if using CoinCalculator
    if (CoinCalculator.COIN_VALUE_IN_PAISE) {
      max_redeemable_coins = CoinCalculator.rupeesToCoins(max_redeemable_coins);
    }

    if (coins_to_redeem > max_redeemable_coins) {
      return res.status(400).json({
        message: `Cannot redeem more than ${max_redeemable_coins} coins for this product`,
        max_allowed: max_redeemable_coins,
        requested: coins_to_redeem,
      });
    }

    // Calculate coin value in rupees if using CoinCalculator
    let coin_value_in_rupees = coins_to_redeem;
    if (CoinCalculator.COIN_VALUE_IN_PAISE) {
      coin_value_in_rupees = CoinCalculator.coinsToRupees(coins_to_redeem);
    }

    // Record coin redemption transaction
    await Transaction.create({
      user_id,
      type: "debit",
      amount: coins_to_redeem,
      description: `Coin redemption for product ${product_id}`,
      date: new Date(),
    });

    // Add to user's Gullak
    const [gullak, created] = await Gullak.findOrCreate({
      where: { user_id },
      defaults: {
        amount: 0,
        total_saved: 0,
      },
    });

    // Update Gullak
    const newAmount = parseFloat(gullak.amount) + parseFloat(gullak_amount);
    const newTotalSaved =
      parseFloat(gullak.total_saved) + parseFloat(gullak_amount);

    await gullak.update({
      amount: newAmount,
      total_saved: newTotalSaved,
      last_updated: new Date(),
    });

    // Record transaction for Gullak
    await Transaction.create({
      user_id,
      type: "credit",
      amount: gullak_amount,
      description: `Gullak savings from product ${product_id} purchase`,
      date: new Date(),
    });

    // Calculate final amounts
    const final_price =
      pricing.purchase_price + reward_margin - coin_value_in_rupees;

    res.status(200).json({
      message: "Coins redeemed successfully",
      redemption_details: {
        coins_redeemed: coins_to_redeem,
        coin_value_in_rupees,
        final_price,
        savings: coin_value_in_rupees,
        gullak_amount,
        new_gullak_balance: newAmount,
        business_category: category,
        reward_margin,
        max_redeemable_coins,
      },
    });
  } catch (error) {
    console.error("Coin redemption error:", error);
    res.status(500).json({
      message: "Error processing coin redemption",
      error: error.message,
    });
  }
};

module.exports = {
  calculatePricing,
  redeemCoins,
};
