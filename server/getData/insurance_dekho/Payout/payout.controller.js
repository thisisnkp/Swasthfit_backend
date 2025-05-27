// const { PayoutModel } = require('./pay.model');
const PayoutModel = require('./pay.model');
const { v4: uuidv4 } = require('uuid');
console.log("PayoutModel", PayoutModel);
/**
 * Process payout request
 */
exports.Payout = async (req, res) => {
    try {
        const { partnerRefAuthId } = req.params;
        const apiKey = req.headers['x-api-key']; // Optional: API Key Authentication

        if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
            return res.status(403).json({
                errors: [{
                    code: "AUTH001",
                    message: "Invalid API Key",
                    displayMessage: "Authentication failed"
                }]
            });
        }

        // Extract request body
        const payoutData = req.body;

        // Validate required fields
        if (!payoutData.policyData || !payoutData.txnAmount) {
            return res.status(400).json({
                errors: [{
                    code: "REQ001",
                    message: "Missing required fields",
                    displayMessage: "Invalid payout request"
                }]
            });
        }

        // Save payout to DB
        const payoutRecord = await PayoutModel.create({
            id: uuidv4(), // Generate UUID for payout ID
            user_id: payoutData.policyData.requestId, // Assuming requestId maps to user_id
            data: payoutData
        });

        // Success Response
        return res.status(200).json({
            meta: {
                "correlation-id": uuidv4(),
                "reference-id": partnerRefAuthId,
                "code": "200",
                "message": "Operation successful"
            },
            data: {
                "status": "Payout recorded successfully"
            }
        });

    } catch (error) {
        console.error("Error processing payout:", error);

        // Error Response
        return res.status(500).json({
            errors: [{
                code: "SERVER_ERROR",
                message: error.message,
                displayMessage: "Internal Server Error"
            }]
        });
    }
};

// module.exports = { processPayout };



// const config = require("../../config");
// const { Payout } = require("./pay.model");

// Create Payout Record
//  = async (req, res) => {
//     try {
       
//         ;
//     } catch (error) {
//         res.status(500).json({
//             errors: [{
//                 code: "SERVER_ERROR",
//                 message: error.message,
//                 displayMessage: "An error occurred while processing your request."
//             }]
//         });
//     }
// };