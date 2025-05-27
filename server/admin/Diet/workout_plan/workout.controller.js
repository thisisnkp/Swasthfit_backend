const { v4: uuidv4 } = require("uuid");
const WorkoutModel = require("./workout.model");

const trainerModel = require("../../../user/trainer.model");
const userModel = require("../../../user/user.model");

exports.assignWorkout = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    // 1. Validate API Key
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    const workoutData = req.body;
    if (
      !workoutData.trainer_id ||
      !workoutData.user_id ||
      !workoutData.schedule ||
      !Array.isArray(workoutData.schedule)
    ) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing or invalid required fields",
            displayMessage: "trainer_id, user_id, and schedule are required",
          },
        ],
      });
    }

    // 4. Check if the trainer exists
    const trainer = await trainerModel.findOne({
      where: { id: workoutData.trainer_id },
    });
    if (!trainer) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Trainer not found",
            displayMessage: "Trainer not found",
          },
        ],
      });
    }

    // 5. Check if the user (client) exists
    const client = await userModel.findOne({
      where: { id: workoutData.user_id },
    });
    if (!client) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Client not found",
            displayMessage: "Client not found",
          },
        ],
      });
    }

    // 6. Update the user's record in the users table to store the trainer's id
    await userModel.update(
      { trainer_id: workoutData.trainer_id },
      { where: { id: workoutData.user_id } }
    );

    // 7. Update the trainer's record in the trainers table to store the user's id
    await trainerModel.update(
      { user_id: workoutData.user_id },
      { where: { id: workoutData.trainer_id } }
    );

    // 8. Create the workout entries
    for (const dayObj of workoutData.schedule) {
      if (!dayObj.day || !dayObj.exercises || !Array.isArray(dayObj.exercises)) {
        return res.status(400).json({
          errors: [
            {
              code: "REQ002",
              message: "Day or exercises array is missing",
              displayMessage: `Invalid schedule format for day: ${JSON.stringify(dayObj)}`,
            },
          ],
        });
      }

      for (const exercise of dayObj.exercises) {
        // Additional validation if needed
        await WorkoutModel.create({
          id: uuidv4(),
          trainer_id: workoutData.trainer_id,
          user_id: workoutData.user_id,
          day: dayObj.day, // Monday, Tuesday, etc.
          category: exercise.category || "WORKOUT",
          exercise_name: exercise.exercise_name,
          sub_exercise_name: exercise.sub_exercise_name || "",
          sets: exercise.sets || 0,
          reps: exercise.reps || 0,
          duration: exercise.duration || 0,
          remark: exercise.remark || "",
          media_url: exercise.media_url || "",
          created_at: new Date(),
        });
      }
    }

    // 9. Return success response
    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: {
        status: "Workout successfully assigned",
      },
    });
  } catch (error) {
    console.error("Error assigning workout:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};


exports.deleteWorkout = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || require("uuid").v4();

    // API Key validation
    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH001",
            message: "Invalid API Key",
            displayMessage: "Authentication failed",
          },
        ],
      });
    }

    const { workout_id, trainer_id } = req.params; // Workout ID & Trainer ID from request params

    // Check if the workout exists
    const existingWorkout = await WorkoutModel.findOne({
      where: { id: workout_id },
    });

    if (!existingWorkout) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Workout not found",
            displayMessage: "No workout exists for the provided ID",
          },
        ],
      });
    }

    // Check if the trainer exists
    const trainer = await trainerModel.findOne({
      where: { id: trainer_id },
    });

    if (!trainer) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Trainer not found",
            displayMessage: "Trainer not found",
          },
        ],
      });
    }

    // Ensure only the trainer who created the workout can delete it
    if (existingWorkout.trainer_id !== trainer_id) {
      return res.status(403).json({
        errors: [
          {
            code: "AUTH002",
            message: "Unauthorized delete attempt",
            displayMessage: "You are not authorized to delete this workout",
          },
        ],
      });
    }

    // Delete the workout
    await WorkoutModel.destroy({ where: { id: workout_id } });

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Workout deleted successfully",
      },
      data: {
        status: "Workout has been removed",
      },
    });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};





