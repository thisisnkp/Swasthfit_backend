const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

class Invoice extends Model {}

Invoice.init({
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    defaultValue: 'Unpaid'
  },
  payment_via: {
    type: DataTypes.STRING, // e.g., Credit Card, PayPal
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: true
});

module.exports = Invoice;
