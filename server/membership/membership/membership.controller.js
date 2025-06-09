// Description: This file contains the controller functions for managing memberships in the system.
const { Op } = require("sequelize");
const Membership = require("./membership.model");
const User = require("../../user/models/user.model");
const MembershipPlan = require("../membership-plans/membership_plans.model");
const { v4: uuidv4 } = require("uuid");
const Gym = require("../../gym/gym_owners/gym.model");

// Ensure models are associated only once and without alias
User.hasMany(Membership, { foreignKey: "user_id" });
Membership.belongsTo(User, { foreignKey: "user_id" });

Membership.belongsTo(MembershipPlan, { foreignKey: "membership_plan_id" });
MembershipPlan.hasMany(Membership, { foreignKey: "membership_plan_id" });

Membership.belongsTo(Gym, { foreignKey: "gym_id" });

//Working with associations
exports.getMembershipDetailsById = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const { id } = req.params;

    const membership = await Membership.findOne({
      where: { id: id },
      include: [{ model: Gym }, { model: User }, { model: MembershipPlan }],
    });

    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
      });
    }

    return res.status(200).json({
      message: "Membership details fetched successfully",
      data: membership,
      correlationId,
    });
  } catch (error) {
    console.error("Error fetching membership details:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

// working with associations
// Get all memberships with full details of User, MembershipPlan and Gym
exports.getAllMembershipDetails = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    // Get all memberships with full details of User, MembershipPlan and Gym
    const memberships = await Membership.findAll({
      include: [
        { model: Gym }, // Full gym data
        { model: User }, // Full user data
        { model: MembershipPlan }, // Full membership plan data
      ],
      // order: [['createdAt', 'DESC']] // Optional: latest first
    });

    console.log("Memberships:", memberships); // Debugging line

    return res.status(200).json({
      message: "All memberships fetched successfully",
      data: memberships,
      correlationId,
    });
  } catch (error) {
    console.error("Error fetching memberships list:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

// Delete membership by ID
// This function deletes a membership by its ID. It first checks if the membership exists, and if it does, it deletes it from the database.
exports.deleteMembershipById = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { id } = req.params; // Get membership id from URL params

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
        correlationId,
      });
    }

    // Check if membership exists
    const membership = await Membership.findByPk(id);
    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
        correlationId,
      });
    }

    // Delete the membership
    await membership.destroy();

    return res.status(200).json({
      message: "Membership deleted successfully",
      correlationId,
      success: true,
    });
  } catch (error) {
    console.error("Error deleting membership:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
      correlationId,
    });
  }
};

// Update membership status
// This function updates the status of a membership (Active/Inactive). It first checks if the membership exists, and if it does, it updates its status.
exports.updateMembershipStatus = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();
    const { id } = req.params; // Membership ID from URL
    const { status } = req.body; // New status from body (Active/Inactive)

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
        correlationId,
      });
    }

    // Validate input status
    if (!status || (status !== "Active" && status !== "Inactive")) {
      return res.status(400).json({
        errors: [
          {
            code: "INVALID_STATUS",
            message: "Status must be 'Active' or 'Inactive'",
          },
        ],
        correlationId,
      });
    }

    // Find the membership
    const membership = await Membership.findByPk(id);
    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
        correlationId,
      });
    }

    // Update the status
    membership.status = status;
    await membership.save();

    return res.status(200).json({
      message: "Membership status updated successfully",
      data: {
        id: membership.id,
        status: membership.status,
      },
      correlationId,
      success: true,
    });
  } catch (error) {
    console.error("Error updating membership status:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
      correlationId,
    });
  }
};

/**
 * Filter memberships based on status, end_date, and gender.
 */
//* This function retrieves memberships that match the specified criteria.
// It filters memberships based on the status, end date, and
// const { Op } = require("sequelize"); // Make sure Op is imported

