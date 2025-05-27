const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const MembershipPlanAmenities = sequelize.define("MembershipPlanAmenities", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    membership_plan_id: { type: DataTypes.INTEGER, allowNull: false },
    amenity_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { 
    tableName: "membership_plan_amenities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = MembershipPlanAmenities;
