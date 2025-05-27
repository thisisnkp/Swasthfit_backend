const { MembershipPlanGym } = require("./membershipPlans.model"); // Adjust the path as necessary to fit your project structure

exports.createMembershipPlan = async (req, res) => {
  try {
    const {
      createdBy,
      type,
      gymId,
      name,
      features,
      description,
      membershipType,
      price,
      duration,
      status,
    } = req.body;

    // Validate input based on createdBy
    if (createdBy === "gym" && !gymId) {
      return res.status(400).send({
        message: "Gym ID is required when the plan is created by a gym.",
      });
    }

    // Create new membership plan
    const newPlan = await MembershipPlanGym.create({
      createdBy,
      type,
      gymId: createdBy === "admin" ? null : gymId,
      name,
      features,
      description,
      membershipType,
      price,
      duration,
      status,
    });

    // Return the newly created plan
    return res.status(201).send(newPlan);
  } catch (error) {
    return res.status(500).send({
      message: "Failed to create membership plan",
      error: error.message,
    });
  }
};

// get gymList
// ... existing code ...

// get gymList
exports.getMembershipPlans = async (req, res) => {
  try {
    const { gym_id } = req.user; // Get gym_id from req.user

    if (!gym_id) {
      return res.status(400).send({
        success: false,
        message: "Gym ID is required",
      });
    }

    const plans = await MembershipPlanGym.findAll({
      where: {
        gymId: gym_id,
        status: "active", // Optional: Only get active plans
      },
      order: [["createdAt", "DESC"]], // Optional: Sort by newest first
    });

    if (plans.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No membership plans found for this gym.",
      });
    }

    return res.status(200).send({
      success: true,
      data: plans,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error retrieving membership plans",
      error: error.message,
    });
  }
};

// Update membership plan
const updateMembershipPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { role, id: userId } = req.user; // Assume 'id' and 'role' are stored in JWT
    const plan = await MembershipPlanGym.findOne({
      where: {
        id: planId,
        ...(role === "gym" && { gymId: userId, createdBy: "gym" }),
        ...(role === "admin" && { createdBy: "admin" }),
      },
    });

    if (!plan) {
      return res
        .status(404)
        .send({ message: "Membership plan not found or access denied." });
    }

    // Update fields from request body if they exist
    Object.assign(plan, req.body);
    await plan.save();

    return res.status(200).send(plan);
  } catch (error) {
    return res.status(500).send({
      message: "Error updating membership plan",
      error: error.message,
    });
  }
};

// Delet Membership
const deleteMembershipPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { role, id: userId } = req.user; // Assume 'id' and 'role' are stored in JWT
    const plan = await MembershipPlanGym.findOne({
      where: {
        id: planId,
        ...(role === "gym" && { gymId: userId, createdBy: "gym" }),
        ...(role === "admin" && { createdBy: "admin" }),
      },
    });

    if (!plan) {
      return res
        .status(404)
        .send({ message: "Membership plan not found or access denied." });
    }

    await plan.destroy();
    return res.status(204).send(); // No content to send back
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting membership plan",
      error: error.message,
    });
  }
};
