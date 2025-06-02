const ClientDietPlan = require("../models/clientdietplan");
const ClientWorkout = require("../models/ClientWorkout");
const User = require("../../user/user.model");
const express = require("express");

const app = express();

// Create a new ClientDietPlan
// exports.createClientDietPlan = async (req, res) => {
//   try {
//     const {
//       user_id,
//       trainer_id,
//       meal_type,
//       food_item_name,
//       quantity,
//       quantity_unit,
//       fats,
//       protein,
//       carbs,
//       food_type,
//       remark,
//       water_intake,
//       water_intake_unit,
//       breakfast_price,
//       lunch_price,
//       dinner_price,
//       snacks_price,
//       combo_price,
//       discount_type,
//       discount_value,
//       plan_days,
//       optional_item_name,
//       optional_item_price,
//       meal_order,
//       is_water_intake,
//     } = req.body;

//     let finalFoodType = food_type;
//     if (meal_type === "Snacks") {
//       finalFoodType = "Optional";
//     }
    
//     const clientDietPlan = await ClientDietPlan.create({
//       user_id,
//       trainer_id,
//       meal_type,
//       food_item_name,
//       quantity,
//       quantity_unit,
//       fats,
//       protein,
//       carbs,
//       food_type: finalFoodType,
//       remark,
//       water_intake,
//       water_intake_unit,
//       breakfast_price,
//       lunch_price,
//       dinner_price,
//       snacks_price,
//       combo_price,
//       discount_type,
//       discount_value,
//       plan_days,
//       optional_item_name,
//       optional_item_price,
//       meal_order,
//       is_water_intake,
//     });

//     res.status(201).json({
//       message: "Client Diet Plan created successfully",
//       data: clientDietPlan,
//     });
//   } catch (error) {
//     console.error("Error creating client diet plan:", error);
//     res.status(500).json({
//       message: "Error creating client diet plan",
//       error: error.message,
//     });
//   }
// };
exports.createClientDietPlan = async (req, res) => {
  try {
    const {
      user_id,
      trainer_id,
      meal_type,
      food_item_name,
      quantity,
      quantity_unit,
      fats,
      protein,
      carbs,
      food_type,
      remark,
      water_intake,
      water_intake_unit,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      discount_type,
      discount_value,
      plan_days,
      optional_item_name,
      optional_item_price,
      meal_order,
      is_water_intake,
    } = req.body;

    // Validate user_id
    if (!user_id || isNaN(user_id) || parseInt(user_id) <= 0) {
      return res.status(400).json({ message: "Invalid or missing user_id." });
    }

    // Validate trainer_id
    if (!trainer_id || isNaN(trainer_id) || parseInt(trainer_id) <= 0) {
      return res.status(400).json({ message: "Invalid or missing trainer_id." });
    }

    // Check if user_id exists in User table
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User ID does not exist." });
    }

    // Check if trainer_id exists in User table
    const trainerExists = await User.findByPk(trainer_id);
    if (!trainerExists) {
      return res.status(404).json({ message: "Trainer ID does not exist." });
    }

    // Validate numeric fields for non-negative values
    const numericFields = {
         quantity,
      quantity_unit,
      fats,
      protein,
      carbs,
      water_intake,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      discount_value,
      plan_days,
      optional_item_price,
      meal_order,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (value !== undefined && value !== null && !isNaN(value) && Number(value) < 0) {
        return res.status(400).json({ message: `${key} cannot be negative.` });
      }
    }

    let finalFoodType = food_type;
    if (meal_type === "Snacks") {
      finalFoodType = "Optional";
    }

    const clientDietPlan = await ClientDietPlan.create({
      user_id,
      trainer_id,
      meal_type,
      food_item_name,
      quantity,
      quantity_unit,
      fats,
      protein,
      carbs,
      food_type: finalFoodType,
      remark,
      water_intake,
      water_intake_unit,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      discount_type,
      discount_value,
      plan_days,
      optional_item_name,
      optional_item_price,
      meal_order,
      is_water_intake,
    });

    res.status(201).json({
      message: "Client Diet Plan created successfully",
      data: clientDietPlan,
    });
  } catch (error) {
    console.error("Error creating client diet plan:", error);
    res.status(500).json({
      message: "Error creating client diet plan",
      error: error.message,
    });
  }
};


