const { Sequelize, Op } = require("sequelize");
const Membership = require("../../../membership/membership/membership.model");
const User = require("../../../user/user.model");

async function getUsersByBirthday(req, res) {
  try {
    const gym_id = req.params.id;

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: gym_id",
      });
    }

    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentDay = currentDate.getDate();

    // First, get all user_ids from memberships for this gym
    const memberships = await Membership.findAll({
      where: {
        gym_id,
        status: "Active", // Only get active memberships
      },
      attributes: ["user_id"],
    });

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members found for this gym",
      });
    }

    const userIds = memberships.map((membership) => membership.user_id);

    // Then find users with matching birth dates
    const birthdayUsers = await User.findAll({
      where: {
        id: userIds,
        user_dob: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("user_dob")),
              currentMonth
            ),
            Sequelize.where(
              Sequelize.fn("DAY", Sequelize.col("user_dob")),
              currentDay
            ),
          ],
        },
      },
      attributes: [
        "id",
        "user_name",
        "user_mobile",
        "user_email",
        "user_dob",
        "user_age",
        "user_gender",
      ],
    });

    if (!birthdayUsers || birthdayUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No birthdays found for today",
      });
    }

    return res.status(200).json({
      success: true,
      count: birthdayUsers.length,
      users: birthdayUsers,
    });
  } catch (error) {
    console.error("Error fetching birthday users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getUsersByBirthday,
};
