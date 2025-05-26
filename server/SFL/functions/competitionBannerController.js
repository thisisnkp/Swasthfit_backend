const CompetitionBanner = require("../models/CompetitionBanner");

// Create a new competition banner
exports.createBanner = async (req, res) => {
  try {
    const { competition_id, image_url, title, description } = req.body;

    if (!competition_id || !image_url || !title) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["competition_id", "image_url", "title"],
      });
    }

    const banner = await CompetitionBanner.create({
      competition_id,
      image_url,
      title,
      description,
    });

    res.status(201).json({
      message: "Banner created successfully",
      banner,
    });
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({
      message: "Failed to create banner",
      error: err.message,
    });
  }
};

// Get active competition banners
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await CompetitionBanner.findAll({
      where: { is_active: true },
    });

    res.status(200).json({
      message: "Active banners retrieved successfully",
      banners,
    });
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({
      message: "Failed to fetch banners",
      error: err.message,
    });
  }
};
