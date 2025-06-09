const FoodAnalyzed = require("./food_analyzed.model");

exports.createFoodAnalyzed = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const foodDescription = req.body.food_discription;
    const analyzedData = req.body.data;

    if (!foodDescription || !analyzedData) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Food description and data are required",
        });
    }

    const newAnalyzed = await FoodAnalyzed.create({
      user_id: userId,
      food_discription: foodDescription,
      data: analyzedData,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Food analyzed data saved successfully",
      data: newAnalyzed,
    });
  } catch (error) {
    console.error("Error creating food analyzed data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getFoodAnalyzed = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const analyzedRecords = await FoodAnalyzed.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: analyzedRecords,
    });
  } catch (error) {
    console.error("Error fetching food analyzed data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
