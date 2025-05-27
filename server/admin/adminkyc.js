const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class KYCDetails extends Model {}

KYCDetails.init(
  {
    // Personal Information
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifscCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // PAN Details
    panName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Business Details
    fullAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gstNumber: {
      type: DataTypes.STRING,
    },
    hasGST: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    msmeNumber: {
      type: DataTypes.STRING,
    },
    isMSMERegistered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    shopCertificateNumber: {
      type: DataTypes.STRING,
    },
    hasShopCertificate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Uploaded Files
    chequeDocuments: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    gstCertificate: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    msmeCertificate: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    shopCertificate: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    additionalDocuments: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "KYCDetails",
    tableName:"admin_kyc_details",
    timestamps: true,
  }
);

module.exports = KYCDetails;
