const express = require("express");
const router = express.Router();
const bloodReportController = require("./bloodReport.controller");

router.post("/blood_reports", bloodReportController.createBloodReport);
router.get("/blood_reports", bloodReportController.getBloodReports);

module.exports = router;
