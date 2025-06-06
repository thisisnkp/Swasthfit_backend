const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const InvoiceItem =require("../models/InvoiceItem")
class Invoice extends Model {}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  amount: {
    type: DataTypes.BIGINT(20),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    defaultValue: 'Unpaid'
  },
  payment_via: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  customer_address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  customer_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: true // manages createdAt and updatedAt automatically
});





module.exports = Invoice;
