const FaceAnalyzed = require("./face_analyzed.model");

exports.createFaceAnalyzed = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const analyzedData = req.body.data;
    if (!analyzedData) {
      return res
        .status(400)
        .json({ success: false, message: "Data is required" });
    }

    const newAnalyzed = await FaceAnalyzed.create({
      user_id: userId,
      data: analyzedData,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Face analyzed data saved successfully",
      data: newAnalyzed,
    });
  } catch (error) {
    console.error("Error creating face analyzed data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getFaceAnalyzed = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const analyzedRecords = await FaceAnalyzed.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: analyzedRecords,
    });
  } catch (error) {
    console.error("Error fetching face analyzed data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
