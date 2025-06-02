const Invoice = require('../models/invoice');

// Get All Invoices

exports.getInvoicesAll = async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        order: [['created_date', 'DESC']]  // latest invoice pehle aaye
      });
  
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Create New Invoice
// exports.createInvoice = async (req, res) => {
//   try {
//     const newInvoice = await Invoice.create(req.body);
//     res.json(newInvoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.createInvoice = async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body);

    // Emit notification via socket
    const io = req.app.get("io"); // assuming io is set on app
    if (io) {
      io.emit("notification", {
        type: "Invoice",
        message: `Invoice #${newInvoice.id} has been generated.`,
        invoice_id: newInvoice.id,
        user_id: newInvoice.user_id, // optional if you want to target specific user
        timestamp: new Date(),
      });
    }

    res.json(newInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update Invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await Invoice.update(req.body, { where: { id } });
    res.json({ message: 'Invoice updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the invoice using invoice_id field
      const invoice = await Invoice.findOne({ where: { invoice_id: id } });
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      // Delete the invoice
      await invoice.destroy();
  
      return res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  


// Get Invoice By ID
exports.getInvoiceById = async (req, res) => {
    try {
      const { id } = req.params;  
      console.log('Request ID:', id);
      
      const invoice = await Invoice.findOne({ where: { invoice_id: id } });
      console.log('Fetched Invoice:', invoice);
  
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
  
      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  