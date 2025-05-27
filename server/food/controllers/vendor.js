const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");
const FoodRestaurant = require("../models/Restaurant");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const getRestVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    return res.status(200).json({
      status: true,
      message: "Vendor fetched successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        vendors,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      businessName,
      businessEmail,
      PAN,
      GST,
      password,
      vendorType,
    } = req.body;

    const created_by = req?.user?.userId;

    const category = await Vendor.create({
      name,
      email,
      phone,
      businessName,
      businessEmail,
      PAN,
      GST,
      password: bcrypt.hashSync(password, 8),
      vendorType: vendorType || null,
      created_by,
    });

    return res.status(200).json({
      status: true,
      message: "Vendor added successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Controller to get all restaurants by vendorId

const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) {
      return res.status(404).json({ status: false, message: "Vendor not found" });
    }

    // Compare password
    // const isPasswordValid = bcrypt.compareSync(password, vendor.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ status: false, message: "Invalid password" });
    // }

    // Generate JWT token
    const token = jwt.sign({ vendorId: vendor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token
    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        vendor,
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in vendor:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Placeholder for other controllers
const updateVendor = async (req, res) => {};
const deleteVendor = async (req, res) => {};
// Controller to fetch restaurants for a specific vendor
const getRestaurantsForVendor = async (req, res) => {
  try {
    const { vendor_id } = req.params; // Get the vendor_id from the request parameters
    console.log("Looking for vendor with ID:", vendor_id); // Log the vendor ID

    const vendor = await Vendor.findByPk(vendor_id);
    if (!vendor) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Vendor not found",
      });
    }

    // Fetch restaurants for this vendor
    const restaurants = await Restaurant.findAll({
      where: { vendor_id },
    });
    console.log(restaurants);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants: ", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

// const getVendorById = async (req, res) => {
//   try {
//     const vendorId = req.params.id;
//     console.log("Fetching vendor with ID:", vendorId);

//     const vendor = await Vendor.findByPk(vendorId);

//     if (!vendor) {
//       return res.status(404).json({
//         status: false,
//         message: "Vendor not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Vendor fetched successfully",
//       data: vendor,
//     });
//   } catch (error) {
//     console.error("Error fetching vendor by ID:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// const getVendorById = async (req, res) => {
//   try {
//     const vendorId = req.params.id;
//     console.log("Fetching vendor with ID:", vendorId);

//     const vendor = await Vendor.findByPk(vendorId, {
//       attributes: ["id","name", "businessName", "vendorType"],
//     });

//     if (!vendor) {
//       return res.status(404).json({
//         status: false,
//         message: "Vendor not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Vendor fetched successfully",
//       data: vendor,
//     });
//   } catch (error) {
//     console.error("Error fetching vendor by ID:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };
const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    console.log("Fetching vendor with ID:", vendorId);

    const vendor = await Vendor.findByPk(vendorId, {
      attributes: ["id", "name", "businessName", "vendorType"],
    });

    if (!vendor) {
      return res.status(404).json({
        status: false,
        message: "Vendor not found",
      });
    }

    // Create JWT token with vendor data
    const payload = {
      vendor_id: vendor.id,
      module_type: vendor.vendorType,
      business_name: vendor.businessName,
      user_name: vendor.name,
    };

    // Generate the JWT token (assuming config is imported or accessible)
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION || "24h",
    });

    return res.status(200).json({
      status: true,
      message: "Vendor fetched successfully",
      data: vendor,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  getRestVendors,
  createVendor,
  updateVendor,
  getRestaurantsForVendor,
  deleteVendor,
  getVendorById,
  vendorLogin
};

// const getRestVendors = async (req, res) => {
//   try {
//     const vendors = await Vendor.findAll();
//     return res.status(200).json({
//       status: true,
//       message: "Vendor fetched successfully",
//       data: {
//         baseUrl: `${process.env.APP_URL}uploads/`,
//         vendors,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ status: true, message: error.message });
//   }
// };

// exports.createVendor = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       businessName,
//       businessEmail,
//       PAN,
//       GST,
//       password,
//       vendorType, // include vendorType from req.body
//     } = req.body;

//     const created_by = req?.user?.userId;

//     const category = await Vendor.create({
//       name,
//       email,
//       phone,
//       businessName,
//       businessEmail,
//       PAN,
//       GST,
//       password: bcrypt.hashSync(password, 8),
//       vendorType: vendorType || null, // safely handle optional
//       created_by,
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Vendor added successfully",
//       data: category,
//     });
//   } catch (error) {
//     console.error("Error creating vendor:", error);
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// const createVendor = async (req, res) => {
//   try {
//     const { name, email, phone, businessName, businessEmail, PAN, GST } =
//       req.body;
//     const created_by = req?.user?.userId;

//     const category = await Vendor.create({
//       name,
//       email,
//       created_by,
//       phone,
//       businessName,
//       businessEmail,
//       PAN,
//       GST,
//       password: bcrypt.hashSync(req.body.password, 8),
//     });
//     return res
//       .status(200)
//       .json({
//         status: true,
//         message: "Vendor added successfully",
//         data: category,
//       });
//   } catch (error) {
//     return res.status(500).json({ status: true, message: error.message });
//   }
// };

// module.exports = {
//   getRestVendors,
//   createVendor,

// };
