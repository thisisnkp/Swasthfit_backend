const Coupon = require("./discount_coupons.model");
const UsedCoupon = require("../coupons/used_count_coupons.model");
const sequelize = require("../../../sequelize");

exports.createCoupon = async (req, res) => {
  console.log("coupon");
  try {
    const { vendor_id, module_type } = req.user;

    const {
      name,
      code,
      discount_type,
      discount,
      valid_from,
      valid_to,
      apply_quantity,
      apply_quantity_type,
      status,
    } = req.body;

    // Validate required fields
    if (!code || !discount_type || !discount) {
      return res.status(400).json({
        errors: [{ code: "REQ001", message: "Missing required fields" }],
      });
    }

    // Create a new coupon
    const newCoupon = await Coupon.create({
      name,
      code,
      vendor_id,
      module_type,
      discount_type,
      discount,
      valid_from,
      valid_to,
      apply_quantity,
      apply_quantity_type,
      status,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

exports.getCouponsByVendorAndModule = async (req, res) => {
  try {
    const { vendor_id, module_type } = req.user;

    // Validate module_type and vendor_id
    if (!module_type || !vendor_id) {
      return res.status(400).json({
        errors: [
          { code: "REQ002", message: "Missing vendor_id or module_type" },
        ],
      });
    }

    // Fetch coupons based on module_type and vendor_id
    const coupons = await Coupon.findAll({
      where: {
        module_type,
        vendor_id,
      },
    });

    // Check if any coupons were found
    if (!coupons || coupons.length === 0) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "No coupons found" }],
      });
    }

    return res.status(200).json({
      message: "Coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};

exports.useCoupon = async (req, res) => {
  const { coupon_id, user_id, module_type } = req.body;
  console.log(
    "Request received - Coupon ID:",
    coupon_id,
    "User ID:",
    user_id,
    "Module Type:",
    module_type
  ); // Log module_type too
  console.log("Checking for coupon with ID:", coupon_id);

  try {
    // Step 1: Check if coupon exists in the 'discount_coupons' table
    const coupon = await Coupon.findOne({ where: { id: coupon_id } });
    console.log("Coupon findOne result:", coupon); // Log the actual result

    if (!coupon) {
      console.log("Coupon not found for ID:", coupon_id);
      return res.status(404).json({ message: "Coupon not found." });
    }

    console.log(
      "Coupon found. Checking for existing usage in 'coupons_used_by' table..."
    );
    console.log(
      "Checking usage for coupon_id:",
      coupon_id,
      "user_id:",
      user_id,
      "module_type:",
      module_type
    );

    // Step 2: Check if a usage record exists for THIS specific coupon, user, and module type
    const existingUsage = await UsedCoupon.findOne({
      where: {
        coupon_id,
        user_id,
        module_type,
      },
    });

    if (existingUsage) {
      // Scenario 1: Existing usage found for THIS specific coupon_id, user_id, module_type
      console.log("Existing usage record found. Updating count.");
      existingUsage.used_count += 1;
      await existingUsage.save();
      console.log("Coupon usage updated successfully.");

      return res.status(200).json({
        message: "Coupon usage updated.",
        data: existingUsage,
      });
    } else {
      // Scenario 2: No existing usage found for THIS specific coupon_id, user_id, module_type
      // This covers cases where:
      // a) User has never used ANY coupon for this module type.
      // b) User HAS used a coupon for this module type, but it was a DIFFERENT coupon_id.
      console.log(
        "No existing usage record found for this specific coupon_id/user/module combination. Creating new record."
      );

      const newUsage = await UsedCoupon.create({
        coupon_id, // Use the coupon_id from the request
        user_id,
        module_type,
        used_count: 1,
      });
      console.log("New coupon usage record created successfully.");

      return res.status(201).json({
        message:
          "Coupon used for the first time (or different coupon used for this module).",
        data: newUsage,
      });
    }
  } catch (err) {
    console.error("Server error during coupon usage:", err); // More specific error logging
    // Re-throw the error if you have a global error handler
    // throw err;
    res.status(500).json({
      message: "Server error",
      error: err.message, // Include the actual error message
    });
  }
};

exports.getCouponsData = async (req, res) => {
  try {
    // Get all coupons
    const coupons = await Coupon.findAll();

    // Get usage data from UsedCoupon
    const usageData = await UsedCoupon.findAll({
      attributes: [
        "coupon_id",
        [sequelize.fn("SUM", sequelize.col("used_count")), "total_used"],
      ],
      group: ["coupon_id"],
      raw: true,
    });

    // Convert usageData to a map for quick access
    const usageMap = {};
    usageData.forEach((item) => {
      usageMap[item.coupon_id] = parseInt(item.total_used);
    });

    // Prepare response data
    const activeCoupons = [];
    const expiredCoupons = [];

    coupons.forEach((coupon) => {
      const usedCount = usageMap[coupon.id] || 0;
      let remaining = null;

      if (
        coupon.apply_quantity_type === "limited" &&
        coupon.apply_quantity != null
      ) {
        remaining = Math.max(0, coupon.apply_quantity - usedCount);
      }

      const couponData = {
        ...coupon.toJSON(),
        used_count: usedCount,
        remaining_quantity: remaining,
      };

      if (coupon.status === "active") {
        activeCoupons.push(couponData);
      } else if (coupon.status === "expired") {
        expiredCoupons.push(couponData);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        active: activeCoupons,
        expired: expiredCoupons,
      },
    });
  } catch (error) {
    console.error("Error fetching coupon data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.checkCouponCode = async (req, res) => {
  try {
    const { code } = req.query;

    // Validate the code parameter
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "The 'code' query parameter is required.",
      });
    }

    // Check if the coupon exists
    const existingCoupon = await Coupon.findOne({ where: { code } });
    if (existingCoupon) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking coupon code:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking the coupon code.",
      error: error.message,
    });
  }
};
