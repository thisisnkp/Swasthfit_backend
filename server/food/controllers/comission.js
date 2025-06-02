// controllers/commissionController.js

const Commission = require('../models/Comission');

exports.createCommission = async (req, res) => {
  try {
    const {
      fixed,
      amount,
      type,
      applies_to,
      applied_id,
      status,
      created_by,
      updated_by,
    } = req.body;

    const newCommission = await Commission.create({
      fixed,
      amount,
      type,
      applies_to,
      applied_id,
      status,
      created_by,
      updated_by,
    });
    // await Commission.save();
    res.status(201).json({
      success: true,
      message: 'Commission created successfully',
      data: newCommission,
    });
  } catch (error) {
    console.error('Error creating commission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create commission',
    });
  }
};


exports.getCommissions = async (req, res) => {
    try {
      const { applies_to, applied_id } = req.query;
  
      const where = {};
      if (applies_to) where.applies_to = applies_to;
      if (applied_id) where.applied_id = applied_id;
  
      const commissions = await Commission.findAll({ where });
  
      res.status(200).json({
        success: true,
        data: commissions,
      });
    } catch (error) {
      console.error('Error fetching commissions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch commissions',
      });
    }
  };
  