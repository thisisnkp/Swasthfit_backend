const GymOwner = require("./gym_owners/gym.model");
// const { validateApiKey } = require("../../middleware/auth");

const validateApiKey = (req) => {
  const apiKey = req.headers["x-api-key"];
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
    };
  }
};

exports.createGymOwner = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);
  try {
    const owner = await GymOwner.create(req.body);
    return res.status(201).json({
      message: "Gym Owner created successfully",
      data: owner,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllGymOwners = async (req, res) => {
  try {
    const owners = await GymOwner.findAll();
    return res.status(200).json({ data: owners });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getGymOwnerById = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    return res.status(200).json({ data: owner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    await owner.update(req.body);
    return res
      .status(200)
      .json({ message: "Updated successfully", data: owner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteGymOwner = async (req, res) => {
  try {
    const owner = await GymOwner.findByPk(req.params.id);
    if (!owner) return res.status(404).json({ message: "Gym Owner not found" });
    await owner.destroy();
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createGym = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user's information
    const userRole = req.user.role_name; // Extract the user's role

    // Check if the user is an owner
    if (userRole !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only owners can create gyms.",
      });
    }

    // Proceed with gym creation
    const gym = await Gym.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Gym created successfully",
      data: gym,
    });
  } catch (error) {
    console.error("Error creating gym:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
