const AdminKYCDetails = require("./admin_kyc.model");
const { v4: uuidv4 } = require("uuid");

exports.createAdminKYC = async (req, res) => {
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

    const kycData = req.body;
    // Include gym_id from request body if provided
    if (req.body.gym_id) {
      kycData.gym_id = req.body.gym_id;
    }

    const newRecord = await AdminKYCDetails.create(kycData);
    res.status(201).json({
      meta: {
        "correlation-id": uuidv4(),
        code: "201",
        message: "KYC record created successfully",
      },
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating KYC record:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.getAdminKYC = async (req, res) => {
  try {
    const record = await AdminKYCDetails.findByPk(req.params.id);
    if (!record)
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Record not found" }] });
    res.json(record);
  } catch (error) {
    console.error("Error retrieving KYC record:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.updateAdminKYC = async (req, res) => {
  try {
    const updated = await AdminKYCDetails.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated[0])
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Record not found" }] });
    res.json({ message: "KYC record updated successfully" });
  } catch (error) {
    console.error("Error updating KYC record:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

exports.deleteAdminKYC = async (req, res) => {
  try {
    const deleted = await AdminKYCDetails.destroy({
      where: { id: req.params.id },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Record not found" }] });
    res.json({ message: "KYC record deleted successfully" });
  } catch (error) {
    console.error("Error deleting KYC record:", error);
    res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};
