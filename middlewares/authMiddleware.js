// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// In-memory blacklist for demonstration purposes
const blacklist = new Set();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Check if the token is blacklisted
    if (blacklist.has(token)) {
        return res.status(401).json({ error: 'Token has been revoked' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

// middlewares/authenticate.js

module.exports = function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // includes user_role
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};



// const blacklist = new Set(); // Assuming you're using a token blacklist



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "Authorization header missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1]; // Get the token part
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
    req.user = decoded; // Save user info to req.user
    next(); // Go to next middleware or controller
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = { verifyToken };


// const verifyToken = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         error: true,
//         message: "Authorization header missing or malformed",
//       });
//     }

//     const token = authHeader.split(" ")[1]; // Only the token part
//     console.log(token);
    
//   //   const decoded = jwt.verify(
//   //     token ,
//   //     process.env.JWT_SECRET,
//   //     (err, decoded) => {
//   //       if (err) {
//   //         return res
//   //           .status(401)
//   //           .json({ error: true, message: "Token is expired or invalid" });
//   //       }
//   //       res.json({ message: "Token is valid", decoded });
//   //     },
//   //   );
//   // } catch (error) {
//   //   res.status(401).json({ error: "Invalid token" });
//   // }
  
//           const decoded = jwt.verify(token, process.env.JWT_SECRET);
//           console.log(decoded)
//           req.user = decoded;
//           next();
//       } catch (error) {
//           return res.status(401).json({ error: 'Token is not valid' });
//       }
// };
// Function to revoke a token
const revokeToken = (token) => {
    blacklist.add(token); // Add token to blacklist
};

module.exports = { authMiddleware, revokeToken  ,verifyToken};