const Competition = require("../models/Competition");
const CompetitionPrize = require("../models/CompetitionPrize");
const CompetitionParticipation = require("../models/CompetitionParticipation");
const { Op } = require("sequelize");

const createCompetition = async (req, res) => {
  try {
    const { name, start_date, end_date, state, city } = req.body;
    const comp = await Competition.create({
      name,
      start_date,
      end_date,
      state,
      city,
    });
    res.status(201).json({ message: "Competition created", competition: comp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// competitionController.js
const createPrize = async (req, res) => {
  try {
    const { competition_name, label, prize, qualifying_points, no_of_claims } =
      req.body;

    if (!competition_name || !label || !prize || !no_of_claims) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["competition_name", "label", "prize", "no_of_claims"],
      });
    }

    const competition = await Competition.findOne({
      where: { name: competition_name },
    });
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    const newPrize = await CompetitionPrize.create({
      competition_id: competition.id,
      competition_name,
      label,
      prize,
      qualifying_points: qualifying_points || 0,
      no_of_claims,
    });

    res.status(201).json({ message: "Prize added", prize: newPrize });
  } catch (err) {
    console.error("Error creating prize:", err);
    res.status(500).json({ error: err.message });
  }
};

const joinCompetition = async (req, res) => {
  try {
    const { user_id, competition_id, entry_coins } = req.body;
    const participation = await CompetitionParticipation.create({
      user_id,
      competition_id,
      entry_coins,
    });
    res.status(201).json({ message: "Joined competition", participation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const calculateProgress = async (req, res) => {
  try {
    const { user_id, competition_id } = req.body;
    const participation = await CompetitionParticipation.findOne({
      where: { user_id, competition_id },
    });

    if (!participation) {
      return res.status(404).json({ message: "User not participating" });
    }

    const joinedDate = new Date(participation.joined_at);
    const Transaction = require("../models/coinTransaction");

    const earnedCoins =
      (await Transaction.sum("amount", {
        where: {
          user_id,
          type: "credit",
          createdAt: { [Op.gte]: joinedDate },
        },
      })) || 0;

    participation.coins_earned = earnedCoins;
    await participation.save();

    res.status(200).json({
      user_id,
      competition_id,
      coins_earned: participation.coins_earned,
      joined_at: participation.joined_at,
    });
  } catch (err) {
    console.error("Error calculating progress:", err);
    res.status(500).json({
      message: "Failed to calculate progress",
      error: err.message,
    });
  }
};
const checkWinners = async (req, res) => {
  try {
    const { competition_id } = req.body;

    const competition = await Competition.findByPk(competition_id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    const participants = await CompetitionParticipation.findAll({
      where: { competition_id },
      order: [["coins_earned", "DESC"]],
    });

    const prizes = await CompetitionPrize.findAll({
      where: { competition_id: competition.id }, // Use competition_id
    });

    if (prizes.length === 0) {
      return res
        .status(404)
        .json({ message: "No prizes found for this competition" });
    }

    let winnersUpdated = 0;

    for (let prize of prizes) {
      const eligible = participants.filter(
        (p) =>
          p.coins_earned >= parseInt(prize.qualifying_points) &&
          p.is_winner === "no"
      );

      const claimsToProcess = Math.min(
        prize.no_of_claims - prize.claimed,
        eligible.length
      );

      for (let i = 0; i < claimsToProcess; i++) {
        const winner = eligible[i];
        winner.is_winner = "yes";
        await winner.save();

        prize.claimed += 1;
        await prize.save();

        winnersUpdated++;
      }
    }

    res.status(200).json({
      message: "Winners updated successfully",
      winners_updated: winnersUpdated,
    });
  } catch (err) {
    console.error("Error checking winners:", err);
    res.status(500).json({
      message: "Failed to check winners",
      error: err.message,
    });
  }
};

const refundNonWinners = async (req, res) => {
  try {
    const { competition_id } = req.body;
    const Transaction = require("../models/coinTransaction");

    const nonWinners = await CompetitionParticipation.findAll({
      where: { competition_id, is_winner: "no" },
    });

    for (let user of nonWinners) {
      await Transaction.create({
        user_id: user.user_id,
        type: "credit",
        amount: user.entry_coins,
        description: "Refunded entry coins for non-winning competition",
      });
    }

    res.status(200).json({ message: "Refunded non-winners successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.findAll({
      order: [["start_date", "DESC"]],
    });

    res.status(200).json(competitions);
  } catch (err) {
    console.error("Error fetching competitions:", err);
    res.status(500).json({
      message: "Failed to fetch competitions",
      error: err.message,
    });
  }
};

const updateUserCoins = async (req, res) => {
  try {
    const { user_id, competition_id, coins_earned } = req.body;

    const participation = await CompetitionParticipation.findOne({
      where: { user_id, competition_id },
    });

    if (!participation) {
      return res
        .status(404)
        .json({ message: "User not participating in this competition" });
    }

    participation.coins_earned = coins_earned;
    await participation.save();

    res.status(200).json({
      message: "User coins updated successfully",
      user_id,
      competition_id,
      coins_earned,
    });
  } catch (err) {
    console.error("Error updating user coins:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add this function to your competitionController.js

const getCompetitionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await Competition.findByPk(id, {
      include: [
        {
          model: CompetitionPrize,
          as: "prizes",
        },
      ],
    });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.status(200).json(competition);
  } catch (err) {
    console.error("Error fetching competition details:", err);
    res.status(500).json({
      message: "Failed to fetch competition details",
      error: err.message,
    });
  }
};

// Add the missing getLocationCompetitions function
const getLocationCompetitions = async (req, res) => {
  try {
    console.log("Getting location competitions...");
    const { state, city } = req.query;
    console.log("Query params:", { state, city });

    // First check if we have any competitions at all (for debugging)
    const allCompetitions = await Competition.findAll({ limit: 5 });
    console.log(`Total competitions in DB: ${allCompetitions.length}`);

    if (allCompetitions.length === 0) {
      console.log("No competitions found in database at all");
      return res.status(404).json({
        message: "No competitions found in the database",
      });
    }

    // Build the query conditions
    const whereConditions = {
      is_active: true,
    };

    // Add location filters if provided
    if (state) {
      whereConditions.state = state;
    }

    if (city) {
      whereConditions.city = city;
    }

    console.log("Query conditions:", JSON.stringify(whereConditions));

    // Get competitions matching the location criteria
    const competitions = await Competition.findAll({
      where: whereConditions,
    });

    console.log(`Found ${competitions.length} competitions for the location`);

    // If no competitions found for the exact location, try to find competitions in the state
    if (competitions.length === 0 && city && state) {
      // Remove city filter and search only by state
      delete whereConditions.city;

      const stateCompetitions = await Competition.findAll({
        where: whereConditions,
      });

      console.log(
        `Found ${stateCompetitions.length} competitions for the state`
      );

      if (stateCompetitions.length > 0) {
        return res.status(200).json({
          message:
            "No competitions found in your city, showing state competitions",
          competitions: stateCompetitions,
        });
      }
    }

    // If still no competitions found, return all active competitions
    if (competitions.length === 0) {
      const allActiveCompetitions = await Competition.findAll({
        where: { is_active: true },
        limit: 10,
      });

      console.log(
        `Returning ${allActiveCompetitions.length} active competitions as fallback`
      );

      return res.status(200).json({
        message:
          "No competitions found for your location, showing all active competitions",
        competitions: allActiveCompetitions,
      });
    }

    res.status(200).json({
      message: "Competitions retrieved successfully",
      competitions,
    });
  } catch (err) {
    console.error("Error retrieving competitions by location:", err);
    res.status(500).json({
      message: "Failed to retrieve competitions",
      error: err.message,
      stack: err.stack,
    });
  }
};

/////////////
const getCompetitionsByLocation = async (req, res) => {
  try {
    const { state, city } = req.body;

    if (!state && !city) {
      return res.status(400).json({
        message: "Please provide either state or city",
        required: ["state", "city"],
      });
    }

    const whereConditions = {
      is_active: true,
      end_date: { [Op.gte]: new Date() },
    };

    if (state) whereConditions.state = state;
    if (city) whereConditions.city = city;

    const competitions = await Competition.findAll({
      where: whereConditions,
      include: [
        {
          model: CompetitionPrize,
          as: "prizes",
          required: false,
          where: { status: "active" },
          order: [["qualifying_points", "DESC"]], // Order prizes by highest first
        },
      ],
      order: [["start_date", "ASC"]],
    });

    if (!competitions.length) {
      return res.status(404).json({
        message: "No active competitions found",
        suggestions: "Try different location parameters",
      });
    }

    // Format response for frontend needs
    const response = competitions.map((comp) => {
      const firstPrize = comp.prizes.length > 0 ? comp.prizes[0] : null;

      return {
        id: comp.id,
        challengeName: comp.name,
        // icon: `uploads/competitions/${comp.id}.png`, // Assuming icons are named by competition ID
        icon: `/uploads/competitions/${comp.id}.jpg`, // Assuming icons are named by competition ID
        coins: firstPrize ? parseInt(firstPrize.prize.match(/\d+/)[0]) : 0, // Extract numeric coins value
        duration: `${comp.start_date} to ${comp.end_date}`,
        achievement: firstPrize
          ? `Earn ${firstPrize.qualifying_points} points`
          : "Complete challenges",
        price: firstPrize ? firstPrize.prize : "No prize specified",
      };
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("Error fetching competitions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve competitions",
      error: err.message,
    });
  }
};

module.exports = {
  createCompetition,
  createPrize,
  joinCompetition,
  calculateProgress,
  checkWinners,
  refundNonWinners,
  getAllCompetitions,
  getCompetitionDetails,
  updateUserCoins,
  getLocationCompetitions,
  getCompetitionsByLocation,
};
