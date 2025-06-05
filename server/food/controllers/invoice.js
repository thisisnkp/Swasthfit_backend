const Invoice = require("../models/invoice");
const InvoiceItem = require("../models/InvoiceItem");

// Create a new invoice along with its items
exports.createInvoice = async (req, res) => {
  const {
    invoice_id,
    invoice_date,
    due_date,
    customer_name,
    customer_address,
    customer_phone,
    delivery_fee,
    subtotal,
    tax,
    total,
    amount,
    payment_status,
    payment_via,
    items,
  } = req.body;

  try {
    // Step 1: Create the invoice
    const invoice = await Invoice.create({
      invoice_id,
      invoice_date,
      due_date,
      customer_name,
      customer_address,
      customer_phone,
      delivery_fee,
      subtotal,
      tax,
      total,
      amount,
      payment_status,
      payment_via,
      created_date: new Date(),
    });

    // Step 2: Add invoice items
    if (items && Array.isArray(items)) {
      const itemRecords = items.map((item) => ({
        invoice_id: invoice.invoice_id, // ✅ use the correct string ID
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }));

      await InvoiceItem.bulkCreate(itemRecords);
    }
    const invoiceWithItems = await Invoice.findByPk(invoice.id, {
      include: [{ model: InvoiceItem, as: "items" }],
    });

    return res.status(201).json({
      status: true,
      message: "Invoice created successfully",
      invoice: invoiceWithItems,
    });

    // return res.status(201).json({ status: true, message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error("Invoice creation failed:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

// Get all invoices with their items
// exports.getAllInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.findAll({
//       include: [
//         {
//           model: InvoiceItem,
//           as: "items",
//           attributes: ["product_name", "quantity", "price"],
//         },
//       ],
//       order: [["createdAt", "DESC"]], // optional: order by newest first
//     });

//     return res.status(200).json({
//       status: true,
//       invoices,
//     });
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to fetch invoices",
//       error: error.message,
//     });
//   }
// };

// invoiceController.js

exports.getInvoiceWithItems = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findOne({
      where: { invoice_id: invoiceId },
      include: [{
        model: InvoiceItem,
        attributes: ['product_name', 'quantity', 'price']
      }],
      attributes: [
        'invoice_id',
        'customer_name',
        'created_date',
        'due_date',
        'payment_status',
        'payment_via',
        'customer_address',
        'customer_phone',
        'delivery_fee',
        'subtotal',
        'tax',
        'total'
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        status: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      status: true,
      invoice
    });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      status: false,
      message: 'Error fetching invoice details',
      error: error.message
    });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
  const invoices = await Invoice.findAll({
  include: [{
    model: InvoiceItem,
    as: 'items',            // alias must match
    attributes: ['product_name', 'quantity', 'price']
  }],
  attributes: [
    'invoice_id',
    'customer_name',
    'created_date',
    'due_date',
    'payment_status',
    'payment_via',
    'customer_address',
    'customer_phone',
    'delivery_fee',
    'subtotal',
    'tax',
    'total'
  ],
  order: [['created_date', 'DESC']]
});


    res.json({
      status: true,
      invoices
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      status: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};




exports.getInvoiceByInvoiceId = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findOne({
      where: { invoice_id: invoiceId },
      include: [{
        model: InvoiceItem,
        as: 'items', // must match the alias defined in hasMany
        attributes: ['product_name', 'quantity', 'price', 'createdAt']
      }],
      attributes: [
        'id',
        'invoice_id',
        'customer_name',
        'created_date',
        'due_date',
        'amount',
        'payment_status',
        'payment_via',
        'invoice_date',
        'customer_address',
        'customer_phone',
        'delivery_fee',
        'subtotal',
        'tax',
        'total',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!invoice) {
      return res.status(404).json({ status: false, message: 'Invoice not found' });
    }

    return res.json({ status: true, invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
};
