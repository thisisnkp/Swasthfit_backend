const Contact = require("../../models/contact.model");


const authenticateAndSubmitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const contactMessage = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: {
        id: contactMessage.id,
        name: contactMessage.name,
        email: contactMessage.email,
        createdAt: contactMessage.created_at
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact message'
    });
  }
};



module.exports = { authenticateAndSubmitContact };