const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require("../user/user.model");
exports.refreshToken = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        // Find the user from the database (you can also use Sequelize to find the user)
        const user = await User.findOne({
            where: {
                user_mobile: mobileNumber
            }
        });
        // If the user exists, generate a JWT token
        const payload = { id: user.id, mobile_number: user.mobile_number }; // Store relevant user info in the token payload

        // Generate the JWT token
        const jwtToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.TOKEN_EXPIRATION });

        // Send the token in the response
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Token send successfully.',
            token: jwtToken, // Send the JWT token to the client
        });
    } catch (error) {
        console.log("User Error: ", error);
    }
}