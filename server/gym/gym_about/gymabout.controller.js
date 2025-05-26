const GymAbout = require("./gymabout.model");

// Create or update gym about info
exports.createOrUpdateGym = async (req, res) => {
  try {
    const { gym_id } = req.body;
    let gym;
    if (gym_id) {
      gym = await GymAbout.findOne({ where: { gym_id } });
      if (gym) {
        await gym.update(req.body);
        return res
          .status(200)
          .json({ success: true, message: "Gym updated", data: gym });
      }
    }
    const newGym = await GymAbout.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Gym created", data: newGym });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all gyms
exports.getAllGyms = async (req, res) => {
  try {
    const gyms = await GymAbout.findAll();
    res.status(200).json({ success: true, data: gyms });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get gym by gym_id
exports.getGymById = async (req, res) => {
  try {
    const { gym_id } = req.params;
    const gym = await GymAbout.findOne({ where: { gym_id } });
    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }
    res.status(200).json({ success: true, data: gym });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update gym about
exports.updateGymAbout = async (req, res) => {
  try {
    const gymAbout = await GymAbout.findByPk(req.params.id);
    if (!gymAbout) {
      return res.status(404).json({ message: "Gym about not found" });
    }
    await gymAbout.update(req.body);
    res.status(200).json(gymAbout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete gym about
exports.deleteGymAbout = async (req, res) => {
  try {
    const gymAbout = await GymAbout.findByPk(req.params.id);
    if (!gymAbout) {
      return res.status(404).json({ message: "Gym about not found" });
    }
    await gymAbout.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
