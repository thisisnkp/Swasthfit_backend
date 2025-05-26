const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");


const EmpPersonalInfoModel = sequelize.define("EmpPersonalInfo", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    aadhar_no: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
}, {    tableName: "emp_personal_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",});

EmpPersonalInfoModel.addHook("beforeValidate", (emp) => {
    if (typeof emp.data !== "string") {
        emp.data = JSON.stringify(emp.data);
    }
});

EmpPersonalInfoModel.addHook("afterFind", (result) => {
    if (result && typeof result.data === "string") {
        result.data = JSON.parse(result.data);
    }
});

module.exports = EmpPersonalInfoModel;