exports.getAllClientDietPlans = async (req, res) => {
  try {
    const clientDietPlans = await ClientDietPlan.findAll({
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "name", "email"], // Adjust based on User model
        },
        {
          model: User,
          as: "trainer",
          attributes: ["id", "name", "email"], // Adjust based on User model
        },
      ],
    });

    res.status(200).json({
      message: "Client Diet Plans fetched successfully",
      data: clientDietPlans,
    });
  } catch (error) {
    console.error("Error fetching client diet plans:", error);
    res.status(500).json({
      message: "Error fetching client diet plans",
      error: error.message,
    });
  }
};

// Get ClientDietPlan by ID
exports.getClientDietPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const clientDietPlan = await ClientDietPlan.findByPk(id, {
      include: [
        {
          model: User,
          as: "client",
        },
        {
          model: User,
          as: "trainer",
        },
      ],
    });

    if (!clientDietPlan) {
      return res.status(404).json({
        message: "Client Diet Plan not found",
      });
    }

    res.status(200).json({
      message: "Client Diet Plan fetched successfully",
      data: clientDietPlan,
    });
  } catch (error) {
    console.error("Error fetching client diet plan by ID:", error);
    res.status(500).json({
      message: "Error fetching client diet plan by ID",
      error: error.message,
    });
  }
};

// Update a ClientDietPlan
exports.updateClientDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const {
      user_id,
      trainer_id,
      meal_type,
      food_item_name,
      quantity,
      quantity_unit,
      fats,
      protein,
      carbs,
      food_type,
      remark,
      water_intake,
      water_intake_unit,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      discount_type,
      discount_value,
      plan_days,
      optional_item_name,
      optional_item_price,
      meal_order,
      is_water_intake,
    } = req.body;

    const clientDietPlan = await ClientDietPlan.findByPk(id);

    if (!clientDietPlan) {
      return res.status(404).json({
        message: "Client Diet Plan not found",
      });
    }

    await clientDietPlan.update({
      user_id,
      trainer_id,
      meal_type,
      food_item_name,
      quantity,
      quantity_unit,
      fats,
      protein,
      carbs,
      food_type,
      remark,
      water_intake,
      water_intake_unit,
      breakfast_price,
      lunch_price,
      dinner_price,
      snacks_price,
      combo_price,
      discount_type,
      discount_value,
      plan_days,
      optional_item_name,
      optional_item_price,
      meal_order,
      is_water_intake,
    });

    res.status(200).json({
      message: "Client Diet Plan updated successfully",
      data: clientDietPlan,
    });
  } catch (error) {
    console.error("Error updating client diet plan:", error);
    res.status(500).json({
      message: "Error updating client diet plan",
      error: error.message,
    });
  }
};
exports.updateClientDietPlanPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      breakfast_price,
      lunch_price,
      dinner_price,

      combo_price,
    } = req.body;

    // Ensure all required fields are present and of the correct type
    if (
      typeof breakfast_price !== "number" ||
      typeof lunch_price !== "number" ||
      typeof dinner_price !== "number" ||
      typeof combo_price !== "number"
    ) {
      return res.status(400).json({
        message: "Invalid input data. Ensure all prices are numbers.",
      });
    }

    // Find the ClientDietPlan by ID
    const clientDietPlan = await ClientDietPlan.findByPk(id);

    if (!clientDietPlan) {
      return res.status(404).json({
        message: "Client Diet Plan not found",
      });
    }

    // Update the pricing in the database
    await clientDietPlan.update({
      breakfast_price,
      lunch_price,
      dinner_price,

      combo_price,
    });

    // Respond with the updated data
    res.status(200).json({
      message: "Client Diet Plan pricing updated successfully",
      data: clientDietPlan,
    });
  } catch (error) {
    console.error("Error updating client diet plan pricing:", error);
    res.status(500).json({
      message: "Error updating client diet plan pricing",
      error: error.message,
    });
  }
};

