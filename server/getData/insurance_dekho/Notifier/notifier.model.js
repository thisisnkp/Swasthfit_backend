const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Import Sequelize instance

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    leadId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentStep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationNumber: DataTypes.STRING,
    registrationYear: DataTypes.STRING,
    centralMakeName: DataTypes.STRING,
    centralModelName: DataTypes.STRING,
    centralVersionName: DataTypes.STRING,
    fuelType: DataTypes.STRING,
    leadType: DataTypes.STRING,
    previousInsurerName: DataTypes.STRING,
    finalPremium: DataTypes.FLOAT,
    policyCaseType: DataTypes.STRING,
    status: DataTypes.STRING,
    subStatus: DataTypes.STRING,
    lmsRefId: DataTypes.STRING,
    utmSource: DataTypes.STRING,
    utmCampaign: DataTypes.STRING,
    utmMedium: DataTypes.STRING,
    subSource: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedTimestamp: DataTypes.DATE,
  },
  {
    modelName: "Lead",
    tableName: "leads",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Serialize JSON before saving (only if needed)
Lead.addHook("beforeValidate", (lead) => {
  if (typeof lead.data !== "string") {
    lead.data = JSON.stringify(lead.data);
  }
});

// Deserialize JSON after retrieving (only if needed)
Lead.addHook("afterFind", (result) => {
  if (result) {
    if (Array.isArray(result)) {
      result.forEach((instance) => {
        if (typeof instance.data === "string") {
          instance.data = JSON.parse(instance.data);
        }
      });
    } else if (typeof result.data === "string") {
      result.data = JSON.parse(result.data);
    }
  }
});

module.exports = Lead;
