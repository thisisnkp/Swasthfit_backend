const db = require("../../models/models");
const { Op } = require("sequelize");

const getCampaignAnalysis = async (req, res) => {
  try {
    const { vendor_id, module_type } = req.user;

    // Get campaign analysis data
    const analysisData = await db.CampaignAnalysis.findAll({
      where: { vendor_id },
      include: [
        {
          model: db.Campaign,
          as: "campaign_details",
          where: { module_type },
          required: true,
          attributes: ["id", "product_id", "module_type"],
        },
      ],
      attributes: ["id", "vendor_id", "click", "reach", "conversion"],
      raw: true,
      nest: true,
    });

    // Fetch market report data
    const reportData = await db.Report.findAll({
      where: {
        report_id: { [Op.in]: analysisData.map((analysis) => analysis.id) },
      },
    });

    // Combine analysis data with report details
    const result = analysisData.map((analysis) => {
      const report = reportData.find((r) => r.report_id === analysis.id);
      return {
        ...analysis,
        report: report || null,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getCampaignAnalysis:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaign analysis data",
      error: error.message,
    });
  }
};

module.exports = {
  getCampaignAnalysis,
};
