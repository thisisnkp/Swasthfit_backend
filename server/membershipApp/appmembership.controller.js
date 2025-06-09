const {
  MembershipService,
  CurrentUserSubscription,
  UserSubscriptionHistory,
} = require("./appmembership.model");

// Create a new membership service plan
exports.createPlan = async (req, res) => {
  try {
    const {
      created_by,
      name,
      type,
      description,
      features,
      duration,
      status,
      discount,
      price,
    } = req.body;

    if (!created_by || !name || !price) {
      return res.status(400).json({
        success: false,
        message: "created_by, name, and price are required fields.",
      });
    }

    const newPlan = await MembershipService.create({
      created_by,
      name,
      type,
      description,
      features,
      duration,
      status: status || "active",
      discount,
      price,
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      data: newPlan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Delete a membership service plan by id
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipService.findByPk(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    await plan.destroy();

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Update a membership service plan by id (optional)
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await MembershipService.findByPk(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    await plan.update(req.body);

    res.status(200).json({
      success: true,
      message: "Plan updated successfully.",
      data: plan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Get all membership service plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipService.findAll({
      attributes: [
        "id",
        "name",
        "type",
        "price",
        "duration",
        "status",
        "discount",
        "description",
        "features",
      ],
      where: { status: "active" },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Plans fetched successfully.",
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// User plan selection API - calculate total cost and breakdown
exports.userPlanSelection = async (req, res) => {
  try {
    const { selectedPlans } = req.body; // expected format: [{ planId: 1, frequency: "3 month" }, ...]

    if (!Array.isArray(selectedPlans) || selectedPlans.length === 0) {
      return res.status(400).json({
        success: false,
        message: "selectedPlans must be a non-empty array.",
      });
    }

    // Fetch all selected plans from DB
    const planIds = selectedPlans.map((p) => p.planId);
    const plans = await MembershipService.findAll({
      where: { id: planIds, status: "active" },
    });

    if (plans.length !== selectedPlans.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected plans are invalid or inactive.",
      });
    }

    // Calculate total cost
    let totalCost = 0;
    const breakdown = [];

    for (const selPlan of selectedPlans) {
      const plan = plans.find((p) => p.id === selPlan.planId);
      let frequencyStr = selPlan.frequency || "3 month";

      // Extract month number from frequency string
      const match = frequencyStr.trim().match(/(\d+)\s*months?/i);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: `Invalid frequency format for planId ${selPlan.planId}. Expected format like '3 month', '6 month', '12 months'.`,
        });
      }
      const months = parseInt(match[1], 10);

      const cost = parseFloat(plan.price) * months;
      totalCost += cost;

      breakdown.push({
        planId: plan.id,
        name: plan.name,
        price: plan.price,
        frequency: frequencyStr,
        months,
        cost,
      });
    }

    res.status(200).json({
      success: true,
      message: "User plan selection calculated successfully.",
      data: {
        totalCost,
        breakdown,
      },
    });
  } catch (error) {
    console.error("Error in user plan selection:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// New method to calculate and save subscription details and upsert current active plan
exports.userSubscriptionConfirmation = async (req, res) => {
  try {
    const { user_id, selectedPlans } = req.body; // selectedPlans: [{ planId, frequency }, ...]

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required.",
      });
    }

    if (!Array.isArray(selectedPlans) || selectedPlans.length === 0) {
      return res.status(400).json({
        success: false,
        message: "selectedPlans must be a non-empty array.",
      });
    }

    // Fetch all selected plans from DB
    const planIds = selectedPlans.map((p) => p.planId);
    const plans = await MembershipService.findAll({
      where: { id: planIds, status: "active" },
    });

    if (plans.length !== selectedPlans.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected plans are invalid or inactive.",
      });
    }

    // Calculate total cost and breakdown
    let totalCost = 0;
    const breakdown = [];

    for (const selPlan of selectedPlans) {
      const plan = plans.find((p) => p.id === selPlan.planId);
      let frequencyStr = selPlan.frequency || "3 month";

      // Extract month number from frequency string
      const match = frequencyStr.trim().match(/(\d+)\s*months?/i);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: `Invalid frequency format for planId ${selPlan.planId}. Expected format like '3 month', '6 month', '12 months'.`,
        });
      }
      const months = parseInt(match[1], 10);

      const cost = parseFloat(plan.price) * months;
      totalCost += cost;

      breakdown.push({
        planId: plan.id,
        name: plan.name,
        price: plan.price,
        frequency: frequencyStr,
        months,
        cost,
      });
    }

    // Prepare data for saving
    const starting_date =
      req.body.starting_date || new Date().toISOString().slice(0, 10);
    const ending_date =
      req.body.ending_date ||
      new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .slice(0, 10);
    const payment_status = req.body.payment_status || "pending";
    const payment_method = req.body.payment_method || null;

    // Save to user_subscription_history
    await UserSubscriptionHistory.create({
      user_id,
      plans: breakdown,
      amount: totalCost,
      payment_status,
      payment_method,
      starting_date,
      ending_date,
    });

    // Upsert current_user_subscription
    const [record, created] = await CurrentUserSubscription.upsert(
      {
        user_id,
        plans: breakdown,
        amount: totalCost,
        payment_status,
        payment_method,
        starting_date,
        ending_date,
      },
      {
        where: { user_id },
      }
    );

    res.status(200).json({
      success: true,
      message:
        "User plan selection calculated and subscription details saved successfully.",
      data: {
        totalCost,
        breakdown,
        currentPlan: record,
        created,
      },
    });
  } catch (error) {
    console.error("Error in userSubscriptionConfirmation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
