require("dotenv").config();

module.exports = () => {
  return (req, res, next) => {
    const token = req.headers.key || req.body.key || req.query.key;
    console.log("Token Received:", token); // Debug log
    if (token) {
      if (token == process.env.AUTH_SECRET) {
        next();
      } else {
        return res
          .status(401)
          .json({ status: false, error: "Unauthorized Access" });
      }
    } else {
      return res
        .status(401)
        .json({ status: false, error: "Unauthorized Access2" });
    }
  };
};
