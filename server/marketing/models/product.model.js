
const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); 

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumb_image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    references: {
      model: 'user',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sub_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  child_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "0",
  },
  sold_qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  long_description: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  video_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seo_title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  seo_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  offer_price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  show_homepage: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  is_undefine: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  is_featured: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  new_product: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  is_top: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  is_best: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  is_specification: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  approve_by_admin: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "products",
  underscored: true,
  timestamps: false,
});

module.exports = Product;
