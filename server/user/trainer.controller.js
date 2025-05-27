const Trainer = require("./trainer.model");

exports.getTrainerById = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    return res.status(200).json({ data: trainer });
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    return res.status(200).json({ data: trainers });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};