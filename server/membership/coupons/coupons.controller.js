const { v4: uuidv4 } = require("uuid");
const Coupon = require("./coupons.model");

/**
 * Middleware-like function to validate API key
 */
const validateApiKey = (req) => {
  const apiKey = req.headers["x-api-key"];
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
    return {
      error: {
        status: 403,
        response: {
          errors: [
            {
              code: "AUTH001",
              message: "Invalid API Key",
              displayMessage: "Authentication failed",
            },
          ],
        },
      },
      correlationId,
    };
  }
  return { correlationId };
};

/**
 * Create a new coupon
 */
exports.createCoupon = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const {
      name,
      code,
      min_purchase_price,
      offer_type,
      discount,
      max_quantity,
      expired_date,
      apply_quantity,
      status,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !code ||
      !min_purchase_price ||
      !offer_type ||
      !discount ||
      !max_quantity ||
      !expired_date ||
      !apply_quantity
    ) {
      return res
        .status(400)
        .json({
          errors: [{ code: "REQ001", message: "Missing required fields" }],
        });
    }

    const coupon = await Coupon.create({
      name,
      code,
      min_purchase_price,
      offer_type,
      discount,
      max_quantity,
      expired_date,
      apply_quantity,
      status,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      correlationId: validation.correlationId,
      data: coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

/**
 * Get all coupons
 */
exports.getAllCoupons = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const coupons = await Coupon.findAll();
    return res
      .status(200)
      .json({ correlationId: validation.correlationId, data: coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

/**
 * Get a coupon by ID
 */
exports.getCouponById = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon)
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Coupon not found" }] });

    return res
      .status(200)
      .json({ correlationId: validation.correlationId, data: coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

/**
 * Update a coupon
 */
exports.updateCoupon = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon)
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Coupon not found" }] });

    await coupon.update(req.body);
    return res
      .status(200)
      .json({
        message: "Coupon updated successfully",
        correlationId: validation.correlationId,
        data: coupon,
      });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};

/**
 * Delete a coupon
 */
exports.deleteCoupon = async (req, res) => {
  const validation = validateApiKey(req);
  if (validation.error)
    return res.status(validation.error.status).json(validation.error.response);

  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon)
      return res
        .status(404)
        .json({ errors: [{ code: "NOT_FOUND", message: "Coupon not found" }] });

    await coupon.destroy();
    return res
      .status(200)
      .json({
        message: "Coupon deleted successfully",
        correlationId: validation.correlationId,
      });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return res
      .status(500)
      .json({ errors: [{ code: "SERVER_ERROR", message: error.message }] });
  }
};
