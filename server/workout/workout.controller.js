const { Day, WorkoutDetail, Exercise, BodyPart } = require("./model/index");

exports.getDays = async (req, res) => {
  try {
    const days = await Day.findAll();
    res.status(200).json({ success: true, data: days });
  } catch (error) {
    console.error("Error fetching days:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve days",
      error: error.message,
    });
  }
};

// controllers/bodyPartController.js
exports.getBodyParts = async (req, res) => {
  try {
    const bodyParts = await BodyPart.findAll();
    res.status(200).json({ success: true, data: bodyParts });
  } catch (error) {
    console.error("Error fetching body parts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve body parts",
      error: error.message,
    });
  }
};

// controllers/exerciseController.js
exports.getExercisesByBodyPart = async (req, res) => {
  try {
    const { bodyPartId } = req.params;
    const exercises = await Exercise.findAll({
      where: { body_part_id: bodyPartId },
      include: [{ model: BodyPart, as: "bodyPart", attributes: ["name"] }],
    });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exercises found for this body part.",
      });
    }

    res.status(200).json({ success: true, data: exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exercises",
      error: error.message,
    });
  }
};

// controllers/workoutDetailController.js
exports.createWorkoutDetail = async (req, res) => {
  try {
    const {
      exerciseId,
      dayId,
      sets,
      reps,
      duration,
      remark,
      videoLink,
      userId,
    } = req.body; // Include userId if applicable

    const trainerId = req.user?.id; // Extract trainer_id from token

    const newWorkout = await WorkoutDetail.create({
      exercise_id: exerciseId,
      day_id: dayId,
      sets,
      reps,
      duration,
      remark,
      video_link: videoLink,
      user_id: userId, // If personalized
      trainer_id: trainerId, // Set trainer_id from token
    });
    res.status(201).json({
      success: true,
      message: "Workout detail created successfully",
      data: newWorkout,
    });
  } catch (error) {
    console.error("Error creating workout detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create workout detail",
      error: error.message,
    });
  }
};

exports.getWorkoutDetail = async (req, res) => {
  try {
    const { dayId, exerciseId, userId } = req.query; // Assuming you'll query by day, exercise, and optionally user

    // Build where clause based on provided parameters
    const whereClause = {};
    if (dayId) whereClause.day_id = dayId;
    if (exerciseId) whereClause.exercise_id = exerciseId;
    if (userId) {
      // If workouts are personalized per user
      whereClause.userId = userId;
    }

    const workoutDetail = await WorkoutDetail.findOne({
      where: whereClause,
      include: [
        {
          model: Exercise,
          as: "exercise",
          attributes: ["name"],
        },
        { model: Day, as: "day", attributes: ["name"] },
        // { model: User, as: 'user', attributes: ['username'] } // If personalized
      ],
    });

    if (!workoutDetail) {
      return res
        .status(404)
        .json({ success: false, message: "Workout detail not found." });
    }

    res.status(200).json({ success: true, data: workoutDetail });
  } catch (error) {
    console.error("Error fetching workout detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workout detail",
      error: error.message,
    });
  }
};

exports.updateWorkoutDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { sets, reps, duration, remark, videoLink } = req.body;

    const trainerId = req.user?.id; // Extract trainer_id from token

    const [updatedRows] = await WorkoutDetail.update(
      {
        sets,
        reps,
        duration,
        remark,
        video_link: videoLink,
        trainer_id: trainerId,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Workout detail not found or no changes made.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Workout detail updated successfully" });
  } catch (error) {
    console.error("Error updating workout detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update workout detail",
      error: error.message,
    });
  }
};
