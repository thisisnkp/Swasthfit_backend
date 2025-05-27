const { v4: uuidv4 } = require("uuid");
const MembershipPlan = require("./membership_plans.model");

/**
 * Middleware-like function to validate API key
 */
const validateApiKey = (req) => {
  const apiKey = req.headers["x-api-key"];
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
    return {
      error: {
        status: 403,
        response: {
          errors: [
            {
              code: "AUTH001",
              message: "Invalid API Key",
              displayMessage: "Authentication failed",
            },
          ],
        },
      },
      correlationId,
    };
  }
  return { correlationId };
};

/**
 * Create a new membership plan
 */

exports.createMembershipPlan = async (req, res) => {
  console.log("hit membership plan");
  console.log("req.body", req.body);
  console.log("req.user", req.user);

  const validation = validateApiKey(req);
  if (validation.error) {
    return res.status(validation.error.status).json(validation.error.response);
  }

  try {
    const {
      name,
      type,
      features,
      price,
      status,
      description,
      membership_type,
      duration,
    } = req.body;

    // Extract user_role and gym_id from req.user
    const { user_role: created_by, gym_id } = req.user;
    console.log("user_role", created_by);
    console.log("gym_id", gym_id);

    // Validate required fields robustly
    const requiredFields = { name, type, features, price, status };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({
          errors: [
            { code: "REQ001", message: `Missing required field: ${key}` },
          ],
        });
      }
    }

    // Optional enum validations for safety
    const validCreatedBy = ["owner", "admin", "staff"];
    const validNames = ["silver", "gold", "platinum"];
    const validStatuses = ["active", "inactive"];

    if (!validCreatedBy.includes(created_by)) {
      return res.status(400).json({
        errors: [{ code: "ENUM001", message: "Invalid value for created_by" }],
      });
    }

    if (!validNames.includes(name)) {
      return res.status(400).json({
        errors: [{ code: "ENUM002", message: "Invalid value for name" }],
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        errors: [{ code: "ENUM003", message: "Invalid value for status" }],
      });
    }

    // Create the membership plan
    const membershipPlan = await MembershipPlan.create({
      created_by,
      gym_id,
      name,
      type,
      features,
      price,
      status,
      description,
      membership_type,
      duration,
    });

    return res.status(201).json({
      message: "Membership plan created successfully",
      correlationId: validation.correlationId,
      data: membershipPlan,
    });
  } catch (error) {
    console.error("Error creating membership plan:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

/**
 * Update membership plan
 */
exports.updateMembershipPlan = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const { id } = req.params;
    const { created_by, gym_id } = req.body;

    const membershipPlan = await MembershipPlan.findByPk(id);
    if (!membershipPlan) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership plan not found" }],
      });
    }

    // Ensure gym_id is updated only if created_by is 'Gym', otherwise set it to null
    const finalGymId = created_by === "Gym" ? gym_id : null;

    await membershipPlan.update({
      ...req.body,
      gym_id: finalGymId,
    });

    return res.status(200).json({
      message: "Membership plan updated successfully",
      correlationId: validation.correlationId,
      data: membershipPlan,
    });
  } catch (error) {
    console.error("Error updating membership plan:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

exports.getMembershipPlansByGym = async (req, res) => {
  console.log("Fetching membership plans for gym");
  console.log("req.user", req.user);

  // const validation = validateApiKey(req);
  // if (validation.error) {
  //   return res.status(validation.error.status).json(validation.error.response);
  // }

  try {
    // Extract gym_id from req.user
    const gym_id = 4;

    // Validate gym_id
    if (!gym_id) {
      return res.status(400).json({
        errors: [{ code: "REQ001", message: "Missing gym_id in user data" }],
      });
    }

    // Fetch membership plans for the gym
    const membershipPlans = await MembershipPlan.findAll({
      where: { gym_id },
    });

    // Check if any membership plans exist
    if (!membershipPlans || membershipPlans.length === 0) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "No membership plans found for this gym",
          },
        ],
      });
    }

    return res.status(200).json({
      message: "Membership plans fetched successfully",
      data: membershipPlans,
    });
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};
