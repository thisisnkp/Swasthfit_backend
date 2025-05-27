const { v4: uuidv4 } = require("uuid");
const notifyModel = require("./notifier.model");

exports.notifyLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    console.log("leadId", leadId);
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

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

    const leadData = req.body;
 
    console.log("leadData", req.body);
    if (
      !leadData.policyNumber ||
      !leadData.currentStep ||
      !leadData.customerName
    ) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required fields",
            displayMessage: "Invalid lead notification request",
          },
        ],
      });
    }


    await notifyModel.create({
        id: uuidv4(),
        leadId,
        ...leadData
    });

    console.log("leadData2", leadId);
    console.log(`Lead Notification Received for Lead ID: ${leadId}`, leadData);

    // console.log(`Lead Notification Received for Lead ID: ${leadId}`, leadData);

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Operation successful",
      },
      data: {
        status: "Successfully notified",
      },
    });
  } catch (error) {
    console.error("Error processing lead notification:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};
