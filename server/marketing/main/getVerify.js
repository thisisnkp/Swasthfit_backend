// const verifyJWT = (req, res) => {
//   return res.status(200).json({ user: req.user });
// };

// module.exports = { verifyJWT };

const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor.model");
const GymOwner = require("../../gym/model/gymOwners.model");
const RestVendor = require("../models/Restaurants/restVendor.model");

const generateToken = async (req, res) => {
  try {
    const { module_type, email } = req.body;
    console.log("Request body:", req.body);

    if (!module_type || !email) {
      return res
        .status(400)
        .json({ message: "module_type and email are required" });
    }

    let vendorData;
    let vendorId;
    let name;

    // Check module type and fetch data accordingly
    if (module_type === "restaurant") {
      vendorData = await RestVendor.findOne({ where: { email } });
    } else if (module_type === "gym") {
      vendorData = await GymOwner.findOne({ where: { email } });
    } else if (module_type === "ecom") {
      vendorData = await Vendor.findOne({ where: { email } });
    } else {
      return res.status(400).json({ message: "Invalid module_type" });
    }
    console.log("Vendor data:", vendorData);
    // Check if vendor exists and is verified
    if (!vendorData) {
      return res
        .status(404)
        .json({ message: "Vendor not found or not verified" });
    }

    vendorId = vendorData.id;
    name = vendorData.name || vendorData.shop_name || vendorData.businessName;

    // Generate token payload
    const payload = {
      module_type,
      vendor_id: vendorId,
      name,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Respond with the token
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateToken };
