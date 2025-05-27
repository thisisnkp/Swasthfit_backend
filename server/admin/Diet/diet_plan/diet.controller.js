const { v4: uuidv4 } = require("uuid");
const dietModel = require("./diet.model");
const trainerModel = require("../../../user/trainer.model"); // Adjust path accordingly
const userModel = require("../../../user/user.model"); // Adjust path accordingly

exports.suggestDiet = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    const dietData = req.body;
    console.log("dietData", dietData);

    // Validate required fields, including trainer_id and user_id (client)
    if (
      !dietData.meal_type ||
      !dietData.food_item ||
      !dietData.quantity ||
      !dietData.trainer_id ||
      !dietData.user_id
    ) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required fields",
            displayMessage: dietData,
          },
        ],
      });
    }

    // Check if the trainer exists in the trainers table
    const trainer = await trainerModel.findOne({
      where: { id: dietData.trainer_id },
    });
    if (!trainer) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Trainer not found",
            displayMessage: "Trainer not found",
          },
        ],
      });
    }

    // Check if the client exists in the users table
    const client = await userModel.findOne({
      where: { id: dietData.user_id },
    });
    if (!client) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Client not found",
            displayMessage: "Client not found",
          },
        ],
      });
    }

    // Check if the client already has a trainer assigned.
    // If the client's trainer_id is null, return an error.
    if (!client.trainer_id) {
      return res.status(400).json({
        errors: [
          {
            code: "NO_TRAINER_ASSIGNED",
            message: "tainer is not assign for this user",
            displayMessage: "tainer is not assign for this user",
          },
        ],
      });
    }

    // Update the client's record in the users table to store the trainer's id
    await userModel.update(
      { trainer_id: dietData.trainer_id },
      { where: { id: dietData.user_id } }
    );

    // Update the trainer's record in the trainers table to store the client's id
    await trainerModel.update(
      { user_id: dietData.user_id },
      { where: { id: dietData.trainer_id } }
    );

    // Create the diet suggestion record in the diets table
  const data =  await dietModel.create({
      id: uuidv4(),
      trainer_id: dietData.trainer_id, // Trainer suggesting the diet
      user_id: dietData.user_id, // Client receiving the diet suggestion
      meal_type: dietData.meal_type, // e.g., Breakfast, Lunch, etc.
      food_item: dietData.food_item, // Selected food item
      quantity: dietData.quantity, // Quantity with unit
      fats: dietData.fats || 0,
      protein: dietData.protein || 0,
      carbs: dietData.carbs || 0,
      intake_type: dietData.intake_type || "Compulsory",
      remark: dietData.remark || "",
      water_intake: dietData.water_intake || 0,
      created_at: new Date(),
    });


    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: {
        status: "Diet successfully suggested",data:data
      },
    });
  } catch (error) {
    console.error("Error processing diet suggestion:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    // Extract diet suggestion id and trainer id from URL parameters
    const { id, trainer_id } = req.params;

    if (!id || !trainer_id) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required parameters",
            displayMessage: "Diet ID and Trainer ID are required",
          },
        ],
      });
    }

    // Verify that the diet record exists
    const diet = await dietModel.findOne({ where: { id } });
    if (!diet) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Diet suggestion not found",
            displayMessage: "No diet suggestion exists for the provided id",
          },
        ],
      });
    }

    // Check that the trainer who is trying to delete this diet is the one who suggested it
    if (diet.trainer_id !== trainer_id) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH002",
            message: "Unauthorized deletion attempt",
            displayMessage:
              "You are not authorized to delete this diet suggestion",
          },
        ],
      });
    }

    // Optionally, verify the trainer exists in the trainers table (if needed)
    const trainer = await trainerModel.findOne({ where: { id: trainer_id } });
    if (!trainer) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Trainer not found",
            displayMessage: "Trainer not found",
          },
        ],
      });
    }

    // Delete the diet suggestion
    await dietModel.destroy({ where: { id } });

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: {
        status: "Diet successfully deleted",
      },
    });
  } catch (error) {
    console.error("Error deleting diet suggestion:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // Validate API Key
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    // Extract parameters from URL
    const { id, trainer_id } = req.params;

    if (!id || !trainer_id) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required parameters",
            displayMessage: "Diet ID and Trainer ID are required",
          },
        ],
      });
    }

    // Validate required fields in request body
    const dietData = req.body;
    if (!dietData.meal_type || !dietData.food_item || !dietData.quantity) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required fields in request body",
            displayMessage: dietData,
          },
        ],
      });
    }

    // Verify that the diet record exists
    const existingDiet = await dietModel.findOne({ where: { id } });
    console.log(existingDiet + "diifndsj");
    if (!existingDiet) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Diet suggestion not found",
            displayMessage: "No diet suggestion exists for the provided id",
          },
        ],
      });
    }

    // Ensure that the trainer attempting the update is the one who suggested the diet
    if (existingDiet.trainer_id !== trainer_id) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH002",
            message: "Unauthorized update attempt",
            displayMessage:
              "You are not authorized to update this diet suggestion",
          },
        ],
      });
    }

    // Update the diet suggestion record
    await dietModel.update(
      {
        meal_type: dietData.meal_type,
        food_item: dietData.food_item,
        quantity: dietData.quantity,
        fats: dietData.fats || existingDiet.fats,
        protein: dietData.protein || existingDiet.protein,
        carbs: dietData.carbs || existingDiet.carbs,
        intake_type: dietData.intake_type || existingDiet.intake_type,
        remark: dietData.remark || existingDiet.remark,
        water_intake: dietData.water_intake || existingDiet.water_intake,
        // 'updated_at' will be updated automatically if timestamps are enabled
      },
      { where: { id } }
    );

    // Retrieve the updated record
    const updatedDiet = await dietModel.findOne({ where: { id } });

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: updatedDiet,
    });
  } catch (error) {
    console.error("Error updating diet suggestion:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

exports.getDietsForTrainer = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // Validate API key
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    // Extract trainer_id from URL parameters
    const { trainer_id } = req.params;
    if (!trainer_id) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required parameter",
            displayMessage: "Trainer ID is required",
          },
        ],
      });
    }

    // Verify that the trainer exists
    const trainer = await trainerModel.findOne({ where: { id: trainer_id } });
    if (!trainer) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Trainer not found",
            displayMessage: "Trainer not found",
          },
        ],
      });
    }

    // Fetch all diet suggestions created by the trainer
    const diets = await dietModel.findAll({ where: { trainer_id } });

    console.log(diets, "diets");
    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: diets,
    });
  } catch (error) {
    console.error("Error fetching diets for trainer:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};