exports.updateWorkout = async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const correlationId = req.headers["x-correlation-id"] || uuidv4();
  
      // API Key validation
      if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
        return res.status(403).json({
          errors: [
            {
              code: "AUTH001",
              message: "Invalid API Key",
              displayMessage: "Authentication failed",
            },
          ],
        });
      }
  
      // Extract parameters from URL: workout id and trainer id
      const { id, trainer_id } = req.params;
      if (!id || !trainer_id) {
        return res.status(400).json({
          errors: [
            {
              code: "REQ001",
              message: "Missing required parameters",
              displayMessage: "Workout ID and Trainer ID are required",
            },
          ],
        });
      }
  
      // Validate required fields in the request body
      const workoutData = req.body;
      if (!workoutData.day || !workoutData.exercise_name) {
        return res.status(400).json({
          errors: [
            {
              code: "REQ001",
              message: "Missing required fields in request body",
              displayMessage: workoutData,
            },
          ],
        });
      }
  
      // Verify that the workout record exists
      const existingWorkout = await WorkoutModel.findOne({ where: { id } });
      if (!existingWorkout) {
        return res.status(404).json({
          errors: [
            {
              code: "NOT_FOUND",
              message: "Workout not found",
              displayMessage: "No workout exists for the provided id",
            },
          ],
        });
      }
  
      // Ensure that the trainer attempting the update is the one who originally assigned this workout.
      // Convert both values to strings before comparing.
      if (existingWorkout.trainer_id.toString() !== trainer_id.toString()) {
        return res.status(403).json({
          errors: [
            {
              code: "AUTH002",
              message: "Unauthorized update attempt",
              displayMessage: "You are not authorized to update this workout",
            },
          ],
        });
      }
  
      // Update the workout record with new values; if a field is not provided, retain the existing value.
      await WorkoutModel.update(
        {
          day: workoutData.day,
          category: workoutData.category || existingWorkout.category,
          exercise_name: workoutData.exercise_name,
          sub_exercise_name: workoutData.sub_exercise_name || existingWorkout.sub_exercise_name,
          sets: workoutData.sets !== undefined ? workoutData.sets : existingWorkout.sets,
          reps: workoutData.reps !== undefined ? workoutData.reps : existingWorkout.reps,
          duration: workoutData.duration !== undefined ? workoutData.duration : existingWorkout.duration,
          remark: workoutData.remark || existingWorkout.remark,
          media_url: workoutData.media_url || existingWorkout.media_url,
          // updated_at will be auto-updated if timestamps are enabled.
        },
        { where: { id } }
      );
  
      // Retrieve the updated workout record
      const updatedWorkout = await WorkoutModel.findOne({ where: { id } });
  
      return res.status(200).json({
        meta: {
          "correlation-id": correlationId,
          code: 200,
          message: "Operation successful",
        },
        data: updatedWorkout,
      });
    } catch (error) {
      console.error("Error updating workout:", error);
      return res.status(500).json({
        errors: [
          {
            code: "SERVER_ERROR",
            message: error.message,
            displayMessage: "Internal Server Error",
          },
        ],
      });
    }
  };


  exports.getWorkoutsForTrainer = async (req, res) => {
    try {
      const apiKey = req.headers["x-api-key"];
      const correlationId = req.headers["x-correlation-id"] || uuidv4();
  
      // Validate API Key
      if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
        return res.status(403).json({
          errors: [
            {
              code: "AUTH001",
              message: "Invalid API Key",
              displayMessage: "Authentication failed",
            },
          ],
        });
      }
  
      // Extract trainer_id from URL parameters
      const { trainer_id } = req.params;
      if (!trainer_id) {
        return res.status(400).json({
          errors: [
            {
              code: "REQ001",
              message: "Missing required parameter",
              displayMessage: "Trainer ID is required",
            },
          ],
        });
      }
  
      // Verify that the trainer exists
      const trainer = await trainerModel.findOne({ where: { id: trainer_id } });
      if (!trainer) {
        return res.status(404).json({
          errors: [
            {
              code: "NOT_FOUND",
              message: "Trainer not found",
              displayMessage: "Trainer not found",
            },
          ],
        });
      }
  
      // Fetch all workouts associated with the trainer_id
      const workouts = await WorkoutModel.findAll({ where: { trainer_id } });
  
      return res.status(200).json({
        meta: {
          "correlation-id": correlationId,
          code: 200,
          message: "Operation successful",
        },
        data: workouts,
      });
    } catch (error) {
      console.error("Error fetching workouts for trainer:", error);
      return res.status(500).json({
        errors: [
          {
            code: "SERVER_ERROR",
            message: error.message,
            displayMessage: "Internal Server Error",
          },
        ],
      });
    }
  };