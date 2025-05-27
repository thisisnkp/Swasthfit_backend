const { Sequelize } = require("sequelize");
const sequelize = require("../../../../sequelize");
const Membership = require("../../../membership/membership/membership.model");
const Attendance = require("../../model/gym_attendance.model");
const User = require("../../../user/user.model");

async function getMembershipsByGymId(req, res) {
  try {
    const { gym_id } = req.body;
    const thresholdDays = 5; // Define the threshold in days

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id is required",
      });
    }

    const memberships = await Membership.findAll({
      where: {
        gym_id: gym_id,
      },
    });

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No memberships found for this gym",
      });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to the beginning of the day for accurate comparison

    const thresholdDate = new Date(currentDate);
    thresholdDate.setDate(currentDate.getDate() + thresholdDays);
    thresholdDate.setHours(23, 59, 59, 999); // Normalize threshold date to the end of the day

    const membershipsNearEnd = memberships.filter((membership) => {
      const endDate = new Date(membership.end_date);
      // Membership should be active (end_date is today or in the future)
      // AND end_date should be within the threshold period (after today and up to thresholdDate)
      return endDate > currentDate && endDate <= thresholdDate;
    });

    return res.status(200).json({
      success: true,
      message: "Memberships nearing expiration retrieved successfully",
      memberships: membershipsNearEnd,
    });
  } catch (error) {
    console.error("Error in getMembershipsByGymId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getExpiredMembershipsByGymId(req, res) {
  try {
    const { gym_id } = req.body;

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id is required",
      });
    }

    const memberships = await Membership.findAll({
      where: {
        gym_id: gym_id,
      },
    });

    if (!memberships || memberships.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No memberships found for this gym",
      });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to the beginning of the day

    const expiredMemberships = memberships.filter((membership) => {
      const endDate = new Date(membership.end_date);
      // To be considered expired, the end_date must be before the start of the current day.
      return endDate < currentDate;
    });

    return res.status(200).json({
      success: true,
      message: "Expired memberships retrieved successfully",
      memberships: expiredMemberships,
    });
  } catch (error) {
    console.error("Error in getExpiredMembershipsByGymId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function markAttendance(req, res) {
  try {
    const { gym_id, user_id } = req.body;

    // Check if user is a gym member
    const user = await User.findOne({
      where: {
        id: user_id,
        user_type: "gym-member",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not a gym member",
      });
    }

    // Add attendance record
    await Attendance.create({ gym_id, user_id });

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAttendanceByGymId(req, res) {
  try {
    const { gym_id } = req.body;

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id is required",
      });
    }

    // Use raw SQL query with JOIN directly in the controller
    const attendanceRecords = await sequelize.query(
      `SELECT a.*, u.user_name, u.user_email, u.user_mobile
             FROM gym_attendance a  -- Use the actual table name
             JOIN users u ON a.user_id = u.id
             WHERE a.gym_id = :gym_id
             `,
      {
        replacements: { gym_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for this gym",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully",
      data: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getMembershipsByGymId,
  getExpiredMembershipsByGymId,
  markAttendance,
  getAttendanceByGymId,
};
