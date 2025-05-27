const User = require("../../../user/user.model");
const Trainer = require("../../../user/trainer.model");

// Controller to check user and trainer data with gym_id verification
async function checkAndUpdateTrainer(req, res) {
  try {
    const { email, name, gym_id } = req.body;

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id is required",
      });
    }

    // First check if user exists with given email and name
    const user = await User.findOne({
      where: {
        user_email: email,
        user_name: name,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with provided email and name",
      });
    }

    // Update user type to gym-trainer
    await user.update({ user_type: "gym-trainer" });

    // Check if trainer exists for this user
    const trainer = await Trainer.findOne({
      where: {
        user_id: user.id,
      },
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found for this user",
        user: user,
      });
    }

    // Check if gym_id needs to be updated
    if (trainer.gym_id !== gym_id) {
      await trainer.update({ gym_id: gym_id });
    }

    return res.status(200).json({
      success: true,
      message: "User and trainer data updated successfully",
      user: user,
      trainer: trainer,
    });
  } catch (error) {
    console.error("Error in checkAndUpdateTrainer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function createTrainerWithUser(req, res) {
  try {
    const {
      email,
      name,
      gym_id,
      firstname,
      lastname,
      profile_photo,
      transformation_photos,
      address,
      expertise,
      experience,
      bank_account_no,
      ifsc_code,
      time_slot,
      client_price,
    } = req.body;

    // First check if user exists with the email
    const user = await User.findOne({
      where: {
        user_email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with provided email",
      });
    }

    // User exists, create trainer with user_id
    const trainer = await Trainer.create({
      user_id: user.id,
      gym_id,
      firstname,
      lastname,
      profile_photo,
      transformation_photos,
      address,
      expertise,
      experience,
      bank_account_no,
      ifsc_code,
      time_slot,
      client_price,
    });

    // Update user's trainer_id and type
    await user.update({
      trainer_id: trainer.id,
      user_type: "gym-trainer",
    });

    return res.status(200).json({
      success: true,
      message: "Trainer created successfully",
      user: user,
      trainer: trainer,
    });
  } catch (error) {
    console.error("Error in createTrainerWithUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getTrainersByGymId(req, res) {
  try {
    const { gym_id } = req.params;

    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id is required",
      });
    }

    const trainers = await Trainer.findAll({
      where: {
        gym_id: gym_id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_name", "user_email", "user_mobile", "user_type"],
        },
      ],
    });

    if (!trainers || trainers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trainers found for this gym",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trainers retrieved successfully",
      trainers: trainers,
    });
  } catch (error) {
    console.error("Error in getTrainersByGymId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  checkAndUpdateTrainer,

  createTrainerWithUser,
  getTrainersByGymId,
};
