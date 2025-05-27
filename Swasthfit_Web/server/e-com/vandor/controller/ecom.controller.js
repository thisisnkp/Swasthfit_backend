const bcrypt = require("bcrypt");
const config = require("../../../../config");
const Vendor = require("../model/ecom.model");
const jwt = require("jsonwebtoken");

exports.registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      businessName,
      businessEmail,
      PAN,
      GST,
      products,
      sellingOnAmazon,
      sellingOnFlipkart,
      otherPlatforms,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const vendor = await Vendor.create({
      name,
      email,
      phone,
      businessName,
      businessEmail,
      PAN,
      GST,
      products,
      sellingOnAmazon,
      sellingOnFlipkart,
      otherPlatforms,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Vendor registered successfully", vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ vendorId: vendor.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    //Add logic to fetch relevant data for the vendor's dashboard
    res.status(200).json({ message: "Vendor dashboard data" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
