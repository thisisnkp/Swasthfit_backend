const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  console.log("Authorization Header Received:", authHeader); // Debug log

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // Check if the header starts with "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1] // Extract the token if "Bearer " is present
    : authHeader; // Assume the header is the token itself

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debug log
    req.user = decoded; // Attach the decoded token to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = verifyJWT;
