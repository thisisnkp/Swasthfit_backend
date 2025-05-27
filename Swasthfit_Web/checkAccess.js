const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = (req, res, next) => {
  // Get the token from the body, header, or query parameter
  let token =
    req.body.token ||
    req.headers['authorization'] ||
    req.query.token;

  // If the token is in the Authorization header and starts with "Bearer "
  if (token && token.startsWith('Bearer ')) {
    // Remove the "Bearer " prefix and use the token
    token = token.slice(7, token.length); // "Bearer ".length = 7
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
