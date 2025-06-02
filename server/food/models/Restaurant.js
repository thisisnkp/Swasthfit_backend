
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class FoodRestaurant extends Model {}

FoodRestaurant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    diet_pack_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,  // Mandatory
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,  // Mandatory
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,  // Mandatory
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,  // Mandatory
    },
    rimg: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    full_address: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,  // Optional
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,  // Optional
    },
    store_charge: {
      type: DataTypes.FLOAT,
      allowNull: true,  // Optional
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    ifsc: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    receipt_name: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    acc_number: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    rest_status: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    sdesc: {
      type: DataTypes.TEXT,
      allowNull: true,  // Optional
    },
    pan_no: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    gst_no: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    fssai_no: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    aadhar_no: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    aadhar_image: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_fitmode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_dietpkg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_dining: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_recommended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Optional
    },
    delivery_status: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,  // Optional
    },
  },
  {
    sequelize,
    modelName: "FoodRestaurant",
    tableName: "foodrestaurants",
    underscored: true,
    timestamps: true,
  },
);

module.exports = FoodRestaurant;
