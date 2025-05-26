const GymAmenity = require("./amenities.model");
const MemPlanAmenity = require("../model/membership_plan_amenities.model");
const { v4: uuidv4 } = require("uuid");

exports.createAmenity = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
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

    const { membership_plan_id, ...amenityData } = req.body;
    if (!membership_plan_id) {
      return res.status(400).json({
        errors: [
          {
            code: "VALIDATION_ERROR",
            message: "Membership Plan ID is required",
          },
        ],
      });
    }

    const newAmenity = await GymAmenity.create(amenityData);

    await MemPlanAmenity.create({
      membership_plan_id: membership_plan_id,
      amenity_id: newAmenity.id,
    });

    res.status(201).json({
      meta: {
        "correlation-id": uuidv4(),
        code: "201",
        message: "Amenity created and linked successfully",
      },
      data: newAmenity,
    });
  } catch (error) {
    console.error("Error creating amenity:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.getAmenity = async (req, res) => {
  try {
    const amenity = await GymAmenity.findByPk(req.params.id);
    if (!amenity)
      return res
        .status(404)
        .json({
          errors: [{ code: "NOT_FOUND", message: "Amenity not found" }],
        });
    res.json(amenity);
  } catch (error) {
    console.error("Error retrieving amenity:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await GymAmenity.findAll();
    res.json(amenities);
  } catch (error) {
    console.error("Error retrieving amenities:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.updateAmenity = async (req, res) => {
  try {
    const updated = await GymAmenity.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated[0])
      return res
        .status(404)
        .json({
          errors: [{ code: "NOT_FOUND", message: "Amenity not found" }],
        });
    res.json({ message: "Amenity updated successfully" });
  } catch (error) {
    console.error("Error updating amenity:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.deleteAmenity = async (req, res) => {
  try {
    const deleted = await GymAmenity.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res
        .status(404)
        .json({
          errors: [{ code: "NOT_FOUND", message: "Amenity not found" }],
        });
    res.json({ message: "Amenity deleted successfully" });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};
