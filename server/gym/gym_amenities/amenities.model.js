const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const GymAmenity = sequelize.define(
  "GymAmenity",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    gym_id: { type: DataTypes.INTEGER, allowNull: false },
    amenity_name: { type: DataTypes.STRING, allowNull: false },
    amenity_price: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    tableName: "gym_amenities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = GymAmenity;
