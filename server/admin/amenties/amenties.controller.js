const { v4: uuidv4 } = require("uuid");
const AmenitiesModel = require("./amenties.model");
const AUTH_SECRET = process.env.AUTH_SECRET;

const validateAuth = (req) => {
  const apiKey = req.headers["x-api-key"];
  const correlationId = req.headers["x-correlation-id"] || uuidv4();
  if (!apiKey || apiKey !== AUTH_SECRET) {
    return { valid: false, correlationId };
  }
  return { valid: true, correlationId };
};

// CREATE
exports.createAmenities = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }],
    });
  }

  try {
    const { workout_type, closing_date, gym_name, facilities, about_us } = req.body;
    const newAmenities = await AmenitiesModel.create({ workout_type, closing_date, gym_name, facilities, about_us });

    return res.status(200).json({
      meta: { "correlation-id": correlationId, code: 200, message: "Amenities created successfully" },
      data: newAmenities,
    });
  } catch (error) {
    console.error("Create error:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message, displayMessage: "Internal Server Error" }],
    });
  }
};

// GET ALL
exports.getAllAmenities = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }],
    });
  }

  try {
    const amenities = await AmenitiesModel.findAll();
    return res.status(200).json({
      meta: { "correlation-id": correlationId, code: 200, message: "Fetched successfully" },
      data: amenities,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message, displayMessage: "Internal Server Error" }],
    });
  }
};

// GET BY ID
exports.getAmenitiesById = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }],
    });
  }

  try {
    const { id } = req.params;
    const amenities = await AmenitiesModel.findByPk(id);

    if (!amenities) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Not found", displayMessage: "No record found" }],
      });
    }

    return res.status(200).json({
      meta: { "correlation-id": correlationId, code: 200, message: "Fetched successfully" },
      data: amenities,
    });
  } catch (error) {
    console.error("Get by ID error:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message, displayMessage: "Internal Server Error" }],
    });
  }
};

// UPDATE
exports.updateAmenities = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }],
    });
  }

  try {
    const { id } = req.params;
    const updates = req.body;
    const amenities = await AmenitiesModel.findByPk(id);

    if (!amenities) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Not found", displayMessage: "No record found" }],
      });
    }

    await amenities.update(updates);
    return res.status(200).json({
      meta: { "correlation-id": correlationId, code: 200, message: "Updated successfully" },
      data: amenities,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message, displayMessage: "Internal Server Error" }],
    });
  }
};

// DELETE
exports.deleteAmenities = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }],
    });
  }

  try {
    const { id } = req.params;
    const amenities = await AmenitiesModel.findByPk(id);

    if (!amenities) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Not found", displayMessage: "No record found" }],
      });
    }

    await amenities.destroy();
    return res.status(200).json({
      meta: { "correlation-id": correlationId, code: 200, message: "Deleted successfully" },
      data: { deleted: true },
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message, displayMessage: "Internal Server Error" }],
    });
  }
};
