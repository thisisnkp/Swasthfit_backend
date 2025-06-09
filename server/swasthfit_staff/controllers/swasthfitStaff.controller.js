const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../../../sequelize");
const User = require("../../user/models/user.model");
const Trainer = require("../models/trainer")(
  sequelize,
  require("sequelize").DataTypes
);
const SeniorTrainer = require("../models/senior_trainers")(
  sequelize,
  require("sequelize").DataTypes
);
const JuniorTrainerClientConnection =
  require("../models/junior_trainer_client_connections")(
    sequelize,
    require("sequelize").DataTypes
  );

const DEFAULT_PASSWORD = "Swasthfit@123";

exports.getJuniorTrainers = async (req, res) => {
  try {
    const juniorTrainers = await Trainer.findAll({
      where: { trainerType: "junior trainer" },
      attributes: ["id", "firstname", "lastname", "user_id"],
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Junior trainers fetched successfully.",
      data: juniorTrainers,
    });
  } catch (error) {
    console.error("Error in getJuniorTrainers:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.getJuniorTrainersWithClientsByStaffId = async (req, res) => {
  try {
    const { staffId } = req.query;

    if (!staffId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "staffId query parameter is required.",
      });
    }

    // Find all junior trainers linked to the staff (senior trainer)
    const seniorTrainerLinks = await SeniorTrainer.findAll({
      where: { assigned_trainer_id: staffId },
      attributes: ["junior_id"],
    });

    const juniorTrainerIds = seniorTrainerLinks.map((link) => link.junior_id);

    if (juniorTrainerIds.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No junior trainers linked to this staff.",
        data: [],
      });
    }

    // Fetch junior trainer details
    const juniorTrainers = await Trainer.findAll({
      where: { id: juniorTrainerIds },
      attributes: ["id", "firstname", "lastname", "user_id"],
    });

    // For each junior trainer, fetch linked clients
    const results = [];
    for (const juniorTrainer of juniorTrainers) {
      const clientConnections = await JuniorTrainerClientConnection.findAll({
        where: { junior_trainer_id: juniorTrainer.id },
        attributes: ["client_id"],
      });

      const clientIds = clientConnections.map((conn) => conn.client_id);

      results.push({
        juniorTrainer: juniorTrainer,
        clients: clientIds,
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Junior trainers and their clients fetched successfully.",
      data: results,
    });
  } catch (error) {
    console.error("Error in getJuniorTrainersWithClientsByStaffId:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.linkJuniorToSeniorTrainer = async (req, res) => {
  try {
    const { junior_trainer_ids, senior_trainer_id } = req.body;

    if (
      !junior_trainer_ids ||
      !Array.isArray(junior_trainer_ids) ||
      junior_trainer_ids.length === 0 ||
      !senior_trainer_id
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "junior_trainer_ids (non-empty array) and senior_trainer_id are required.",
      });
    }

    // Check if senior trainer exists
    const seniorTrainer = await Trainer.findOne({
      where: { id: senior_trainer_id, trainerType: "swasthfit staff" },
    });

    if (!seniorTrainer) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Senior trainer not found.",
      });
    }

    // Validate all junior trainers exist
    const juniorTrainers = await Trainer.findAll({
      where: { id: junior_trainer_ids, trainerType: "junior trainer" },
    });

    if (juniorTrainers.length !== junior_trainer_ids.length) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "One or more junior trainers not found.",
      });
    }

    // Process each junior trainer
    const results = [];
    for (const junior_trainer_id of junior_trainer_ids) {
      const existingLink = await SeniorTrainer.findOne({
        where: {
          junior_id: junior_trainer_id,
          assigned_trainer_id: senior_trainer_id,
        },
      });

      if (existingLink) {
        results.push({ junior_trainer_id, status: "already linked" });
      } else {
        await SeniorTrainer.create({
          junior_id: junior_trainer_id,
          assigned_trainer_id: senior_trainer_id,
        });
        results.push({ junior_trainer_id, status: "linked successfully" });
      }
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Processed junior trainers linking.",
      results,
    });
  } catch (error) {
    console.error("Error in linkJuniorToSeniorTrainer:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.getAllConnections = async (req, res) => {
  try {
    const connections = await SeniorTrainer.findAll({
      attributes: ["id", "junior_id", "assigned_trainer_id"],
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Connections fetched successfully.",
      data: connections,
    });
  } catch (error) {
    console.error("Error in getAllConnections:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.assignClientToJuniorTrainer = async (req, res) => {
  try {
    const { junior_trainer_id, client_ids } = req.body;

    if (
      !junior_trainer_id ||
      !client_ids ||
      !Array.isArray(client_ids) ||
      client_ids.length === 0
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "junior_trainer_id and non-empty client_ids array are required.",
      });
    }

    // Validate junior trainer exists
    const juniorTrainer =
      await JuniorTrainerClientConnection.sequelize.models.Trainer.findOne({
        where: { id: junior_trainer_id, trainerType: "junior trainer" },
      });

    if (!juniorTrainer) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Junior trainer not found.",
      });
    }

    // Validate all clients exist
    const clients =
      await JuniorTrainerClientConnection.sequelize.models.Trainer.findAll({
        where: { id: client_ids },
      });

    if (clients.length !== client_ids.length) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "One or more clients not found.",
      });
    }

    // Process each client
    const results = [];
    for (const client_id of client_ids) {
      const existingConnection = await JuniorTrainerClientConnection.findOne({
        where: {
          junior_trainer_id,
          client_id,
        },
      });

      if (existingConnection) {
        results.push({ client_id, status: "already assigned" });
      } else {
        await JuniorTrainerClientConnection.create({
          junior_trainer_id,
          client_id,
        });
        results.push({ client_id, status: "assigned successfully" });
      }
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Processed client assignments.",
      results,
    });
  } catch (error) {
    console.error("Error in assignClientToJuniorTrainer:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.getJuniorClientConnectionsbyid = async (req, res) => {
  try {
    const { junior_trainer_id } = req.query;

    const whereClause = junior_trainer_id ? { junior_trainer_id } : {};

    const connections = await JuniorTrainerClientConnection.findAll({
      where: whereClause,
      attributes: ["id", "junior_trainer_id", "client_id", "created_at"],
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Junior trainer to client connections fetched successfully.",
      data: connections,
    });
  } catch (error) {
    console.error("Error in getAllJuniorClientConnections:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.deleteConnection = async (req, res) => {
  try {
    const { junior_id, senior_id } = req.body;

    if (!junior_id || !senior_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "junior_id and senior_id are required in the request body.",
      });
    }

    const connection = await SeniorTrainer.findOne({
      where: {
        junior_id,
        assigned_trainer_id: senior_id,
      },
    });

    if (!connection) {
      return res.status(404).json({
        status: 404,
        success: false,
        message:
          "Connection between given junior and senior trainer does not exist.",
      });
    }

    await connection.destroy();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Connection deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteConnection:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

exports.deleteJuniorClientConnection = async (req, res) => {
  try {
    const { junior_trainer_id, client_id } = req.body;

    if (!junior_trainer_id || !client_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "junior_trainer_id and client_id are required in the request body.",
      });
    }

    const connection = await JuniorTrainerClientConnection.findOne({
      where: {
        junior_trainer_id,
        client_id,
      },
    });

    if (!connection) {
      return res.status(404).json({
        status: 404,
        success: false,
        message:
          "Connection between given junior trainer and client does not exist.",
      });
    }

    await connection.destroy();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Connection deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteJuniorClientConnection:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
