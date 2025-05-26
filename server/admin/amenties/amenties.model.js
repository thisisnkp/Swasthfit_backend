// amenities.model.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust path as per your structure

const Amenities = sequelize.define("Amenities", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    workout_type: { type: DataTypes.STRING, allowNull: false },
    closing_date: { type: DataTypes.STRING, allowNull: true },
    gym_name: { type: DataTypes.STRING, allowNull: false },
    facilities: { type: DataTypes.TEXT, allowNull: true }, // You may store this as a JSON string
    about_us: { type: DataTypes.STRING(300), allowNull: true },
}, {
    tableName: "amenities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

// Optional: Handle JSON serialization for facilities field
Amenities.addHook("beforeValidate", (entry) => {
    if (entry.facilities && typeof entry.facilities !== "string") {
        entry.facilities = JSON.stringify(entry.facilities);
    }
});

Amenities.addHook("afterFind", (result) => {
    if (Array.isArray(result)) {
        result.forEach(item => {
            if (item.facilities && typeof item.facilities === "string") {
                item.facilities = JSON.parse(item.facilities);
            }
        });
    } else if (result && result.facilities && typeof result.facilities === "string") {
        result.facilities = JSON.parse(result.facilities);
    }
});

module.exports = Amenities;
