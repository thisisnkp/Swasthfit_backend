const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const Invoice = require('./invoice');

class InvoiceItem extends Model {}

InvoiceItem.init({
  invoice_id: {
    type: DataTypes.STRING(50), // changed from INTEGER to STRING
    references: {
      model: Invoice,
      key: 'invoice_id' // reference the string 'invoice_id' instead of numeric 'id'
    },
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'InvoiceItem',
  tableName: 'invoice_items',
  timestamps: true
});


module.exports = InvoiceItem;
