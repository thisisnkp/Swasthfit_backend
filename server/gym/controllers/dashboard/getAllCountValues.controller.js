const Membership = require("../../../membership/membership/membership.model");

const { Op } = require("sequelize"); // Sequelize's Operator for complex queries

exports.getGymDashboardStats = async (req, res) => {
  try {
    const gym_id = req.params.id; // Assuming gym_id comes from route parameters

    if (!gym_id) {
      return res.status(400).json({ message: "Gym ID is required." });
    }

    const now = new Date(); // Current date and time

    // 1. Today's Payment
    // Calculate start and end of today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todaysPayment =
      (await Membership.sum("price", {
        where: {
          gym_id: gym_id,
          created_at: {
            // Assuming payment is recorded when membership is created
            [Op.gte]: todayStart,
            [Op.lte]: todayEnd,
          },
        },
      })) || 0; // Default to 0 if null (no payments today)

    // 2. Collected Payment (Total for the gym)
    const collectedPayment =
      (await Membership.sum("price", {
        where: {
          gym_id: gym_id,
        },
      })) || 0; // Default to 0 if null

    // 3. Total Clients (Unique users for the gym)
    const totalClients = await Membership.count({
      where: { gym_id: gym_id },
      distinct: true,
      col: "user_id",
    });

    // 4. Active and Inactive Clients
    // Find the latest membership end_date for each user in the gym
    const allMembershipsForGym = await Membership.findAll({
      where: { gym_id: gym_id },
      attributes: ["user_id", "end_date"],
      order: [
        ["user_id", "ASC"],
        ["end_date", "DESC"], // Ensures the first record per user has their latest end_date
      ],
      raw: true, // Get plain objects
    });

    const latestUserMembershipEndDate = {};
    for (const m of allMembershipsForGym) {
      if (!latestUserMembershipEndDate[m.user_id]) {
        latestUserMembershipEndDate[m.user_id] = new Date(m.end_date);
      }
    }

    let activeClientsCount = 0;
    let inactiveClientsCount = 0;

    Object.values(latestUserMembershipEndDate).forEach((endDate) => {
      if (endDate >= now) {
        // Compare with the current date and time
        activeClientsCount++;
      } else {
        inactiveClientsCount++;
      }
    });

    // 5. New Clients (Membership started in the last 6 days)
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 5); // Includes today (e.g., if today is 30th, this sets to 25th)
    sixDaysAgo.setHours(0, 0, 0, 0); // Start of the 6th day ago

    const newClientsCount = await Membership.count({
      distinct: true,
      col: "user_id",
      where: {
        gym_id: gym_id,
        start_date: {
          // Based on membership's start_date
          [Op.gte]: sixDaysAgo,
        },
      },
    });

    res.status(200).json({
      gym_id: gym_id,
      todaysPayment: parseFloat(todaysPayment.toFixed(2)),
      collectedPayment: parseFloat(collectedPayment.toFixed(2)),
      totalClients: totalClients,
      activeClients: activeClientsCount,
      inactiveClients: inactiveClientsCount,
      newClients: newClientsCount,
    });
  } catch (error) {
    console.error("Error fetching gym dashboard stats:", error);
    res
      .status(500)
      .json({
        message: "Error fetching dashboard statistics",
        error: error.message,
      });
  }
};