exports.filterMemberships = async (req, res) => {
  try {
    const { gender, daysRemaining, status } = req.query;

    // Conditions for Membership table
    const membershipWhere = {};

    if (status) {
      membershipWhere.status = status;
    }

    if (daysRemaining) {
      const today = new Date();
      const dateLimit = new Date();
      dateLimit.setDate(today.getDate() + parseInt(daysRemaining));

      membershipWhere.end_date = { [Op.lte]: dateLimit };
    }

    // Conditions for User table
    const userWhere = {};

    if (gender) {
      userWhere.user_gender = gender;
    }

    const memberships = await Membership.findAll({
      where: membershipWhere,
      include: [
        {
          model: User,
          attributes: ["id", "user_name", "user_gender", "user_dob"],
          where: Object.keys(userWhere).length > 0 ? userWhere : undefined, // Only apply if gender is provided
        },
        {
          model: MembershipPlan,
          attributes: ["id", "name", "membership_type", "selling_price"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Filtered memberships retrieved successfully",
      data: memberships,
    });
  } catch (error) {
    console.error("Error fetching filtered memberships:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Create a new Membership
 */
exports.createMembership = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // Validate API Key
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const {
      user_id,
      gym_id,
      membership_plan_id,
      start_date,
      end_date,
      price,
      membership_type,
      status,
      payment_method,
      transaction_id,
      coupon_id,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !membership_plan_id ||
      !start_date ||
      !end_date ||
      !price ||
      !membership_type ||
      !status ||
      !payment_method
    ) {
      return res.status(400).json({
        errors: [{ code: "REQ001", message: "Missing required fields" }],
      });
    }

    const membership = await Membership.create({
      id: uuidv4(),
      user_id,
      gym_id,
      membership_plan_id,
      start_date,
      end_date,
      price,
      membership_type,
      status,
      payment_method,
      transaction_id,
      coupon_id,
    });

    return res.status(201).json({
      message: "Membership created successfully",
      data: membership,
      correlationId,
    });
  } catch (error) {
    console.error("Error creating membership:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

/**
 * Get Membership by ID
 */
exports.getMembershipById = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const { id } = req.params;
    const membership = await Membership.findOne({
      where: { id, deleted_at: null },
    });

    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
      });
    }

    return res.status(200).json({ data: membership, correlationId });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

/**
 * Update Membership
 */
exports.updateMembership = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const { id } = req.params;
    const updatedData = req.body;

    const membership = await Membership.findOne({
      where: { id, deleted_at: null },
    });
    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
      });
    }

    await membership.update(updatedData);
    return res.status(200).json({
      message: "Membership updated successfully",
      data: membership,
      correlationId,
    });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

/**
 * Soft Delete Membership (Mark as deleted)
 */
exports.deleteMembership = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const { id } = req.params;
    const membership = await Membership.findOne({
      where: { id, deleted_at: null },
    });

    if (!membership) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
      });
    }

    await membership.update({ deleted_at: new Date() }); // Soft delete
    return res.status(200).json({
      message: "Membership deleted successfully",
      correlationId,
    });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

exports.getMembershipByUserId = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const UserId = req.params.UserId;
    console.log("User Id:", UserId); // Debugging line

    // Find the user by email
    const membership = await Membership.findOne({
      where: { user_id: UserId }, // ✅ Correct usage
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get all memberships (With Pagination & Filtering)
 */
exports.getAllMemberships = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    // Pagination settings
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const memberships = await Membership.findAndCountAll({
      where: { deleted_at: null }, // Exclude soft deleted records
      limit,
      offset,
    });

    return res.status(200).json({
      totalRecords: memberships.count,
      data: memberships.rows,
      correlationId,
    });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

// const { Op } = require("sequelize");
// const Membership = require("./membership.model");
// const User = require("../../user/user.model");
// const MembershipPlan = require("../membership-plans/membership_plans.model");
// const { v4: uuidv4 } = require("uuid");
// const Gym = require("../../gym/gym_owners/gym.model");

// // Ensure models are associated
// User.hasMany(Membership, { foreignKey: "user_id" });
// Membership.belongsTo(User, { foreignKey: "user_id" });

// Membership.belongsTo(MembershipPlan, { foreignKey: "membership_plan_id" });
// MembershipPlan.hasMany(Membership, { foreignKey: "membership_plan_id" });
// Membership.belongsTo(Gym, { foreignKey: 'gym_id' });

// // Associations (Only once and with alias if used in include)
// // Membership.belongsTo(User, { foreignKey: "user_id", as: "user" });
// // Membership.belongsTo(MembershipPlan, { foreignKey: "membership_plan_id", as: "membershipPlan" });
// // Membership.belongsTo(Gym, { foreignKey: "gym_id", as: "gym" });

// // Membership.jsMembership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// // Membership.belongsTo(MembershipPlan, { foreignKey: 'membership_plan_id', as: 'membershipPlan' });

// exports.getMembershipDetails = async (req, res) => {
//     try {
//         const apiKey = req.headers["x-api-key"];
//         const correlationId = req.headers["x-correlation-id"] || uuidv4();

//         if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
//             return res.status(403).json({
//                 errors: [{ code: "AUTH001", message: "Invalid API Key" }],
//             });
//         }

//         const { membershipId } = req.params;

//         const membership = await Membership.findOne({
//             where: { id: membershipId },
//             include: [
//                 { model: Gym, as: 'gym' },
//                 { model: User, as: 'user' },
//                 { model: MembershipPlan, as: 'membershipPlan' }
//             ]
//         });

//         if (!membership) {
//             return res.status(404).json({
//                 errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
//             });
//         }

//         return res.status(200).json({
//             message: "Membership details fetched successfully",
//             data: membership,
//             correlationId,
//         });
//     } catch (error) {
//         console.error("Error fetching membership details:", error);
//         return res.status(500).json({
//             errors: [{ code: "SERVER_ERROR", message: error.message }],
//         });
//     }
// };
