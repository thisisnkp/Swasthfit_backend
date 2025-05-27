const EmpDetailsCompensation = require('./emap_details.model');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new compensation record
 */
exports.createCompensation = async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
            return res.status(403).json({
                errors: [{ code: "AUTH001", message: "Invalid API Key", displayMessage: "Authentication failed" }]
            });
        }

        const compData = req.body;
        const newCompensation = await EmpDetailsCompensation.create(compData);
        
        return res.status(201).json({
            meta: { 
                "correlation-id": uuidv4(), 
                "code": "201", 
                "message": "Compensation record created successfully" 
            },
            data: newCompensation
        });
    } catch (error) {
        console.error("Error creating compensation:", error);
        return res.status(500).json({
            errors: [{ 
                code: "SERVER_ERROR", 
                message: error.message, 
                displayMessage: "Internal Server Error" 
            }]
        });
    }
};

/**
 * Get compensation record by ID
 */
exports.getCompensation = async (req, res) => {
    try {
        const compensation = await EmpDetailsCompensation.findByPk(req.params.id);
        if (!compensation) {
            return res.status(404).json({ 
                errors: [{ 
                    code: "NOT_FOUND", 
                    message: "Compensation record not found" 
                }]
            });
        }
        return res.status(200).json(compensation);
    } catch (error) {
        console.error("Error retrieving compensation:", error);
        return res.status(500).json({
            errors: [{ 
                code: "SERVER_ERROR", 
                message: error.message, 
                displayMessage: "Internal Server Error" 
            }]
        });
    }
};

/**
 * Update compensation record
 */
exports.updateCompensation = async (req, res) => {
    try {
        const [updated] = await EmpDetailsCompensation.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ 
                errors: [{ 
                    code: "NOT_FOUND", 
                    message: "Compensation record not found" 
                }]
            });
        }

        return res.status(200).json({
            message: "Compensation record updated successfully"
        });
    } catch (error) {
        console.error("Error updating compensation:", error);
        return res.status(500).json({
            errors: [{ 
                code: "SERVER_ERROR", 
                message: error.message, 
                displayMessage: "Internal Server Error" 
            }]
        });
    }
};

/**
 * Delete compensation record
 */
exports.deleteCompensation = async (req, res) => {
    try {
        const deleted = await EmpDetailsCompensation.destroy({ where: { id: req.params.id } });

        if (!deleted) {
            return res.status(404).json({ 
                errors: [{ 
                    code: "NOT_FOUND", 
                    message: "Compensation record not found" 
                }]
            });
        }

        return res.status(200).json({
            message: "Compensation record deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting compensation:", error);
        return res.status(500).json({
            errors: [{ 
                code: "SERVER_ERROR", 
                message: error.message, 
                displayMessage: "Internal Server Error" 
            }]
        });
    }
};