// exports.updateClientDietPlanPricing = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       breakfast_price,
//       lunch_price,
//       dinner_price,
//       snacks_price,
//       combo_price,
//       optional_item_price,
//     } = req.body;

//     const clientDietPlan = await ClientDietPlan.findByPk(id);

//     if (!clientDietPlan) {
//       return res.status(404).json({
//         message: "Client Diet Plan not found",
//       });
//     }

//     await clientDietPlan.update({
//       breakfast_price,
//       lunch_price,
//       dinner_price,
//       snacks_price,
//       combo_price,
//       optional_item_price,
//     });

//     res.status(200).json({
//       message: "Client Diet Plan pricing updated successfully",
//       data: clientDietPlan,
//     });
//   } catch (error) {
//     console.error("Error updating client diet plan pricing:", error);
//     res.status(500).json({
//       message: "Error updating client diet plan pricing",
//       error: error.message,
//     });
//   }
// };

// Delete a ClientDietPlan
exports.deleteClientDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const clientDietPlan = await ClientDietPlan.findByPk(id);

    if (!clientDietPlan) {
      return res.status(404).json({
        message: "Client Diet Plan not found",
      });
    }

    await clientDietPlan.destroy();

    res.status(200).json({
      message: "Client Diet Plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client diet plan:", error);
    res.status(500).json({
      message: "Error deleting client diet plan",
      error: error.message,
    });
  }
};

// Function to get diet plans by user_id and trainer_id
// exports.getDietPlansByUserAndTrainer = async (userId, trainerId) => {
//     try {
//       const dietPlans = await ClientDietPlan.findAll({
//         where: {
//           user_id: userId,
//           trainer_id: trainerId,
//         },
//         include: [
//           {
//             model: User, // Including client (user)
//             as: "client", // Alias for the client (user)
//             attributes: ["id"], // Adjust attributes as needed
//           },
//           {
//             model: User, // Including trainer (user)
//             as: "trainer", // Alias for the trainer (user)
//             attributes: ["id"], // Adjust attributes as needed
//           },
//         ],
//       });

//       return dietPlans; // Return the fetched diet plans
//     } catch (error) {
//       console.error("Error fetching diet plans:", error);
//       throw error; // Handle the error as needed
//     }
//   };
exports.getDietPlansByUserAndTrainer = async (req, res) => {
  const { userId, trainerId } = req.params;

  try {
    const dietPlans = await ClientDietPlan.findAll({
      where: {
        user_id: userId,
        trainer_id: trainerId,
      },
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "user_name", "user_email"],
        },
        {
          model: User,
          as: "trainer",
          attributes: ["id"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Diet plans fetched successfully",
      data: dietPlans,
    });
  } catch (error) {
    console.error("Error fetching diet plans:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch diet plans",
      error: error.message,
    });
  }
};

// Create a new ClientWorkout (Workout creation)

exports.createClientWorkout = async (req, res) => {
  try {
    const {
      user_id,
      trainer_id, // The trainer who assigned the workout
      day,
      body_part,
      exercise_name,
      sets,
      reps,
      duration_min,
      remark,
      media_url,
      media_type,
    } = req.body;

    // Check if user (client) exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User (client) not found" });
    }

    // Check if trainer exists
    const trainer = await User.findByPk(trainer_id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Create the workout plan for the user assigned by the trainer
    const newWorkout = await ClientWorkout.create({
      user_id,
      trainer_id,
      day,
      body_part,
      exercise_name,
      sets,
      reps,
      duration_min,
      remark,
      media_url,
      media_type,
    });

    return res.status(201).json({
      message: "Client workout plan created successfully",
      data: newWorkout,
    });
  } catch (error) {
    console.error("Error creating client workout plan:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.getClientDietPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await ClientDietPlan.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id"] // Add other fields as needed
        },
        {
          model: User,
          as: "trainer",
          attributes: ["id"] // Add other fields as needed
        }
      ]
    });

    if (!plan) {
      return res.status(404).json({ message: "Client diet plan not found" });
    }

    return res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching client diet plan by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

