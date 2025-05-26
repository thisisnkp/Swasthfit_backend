const EmpPersonalInfo = require('./emp_info.model');
const EmpDetailsCompensation = require('../emp_details_com/emap_details.model')
const { v4: uuidv4 } = require('uuid');

exports.createEmployee = async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
            return res.status(403).json({
                errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }]
            });
        }

        const empData = req.body;
        const newEmployee = await EmpPersonalInfo.create(empData);
        // Store employee ID in compensation table
        await EmpDetailsCompensation.create({ emp_id: newEmployee.id });

        res.status(201).json({
            meta: { "correlation-id": uuidv4(), "code": "201", "message": "Employee created successfully" },
            data: newEmployee
        });
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await EmpPersonalInfo.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ errors: [{ code: "NOT_FOUND", message: "Employee not found" }] });
        res.json(employee);
    } catch (error) {
        console.error("Error retrieving employee:", error);
        res.status(500).json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const updated = await EmpPersonalInfo.update(req.body, { where: { id: req.params.id } });
        if (!updated[0]) return res.status(404).json({ errors: [{ code: "NOT_FOUND", message: "Employee not found" }] });
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await EmpDetailsCompensation.destroy({ where: { emp_id: req.params.id } });
        const deleted = await EmpPersonalInfo.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ errors: [{ code: "NOT_FOUND", message: "Employee not found" }] });
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
    }
};