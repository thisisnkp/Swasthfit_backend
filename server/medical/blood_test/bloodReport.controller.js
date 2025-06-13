const BloodReport = require("./blood_report.model");

const createBloodReport = async (req, res) => {
  try {
    const { user_id, data } = req.body;
    if (!user_id || !data) {
      return res.status(400).json({ message: "user_id and data are required" });
    }
    const newReport = await BloodReport.create({ user_id, data });
    return res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating blood report:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBloodReports = async (req, res) => {
  try {
    const reports = await BloodReport.findAll();
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching blood reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBloodReport,
  getBloodReports,
};
