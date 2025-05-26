// admin_details.model.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const AdminKYCDetails = sequelize.define("AdminKYCDetails", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    admin_id: { type: DataTypes.INTEGER, allowNull: true },
    bank_name: { type: DataTypes.STRING, allowNull: false },
    account_holder_name: { type: DataTypes.STRING, allowNull: false },
    account_number: { type: DataTypes.STRING, allowNull: false },
    ifsc_code: { type: DataTypes.STRING, allowNull: false },
    cancel_cheque: { type: DataTypes.STRING, allowNull: true },
    pan_name: { type: DataTypes.STRING, allowNull: false },
    pan_number: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: "admin_kyc_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

AdminKYCDetails.addHook("beforeValidate", (emp) => {
    if (typeof emp.data !== "string") {
        emp.data = JSON.stringify(emp.data);
    }
});

AdminKYCDetails.addHook("afterFind", (result) => {
    if (result && typeof result.data === "string") {
        result.data = JSON.parse(result.data);
    }
});

module.exports = AdminKYCDetails;