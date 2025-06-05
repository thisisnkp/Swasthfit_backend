const MailSetting = require("../../model/email_configuration.model");

const extractMailSettingData = (body) => {
  const {
    mail_type,
    mail_host,
    mail_port,
    email,
    smtp_username,
    smtp_password,
    mail_encryption,
  } = body;
  return {
    mail_type,
    mail_host,
    mail_port,
    email,
    smtp_username,
    smtp_password,
    mail_encryption,
  };
};

/**
 * @desc    Get mail settings for a specific gym
 * @route   GET /api/mail-settings
 * @access  Private (assuming some auth middleware would be here)
 */
exports.getMailSettings = async (req, res) => {
  try {
    const gymId = req.params.id;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "Gym ID is required in headers.",
      });
    }

    const settings = await MailSetting.findOne({
      where: { gym_id: gymId },
    });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: `Mail settings not found for Gym ID: ${gymId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching mail settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching mail settings.",
      error: error.message,
    });
  }
};

/**
 * @desc    Create or Update mail settings for a specific gym
 * @route   POST /api/mail-settings
 * @access  Private
 */
exports.upsertMailSettings = async (req, res) => {
  try {
    const gymId = req.headers["gym-id"];

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "Gym ID is required in headers.",
      });
    }

    const dataToUpsert = extractMailSettingData(req.body);

    let settings = await MailSetting.findOne({
      where: { gym_id: gymId },
    });

    let httpStatus = 200;
    let responseMessage = "Mail settings updated successfully.";

    if (settings) {
      await settings.update(dataToUpsert);
    } else {
      settings = await MailSetting.create({
        ...dataToUpsert,
        gym_id: gymId,
      });
      httpStatus = 201;
      responseMessage = "Mail settings created successfully.";
    }

    res.status(httpStatus).json({
      success: true,
      message: responseMessage,
      data: settings,
    });
  } catch (error) {
    console.error("Error creating/updating mail settings:", error);

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while saving mail settings.",
      error: error.message,
    });
  }
};
