// Presumed content of gym.model.js (based on previous interactions)
const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Or your actual path
const GymSchedule = require("../model/gymSchedule.model"); // Path to GymSchedule model - IMPORTANT: Adjust if necessary

const Gym = sequelize.define(
  "gyms",
  {
    // ... all your existing columns (id, owner_id, gym_name, gym_logo, facilities, gym_photos, etc.)
    // Ensure these are complete as per your actual model
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gymOwners",
        key: "id",
      },
    },
    business_type: {
      type: DataTypes.ENUM("Direct", "By Swasthfit"),
      allowNull: false,
      defaultValue: "Direct",
    },
    gym_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    gym_logo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gym_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gym_geo_location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facilities: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ... other fields from your model ...
    gym_photos: {
      // For multiple gallery photos (array of paths)
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // ... your model options ...
    sequelize,
    modelName: "Gyms", // Or "Gym" if that's what you use elsewhere
    tableName: "gyms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Hooks (beforeValidate, afterFind) as you have them for gym_photos, facilities etc.
// ... (Your existing hooks for Gym model)
Gym.addHook("beforeValidate", (gymInstance, options) => {
  const fieldsToSerialize = [
    "facilities",
    "bank_details",
    "gym_geo_location",
    "gym_photos",
  ];
  fieldsToSerialize.forEach((field) => {
    if (typeof gymInstance[field] === "object" && gymInstance[field] !== null) {
      gymInstance[field] = JSON.stringify(gymInstance[field]);
    }
  });
});

Gym.afterFind((instances, options) => {
  const processInstance = (instance) => {
    if (!instance || !instance.dataValues) return;
    const fieldsToDeserialize = [
      "facilities",
      "bank_details",
      "gym_geo_location",
      "gym_photos",
    ];
    fieldsToDeserialize.forEach((field) => {
      const originalValue = instance.dataValues[field];
      let defaultValue =
        field === "gym_geo_location" || field === "bank_details" ? null : [];
      if (typeof originalValue === "string") {
        try {
          instance[field] =
            originalValue.trim() === ""
              ? defaultValue
              : JSON.parse(originalValue);
        } catch (e) {
          instance[field] = defaultValue;
        }
      } else if (originalValue === null || originalValue === undefined) {
        instance[field] = defaultValue;
      }
    });
  };
  if (Array.isArray(instances)) instances.forEach(processInstance);
  else processInstance(instances);
});

// Define the association with GymSchedule
// This assumes a Gym has one GymSchedule entry based on your controller logic
Gym.hasOne(GymSchedule, {
  foreignKey: "gym_id", // The foreign key in GymSchedule table
  as: "schedule", // This alias will be used to access the schedule data (e.g., gym.schedule)
});

// Also, ensure GymSchedule model defines its belongsTo relationship (optional for this specific query but good for completeness)
// In gymSchedule.model.js, you'd have:
// GymSchedule.belongsTo(Gym, { foreignKey: 'gym_id', as: 'gym' });
// (Your gymSchedule.model.js already comments this out but it's good practice)

module.exports = Gym;
