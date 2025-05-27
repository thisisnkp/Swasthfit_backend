const db = require("../../models/models");
const User = require("../../../user/user.model");

const getVendorDetails = async (req, res) => {
  console.log("getvendor");
  try {
    const { vendor_id, module_type } = req.user;
    let ownerData;

    switch (module_type) {
      case "gym":
        ownerData = await db.GymOwner.findOne({
          where: { id: vendor_id },
          attributes: ["id", "name", "email", "mobile"],
        });
        if (ownerData) {
          ownerData = {
            ...ownerData.dataValues,
            phone: ownerData.mobile,
            shop_name: ownerData.name,
          };
        }
        break;

      case "restaurant":
        ownerData = await db.RestVendors.findOne({
          where: { id: vendor_id },
          attributes: ["id", "name", "email", "phone"],
        });
        if (ownerData) {
          ownerData = {
            ...ownerData.dataValues,
            shop_name: ownerData.name,
          };
        }
        break;

      case "ecom":
        ownerData = await db.Vendor.findOne({
          where: { id: vendor_id },
          attributes: ["id", "shop_name", "email", "phone"],
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid module type",
        });
    }

    if (!ownerData) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user_id: ownerData.id,
        name: ownerData.shop_name,
        email: ownerData.email,
        phone: ownerData.phone,
      },
    });
  } catch (error) {
    console.error("Error in getVendorDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vendor details",
      error: error.message,
    });
  }
};

module.exports = {
  getVendorDetails,
};
