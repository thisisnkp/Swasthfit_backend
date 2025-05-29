const RestaurantStockReport = require('../models/restaurentstockreport');


// 🔥 Get All Stock Reports


exports.getAllStockReports = async (req, res) => {
  try {
    // Fetch all reports ordered by ID DESC
    const reports = await RestaurantStockReport.findAll({ order: [['id', 'DESC']] });

    // Aggregation: total count, unique suppliers, total quantity, total reorder level
    const totalCount = reports.length;
    const totalQuantityInStock = reports.reduce((sum, item) => sum + item.quantity_in_stock, 0);
    const totalReorderLevel = reports.reduce((sum, item) => sum + item.reorder_level, 0); // new aggregation

    const uniqueSuppliers = new Set(reports.map(item => item.supplier));
    const totalSuppliers = uniqueSuppliers.size;

    // Group data by supplier (optional, currently commented)
    const supplierDetails = {};
    reports.forEach(report => {
      if (!supplierDetails[report.supplier]) {
        supplierDetails[report.supplier] = {
          supplier: report.supplier,
          total_items: 0,
          total_quantity: 0,
          total_reorder_level: 0,      // added reorder level per supplier
          items: []
        };
      }
      supplierDetails[report.supplier].total_items += 1;
      supplierDetails[report.supplier].total_quantity += report.quantity_in_stock;
      supplierDetails[report.supplier].total_reorder_level += report.reorder_level; // accumulate reorder_level per supplier
      supplierDetails[report.supplier].items.push(report);
    });

    res.json({
      total_count: totalCount,
      total_suppliers: totalSuppliers,
      total_quantity_in_stock: totalQuantityInStock,
      total_reorder_level: totalReorderLevel,  // send total reorder level
      // supplier_summary: Object.values(supplierDetails),  // optional supplier grouping
      data: reports
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock reports' });
  }
};



// 🔥 Get Single Stock Report by ID
exports.getStockReportById = async (req, res) => {
  try {
    const report = await RestaurantStockReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Stock report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stock report' });
  }
};

// 🔥 Create New Stock Report
exports.createStockReport = async (req, res) => {
  try {
    const {
      item_name,
      category,
      quantity_in_stock,
      reorder_level,
      supplier,
      last_restocked_date
    } = req.body;

    // Validation (optional)
    if (!item_name || !category || !quantity_in_stock || !reorder_level || !supplier || !last_restocked_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newReport = await RestaurantStockReport.create({
      item_name,
      category,
      quantity_in_stock,
      reorder_level,
      supplier,
      last_restocked_date
    });
console.log(newReport);

    res.status(201).json(newReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create stock report' });
  }
};

// 🔥 Update Stock Report
exports.updateStockReport = async (req, res) => {
  try {
    const report = await RestaurantStockReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Stock report not found' });
    }

    await report.update(req.body);
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update stock report' });
  }
};

// 🔥 Delete Stock Report
exports.deleteStockReport = async (req, res) => {
  try {
    const report = await RestaurantStockReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Stock report not found' });
    }

    await report.destroy();
    res.json({ message: 'Stock report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete stock report' });
  }
};
