// controllers/gym/site/apis/emailTemplateController.js
const GeneralItem = require("../../model/email_templates.model"); // Adjust path to your GeneralItem model
const { Op } = require("sequelize");

// @desc    Create a new email template
// @route   POST /gym/site/apis/email-templates
// @access  Private (gym-specific)
exports.createEmailTemplate = async (req, res) => {
  console.log("Received request to create email template:", req.body);
  const { name, subject, description, template_type = "Email" } = req.body;
  console.log("Received request to create email template:", req.body);
  const gym_id = req.headers["gym-id"];

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "Gym ID is required in headers." });
  }
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Name, subject, and description are required.",
    });
  }

  try {
    const newTemplate = await GeneralItem.create({
      name,
      subject,
      description, // HTML content from editor
      template_type, // Add the template_type field
      gym_id,
    });
    return res.status(201).json({
      success: true,
      data: newTemplate,
      message: "Email template created successfully.",
    });
  } catch (error) {
    console.error("Error creating email template:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating template.",
      error: error.message,
    });
  }
};

// @desc    Get all email templates for a gym
// @route   GET /gym/site/apis/email-templates
// @access  Private (gym-specific)
exports.getEmailTemplates = async (req, res) => {
  const gym_id = req.params.id; // Or req.query.gym_id or req.gym.id

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "Gym ID is required." });
  }

  try {
    const templates = await GeneralItem.findAll({ where: { gym_id } });
    return res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching templates.",
      error: error.message,
    });
  }
};

// @desc    Get a single email template
// @route   GET /gym/site/apis/email-templates/:templateId
// @access  Private (gym-specific)
exports.getEmailTemplateById = async (req, res) => {
  const { templateId } = req.params;
  const gym_id = req.headers["gym-id"]; // Ensure the template belongs to the requesting gym

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "Gym ID is required in headers." });
  }

  try {
    const template = await GeneralItem.findOne({
      where: { id: templateId, gym_id },
    });
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Email template not found or not authorized for this gym.",
      });
    }
    return res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error("Error fetching single email template:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// @desc    Update an email template
// @route   PUT /gym/site/apis/email-templates/:templateId
// @access  Private (gym-specific)
exports.updateEmailTemplate = async (req, res) => {
  const { templateId } = req.params;
  const { name, subject, description, template_type } = req.body;
  const gym_id = req.headers["gym-id"];

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "Gym ID is required in headers." });
  }

  try {
    let template = await GeneralItem.findOne({
      where: { id: templateId, gym_id },
    });
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Email template not found or not authorized for this gym.",
      });
    }

    template.name = name || template.name;
    template.subject = subject || template.subject;
    template.description = description || template.description;
    template.template_type = template_type || template.template_type || "Email";
    // If timestamps: true in model, updated_at will be handled automatically by save()
    // If timestamps: false, and you have an updated_at column, set it manually:
    // template.updated_at = new Date();

    await template.save();
    return res.status(200).json({
      success: true,
      data: template,
      message: "Email template updated successfully.",
    });
  } catch (error) {
    console.error("Error updating email template:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating template.",
      error: error.message,
    });
  }
};

// @desc    Delete an email template
// @route   DELETE /gym/site/apis/email-templates/:templateId
// @access  Private (gym-specific)
exports.deleteEmailTemplate = async (req, res) => {
  const { templateId } = req.params;
  const gym_id = req.headers["gym-id"];

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "Gym ID is required in headers." });
  }

  try {
    const template = await GeneralItem.findOne({
      where: { id: templateId, gym_id },
    });
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Email template not found or not authorized for this gym.",
      });
    }

    await template.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Email template deleted successfully." });
  } catch (error) {
    console.error("Error deleting email template:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting template.",
      error: error.message,
    });
  }
};
