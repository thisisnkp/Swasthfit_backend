const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Get token from Authorization header

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to the request object
    next(); // Call the next middleware
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
