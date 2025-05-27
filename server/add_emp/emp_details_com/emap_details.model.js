const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const EmpDetailsCompensationModel = sequelize.define("EmpDetailsCompensation", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    emp_id: { type: DataTypes.INTEGER, allowNull: false },
    employment_type: { 
        type: DataTypes.ENUM('Full Time', 'Contract', 'Part-time'), 
        allowNull: true 
    },
    salary_type: { 
        type: DataTypes.ENUM('Hourly', 'Annual'), 
        allowNull: true 
    },
    payment_rate: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    payment_unit: { 
        type: DataTypes.ENUM('hour', 'year'), 
        allowNull: true 
    },
    compensation_type: { 
        type: DataTypes.ENUM('Annual', 'Hourly'), 
        allowNull: true 
    },
    gross_annual_salary: { type: DataTypes.DECIMAL(10,2), allowNull: true },
}, { 
    tableName: "emp_details_compensation",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

EmpDetailsCompensationModel.addHook("beforeValidate", (emp) => {
    if (typeof emp.data !== "string") {
        emp.data = JSON.stringify(emp.data);
    }
});

EmpDetailsCompensationModel.addHook("afterFind", (result) => {
    if (result && typeof result.data === "string") {
        result.data = JSON.parse(result.data);
    }
});

module.exports = EmpDetailsCompensationModel;
