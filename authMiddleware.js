const jwt = require("jsonwebtoken");
const config = require("./config"); // Adjust path if your config is elsewhere

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token Received:", token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });
    }
    req.user = user;
    next();
  });
};
