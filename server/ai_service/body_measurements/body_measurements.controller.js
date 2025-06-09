const BodyMeasurements = require("./body_measurements.model");

exports.createBodyMeasurement = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const measurementData = req.body.data;
    if (!measurementData) {
      return res
        .status(400)
        .json({ success: false, message: "Data is required" });
    }

    const newMeasurement = await BodyMeasurements.create({
      user_id: userId,
      data: measurementData,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Body measurement data saved successfully",
      data: newMeasurement,
    });
  } catch (error) {
    console.error("Error creating body measurement:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getBodyMeasurements = async (req, res) => {
  try {
    const userId = req.user.id ?? req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const measurements = await BodyMeasurements.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: measurements,
    });
  } catch (error) {
    console.error("Error fetching body measurements:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
