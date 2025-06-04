"use strict";

const ClientDietPlan = require("../models/clientdietplan");
const ClientWorkout = require("../models/ClientWorkout");
const User = require("../../user/user.model");

// Create a new ClientDietPlan
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

    if (!user_id || isNaN(user_id) || parseInt(user_id) <= 0) {
      return res.status(400).json({ message: "Invalid or missing user_id." });
    }
    if (!trainer_id || isNaN(trainer_id) || parseInt(trainer_id) <= 0) {
      return res.status(400).json({ message: "Invalid or missing trainer_id." });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const trainer = await User.findByPk(trainer_id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found." });

    const numericFields = {
      quantity, fats, protein, carbs, water_intake,
      breakfast_price, lunch_price, dinner_price, snacks_price,
      combo_price, discount_value, plan_days, optional_item_price, meal_order,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (value !== undefined && !isNaN(value) && Number(value) < 0) {
        return res.status(400).json({ message: `${key} cannot be negative.` });
      }
    }

    const finalFoodType = meal_type === "Snacks" ? "Optional" : food_type;

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

    return res.status(201).json({
      message: "Client Diet Plan created successfully",
      data: clientDietPlan,
    });
  } catch (error) {
    console.error("Error creating client diet plan:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all ClientDietPlans
exports.getAllClientDietPlans = async (req, res) => {
  try {
    const clientDietPlans = await ClientDietPlan.findAll({
      include: [
        { model: User, as: "client", attributes: ["id", "user_name", "user_email"] },
        { model: User, as: "trainer", attributes: ["id", "user_name", "user_email"] },
      ],
    });

    return res.status(200).json({
      message: "Client Diet Plans fetched successfully",
      data: clientDietPlans,
    });
  } catch (error) {
    console.error("Error fetching client diet plans:", error);
    return res.status(500).json({ message: "Error fetching client diet plans", error: error.message });
  }
};

// Get by ID
exports.getClientDietPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await ClientDietPlan.findByPk(id, {
      include: [
        { model: User, as: "client", attributes: ["id"] },
        { model: User, as: "trainer", attributes: ["id"] },
      ],
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

// Update
exports.updateClientDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const plan = await ClientDietPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Client Diet Plan not found" });

    await plan.update(data);
    return res.status(200).json({ message: "Client Diet Plan updated successfully", data: plan });
  } catch (error) {
    console.error("Error updating client diet plan:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update pricing only
exports.updateClientDietPlanPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast_price, lunch_price, dinner_price, combo_price } = req.body;

    const plan = await ClientDietPlan.findByPk(id);
    if (!plan) return res.status(404).json({ message: "Client Diet Plan not found" });

    await plan.update({ breakfast_price, lunch_price, dinner_price, combo_price });
    return res.status(200).json({ message: "Pricing updated successfully", data: plan });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete
exports.deleteClientDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await ClientDietPlan.findByPk(id);

    if (!plan) return res.status(404).json({ message: "Client Diet Plan not found" });

    await plan.destroy();
    return res.status(200).json({ message: "Client Diet Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting client diet plan:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get plans by userId and trainerId
exports.getDietPlansByUserAndTrainer = async (req, res) => {
  const { userId, trainerId } = req.params;
  try {
    const plans = await ClientDietPlan.findAll({
      where: { user_id: userId, trainer_id: trainerId },
      include: [
        { model: User, as: "client", attributes: ["id", "user_name", "user_email"] },
        { model: User, as: "trainer", attributes: ["id"] },
      ],
    });

    return res.status(200).json({ message: "Diet plans fetched", data: plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Create Workout
exports.createClientWorkout = async (req, res) => {
  try {
    const { user_id, trainer_id, day, body_part, exercise_name, sets, reps, duration_min, remark, media_url, media_type } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trainer = await User.findByPk(trainer_id);
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    const workout = await ClientWorkout.create({ user_id, trainer_id, day, body_part, exercise_name, sets, reps, duration_min, remark, media_url, media_type });

    return res.status(201).json({ message: "Workout created successfully", data: workout });
  } catch (error) {
    console.error("Error creating workout:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};