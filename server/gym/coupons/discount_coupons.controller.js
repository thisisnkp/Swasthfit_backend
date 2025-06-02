const Coupon = require("./discount_coupons.model");
const UsedCoupon = require("../coupons/used_count_coupons.model");
const sequelize = require("../../../sequelize");
const { Sequelize, Op } = require("sequelize"); // Assuming you might need Op, Sequelize is for sequelize.fn/col

exports.createCoupon = async (req, res) => {
  console.log("coupon request body:", req.body); // Log the entire body to see what's coming
  try {
    // Assuming vendor_id and module_type are correctly set in req.user by your auth middleware
    const { vendor_id, module_type } = req.user;

    const {
      name,
      code,
      discount_type,
      discount,
      valid_from,
      valid_to,
      apply_quantity, // This will be undefined if apply_quantity_type is 'unlimited' as per frontend logic
      apply_quantity_type,
      status,
      gym_id, // Destructure gym_id from the request body
    } = req.body;
    console.log("Destructured values:", req.body.gym_id);
    // Validate required fields
    // Add gym_id to your validation if it's a mandatory field for creating a coupon
    if (!code || !discount_type || !discount || !gym_id) {
      // Added gym_id to validation
      let missingFields = [];
      if (!code) missingFields.push("code");
      if (!discount_type) missingFields.push("discount_type");
      if (!discount) missingFields.push("discount");
      if (!gym_id) missingFields.push("gym_id"); // Note missing gym_id

      return res.status(400).json({
        success: false, // It's good practice to include a success flag
        errors: [
          {
            code: "REQ001",
            message: `Missing required fields: ${missingFields.join(", ")}`,
          },
        ],
      });
    }

    // Prepare data for coupon creation
    const couponData = {
      name,
      code,
      vendor_id, // From authenticated user
      module_type, // From authenticated user
      gym_id, // From request body
      discount_type,
      discount,
      valid_from: valid_from || null, // Handle cases where dates might not be provided or are empty strings
      valid_to: valid_to || null,
      apply_quantity_type,
      status,
    };

    // Only add apply_quantity if it's relevant (i.e., not 'unlimited') and provided
    if (apply_quantity_type === "limited" && apply_quantity !== undefined) {
      couponData.apply_quantity = apply_quantity;
    } else if (apply_quantity_type === "unlimited") {
      couponData.apply_quantity = null; // Or however your DB schema handles unlimited (e.g., NULL, 0, or a specific value)
      // Ensure your Coupon model/schema can handle null for apply_quantity if type is unlimited
    }
    console.log("Coupon data to be created:", couponData); // Log the final data to be inserted
    // Create a new coupon
    const newCoupon = await Coupon.create(couponData);

    return res.status(201).json({
      success: true, // Add success flag
      message: "Coupon created successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);

    // Handle specific database errors, like unique constraint violations (e.g., for coupon code)
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.code === "ER_DUP_ENTRY" ||
      error.errno === 1062
    ) {
      // Adjust based on your ORM/DB
      return res.status(409).json({
        // 409 Conflict
        success: false,
        errors: [{ code: "DUP_ENTRY", message: "Coupon code already exists." }],
      });
    }

    return res.status(500).json({
      success: false,
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message || "An internal server error occurred",
        },
      ],
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
    const currentDate = new Date(); // Get the current date and time for comparison

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
      usageMap[item.coupon_id] = parseInt(item.total_used, 10); // Added radix for parseInt
    });

    // Prepare response data
    const activeCoupons = [];
    const expiredCoupons = [];

    coupons.forEach((coupon) => {
      const usedCount = usageMap[coupon.id] || 0;
      let remaining = null;

      if (
        coupon.apply_quantity_type === "limited" &&
        coupon.apply_quantity != null // Using != to catch null or undefined
      ) {
        remaining = Math.max(0, coupon.apply_quantity - usedCount);
      }

      const couponData = {
        ...coupon.toJSON(),
        used_count: usedCount,
        remaining_quantity: remaining,
      };

      let isEffectivelyExpired = false;

      // Check 1: If status is already 'expired'
      if (coupon.status === "expired") {
        isEffectivelyExpired = true;
      }
      // Check 2: If 'valid_to' date has passed (and status wasn't already 'expired')
      // This ensures that coupons past their valid_to date are treated as expired.
      else if (coupon.valid_to) {
        const validToDate = new Date(coupon.valid_to);
        if (validToDate < currentDate) {
          isEffectivelyExpired = true;
          // Optionally, you might want to update couponData.status here if frontend relies on it
          // couponData.status = "expired"; // Or add a new field like couponData.effective_status
        }
      }

      if (isEffectivelyExpired) {
        expiredCoupons.push(couponData);
      } else if (coupon.status === "active") {
        // Only add to activeCoupons if its original status is 'active'
        // AND it hasn't been marked as effectively expired by the date check.
        activeCoupons.push(couponData);
      }
      // Note: Coupons with other statuses (e.g., 'pending', 'draft') that are not
      // 'active' and not deemed 'effectivelyExpired' will not be added to either list,
      // maintaining the original logic's focus on 'active' and 'expired' categorizations.
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
