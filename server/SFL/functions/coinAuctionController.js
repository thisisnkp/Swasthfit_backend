const CoinSeller = require("../models/CoinSeller");
const CoinBid = require("../models/CoinBid");
const Gullak = require("../models/gullak");
const { Op } = require("sequelize");

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const {
      user_id,
      competition_id,
      total_coins,
      min_amount,
      description,
      time_limit_days,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !competition_id ||
      !total_coins ||
      !min_amount ||
      !time_limit_days
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "user_id",
          "competition_id",
          "total_coins",
          "min_amount",
          "time_limit_days",
        ],
      });
    }

    // Create auction
    const auction = await CoinSeller.create({
      user_id,
      competition_id,
      total_coins,
      min_amount,
      description,
      time_limit_days,
    });

    res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(500).json({
      message: "Failed to create auction",
      error: err.message,
    });
  }
};

// Place a bid
// ... existing code ...

// Place a bid
exports.placeBid = async (req, res) => {
  try {
    const { coin_seller_id, bidder_id, bid_value } = req.body;

    // Validate required fields
    if (!coin_seller_id || !bidder_id || !bid_value) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["coin_seller_id", "bidder_id", "bid_value"],
      });
    }

    // Get the competition_id from the seller
    const seller = await CoinSeller.findByPk(coin_seller_id);
    if (!seller) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    // Check if the user has already won an auction for this competition
    const previousWinningBid = await CoinBid.findOne({
      where: {
        bidder_id,
        bid_status: "won",
      },
      include: [
        {
          model: CoinSeller,
          as: "seller",
          where: {
            competition_id: seller.competition_id,
          },
        },
      ],
    });

    if (previousWinningBid) {
      return res.status(400).json({
        message:
          "You have already won an auction for this competition and cannot bid again",
        competition_id: seller.competition_id,
      });
    }

    // Place bid
    const bid = await CoinBid.create({
      coin_seller_id,
      bidder_id,
      bid_value,
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({
      message: "Failed to place bid",
      error: err.message,
    });
  }
};

// ... existing code ...

// Resolve auction
exports.resolveAuction = async (req, res) => {
  try {
    const { coin_seller_id } = req.body;

    // Find the auction
    const auction = await CoinSeller.findByPk(coin_seller_id);
    if (!auction || auction.status !== "open") {
      return res.status(404).json({
        status: "error",
        message: "Auction not found or already closed",
      });
    }

    // Find the lowest bid
    const winningBid = await CoinBid.findOne({
      where: { coin_seller_id, bid_status: "pending" },
      order: [["bid_value", "ASC"]],
    });

    if (!winningBid) {
      return res.status(200).json({
        status: "success",
        message: "No bids found, default sale to Swaasthfiit",
        data: {
          defaultPrice: 0.1,
        },
      });
    }

    // Update auction and bid status
    await auction.update({ status: "sold" });
    await winningBid.update({ bid_status: "won" });

    // Transfer coins and update Gullak
    const gullak = await Gullak.findOne({
      where: { user_id: auction.user_id },
    });
    if (gullak) {
      await gullak.update({
        balance: gullak.balance + auction.total_coins,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Auction resolved successfully",
      data: {
        winning_bid: {
          id: winningBid.id,
          coin_seller_id: winningBid.coin_seller_id,
          bidder_id: winningBid.bidder_id,
          bid_value: winningBid.bid_value,
          status: winningBid.bid_status,
          created_at: winningBid.created_at,
        },
      },
    });
  } catch (err) {
    console.error("Error resolving auction:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to resolve auction",
      error: err.message,
    });
  }
};

// Add a function to get all auctions to check what's available
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await CoinSeller.findAll({
      where: {
        status: "open", // Only get active auctions
      },
    });

    res.status(200).json({
      message: "Auctions retrieved successfully",
      auctions: auctions,
    });
  } catch (err) {
    console.error("Error retrieving auctions:", err);
    res.status(500).json({
      message: "Failed to retrieve auctions",
      error: err.message,
    });
  }
};

exports.getAuctionBiddingDetails = async (req, res) => {
  try {
    const { auction_id, user_id } = req.params;

    // Get auction details
    const auction = await CoinSeller.findByPk(auction_id, {
      include: [
        {
          model: CoinBid,
          as: "bids",
          order: [["bid_value", "ASC"]],
        },
      ],
    });

    if (!auction) {
      return res.status(404).json({
        status: "error",
        message: "Auction not found",
      });
    }

    // Calculate time left
    const createdDate = new Date(auction.created_at);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(createdDate.getDate() + auction.time_limit_days);
    const timeLeftMs = expiryDate - new Date();
    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);
    const remainingHours = hoursLeft % 24;

    // Get bidding stats
    const bids = auction.bids || [];
    const minBid = bids.length > 0 ? bids[0].bid_value : auction.min_amount;
    const maxBid =
      bids.length > 0 ? bids[bids.length - 1].bid_value : auction.min_amount;
    const userBid = bids.find((bid) => bid.bidder_id === parseInt(user_id));

    res.status(200).json({
      status: "success",
      message: "Auction details retrieved successfully",
      data: {
        auction: {
          name: auction.description,
          time_left: {
            hours: hoursLeft,
            formatted: `${daysLeft} days, ${remainingHours} hours`,
          },
          coin_amount: auction.total_coins,
        },
        bidding: {
          min_bid: minBid,
          max_bid: maxBid,
          your_bid: userBid ? userBid.bid_value : null,
          your_status: userBid ? userBid.bid_status : null,
          total_bids: bids.length,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to get auction details",
      error: err.message,
    });
  }
};
