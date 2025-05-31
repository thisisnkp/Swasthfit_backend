const GymBatch = require("../../model/gymBatch.model");
const GymAssignedBatch = require("../../model/gymAssignedBatch");
const User = require("../../../user/user.model"); // Assuming user model path
const { Op } = require("sequelize");

// API to create a new batch
async function createBatch(req, res) {
  try {
    const { gym_id, batch_from, batch_to, batch_name, total_hours } = req.body;

    if (!gym_id || !batch_from || !batch_to || !batch_name) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: gym_id, batch_from, batch_to, batch_name",
      });
    }

    const newBatch = await GymBatch.create({
      gym_id,
      batch_from,
      batch_to,
      batch_name,
      total_hours,
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch: newBatch,
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// API to assign a user to a batch
async function assignBatch(req, res) {
  try {
    const { batch_id, user_id, gym_id } = req.body;

    if (!batch_id || !user_id || !gym_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: batch_id, user_id, gym_id",
      });
    }

    // Optional: Check if batch and user exist and belong to the gym
    const batch = await GymBatch.findOne({ where: { id: batch_id, gym_id } });
    const user = await User.findOne({ where: { id: user_id } }); // Assuming user model is accessible

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found or does not belong to this gym",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is already assigned to this batch
    const existingAssignment = await GymAssignedBatch.findOne({
      where: {
        batch_id,
        user_id,
        gym_id,
      },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "User is already assigned to this batch",
      });
    }

    const newAssignment = await GymAssignedBatch.create({
      batch_id,
      user_id,
      gym_id,
    });

    return res.status(201).json({
      success: true,
      message: "User assigned to batch successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error assigning batch:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// API to get all batches for a gym and the users assigned to them
async function getBatchesWithAssignedUsers(req, res) {
  try {
    const gym_id = req.params.id; // Assuming gym_id comes from URL parameters

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: gym_id",
      });
    }

    // Define associations for eager loading
    // Assuming User model is imported and associated with GymAssignedBatch
    GymAssignedBatch.belongsTo(User, { foreignKey: "user_id" });
    GymBatch.hasMany(GymAssignedBatch, { foreignKey: "batch_id" });
    GymAssignedBatch.belongsTo(GymBatch, { foreignKey: "batch_id" });

    const batches = await GymBatch.findAll({
      where: { gym_id },
      include: [
        {
          model: GymAssignedBatch,
          include: [
            {
              model: User,
              attributes: ["id", "user_name", "user_email", "user_mobile"],
            },
          ],
        },
      ],
    });

    if (!batches || batches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No batches found for this gym",
      });
    }

    return res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error("Error fetching batches with assigned users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

async function getAllBatchesByGymId(req, res) {
  try {
    const gym_id = req.params.id; // Assuming gym_id comes from URL parameters

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: gym_id",
      });
    }

    const batches = await GymBatch.findAll({
      where: { gym_id },
    });

    if (!batches || batches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No batches found for this gym",
      });
    }

    return res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error("Error fetching all batches by gym ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createBatch,
  assignBatch,
  getBatchesWithAssignedUsers,
  getAllBatchesByGymId,
};
