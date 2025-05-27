const crypto = require("crypto");
const util = require("../../../Easebuzz/util");
const qs = require("querystring");

const VendorWalletPayments = require("../models/walletRacharge.model");
const { v4: uuidv4 } = require("uuid");

function isValidTxnId(txnid) {
  const regex = /^TXN\d{16}$/;
  return regex.test(txnid);
}
function geturl(env) {
  return env === "prod"
    ? "https://pay.easebuzz.in/"
    : "https://testpay.easebuzz.in/";
}
function generateHash(data, key, salt) {
  const hashString = `${key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  return hash;
}
exports.initiatePayment = async (req, res, config) => {
  console.log("Easebuzz initiatePayment called with data:", req.body);
  const txnid = req.body.txnid;

  if (!req.user || !req.user.vendor_id || !req.user.module_type) {
    return res.status(400).json({
      status: 0,
      message: "Vendor details not found in user session",
    });
  }

  if (!isValidTxnId(req.body.txnid)) {
    return res.status(400).json({
      status: 0,
      message:
        "Invalid txnid format. It must start with 'TXN' and be followed by exactly 16 digits.",
    });
  }

  try {
    if (
      !req.body.amount ||
      !req.body.firstname ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.productinfo
    ) {
      return res.status(400).json({
        status: 0,
        message:
          "Missing required fields: amount, firstname, email, phone, or productinfo",
      });
    }

    const surl =
      req.body.surl ||
      `${req.protocol}://${req.get(
        "host"
      )}/api/marketing/wallet/update_payment`;
    const furl =
      req.body.furl ||
      `${req.protocol}://${req.get(
        "host"
      )}/api/marketing/wallet/update_payment`;

    const data = {
      txnid: txnid,
      amount: req.body.amount,
      firstname: req.body.firstname,
      email: req.body.email,
      phone: req.body.phone,
      productinfo: req.body.productinfo,
      surl: surl,
      furl: furl,
      key: config.key,
    };

    console.log("TT01: surl:", surl);

    const hash = generateHash(data, config.key, config.salt);
    data.hash = hash;
    const payment_url = geturl(config.env);
    const call_url = payment_url + "payment/initiateLink";
    const paymentForm = qs.stringify(data);

    console.log("Sending to Easebuzz:", data);
    console.log("Call URL:", call_url);

    util
      .call(call_url, paymentForm)
      .then(async (response) => {
        console.log("Easebuzz API Response:", response);
        console.log("Easebuzz API Response Data:", response.data);

        if (!response || !response.data) {
          return res.status(400).send({
            status: 0,
            message: "Failed to initiate payment: Invalid access key",
            response: response,
          });
        }
        const access_key = response.data;
        console.log("Access Key:", access_key);

        if (config.enable_iframe === 0) {
          const redirect_url = `${payment_url}pay/${access_key}`;
          return res.json({
            status: 1,
            type: "redirect",
            redirect_url,
          });
        } else {
          return res.json({
            status: 1,
            type: "iframe",
            payment_url: payment_url,
            access_key: access_key,
          });
        }
      })
      .catch((err) => {
        console.error("Easebuzz API Error:", err);
        return res.status(500).json({
          status: 0,
          message: "Payment gateway error",
          error: err,
        });
      });
  } catch (err) {
    console.error("initiatePayment error:", err);
    res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
};
// this is the surl controller
exports.updatePaymentStatusWallet = async (req, res) => {
  try {
    const paymentData = req.body;
    await PaymentService.updatePaymentStatus(paymentData);

    const redirectUrl = `http://localhost:5173/payment/status?txnid=${paymentData.txnid}&status=success`;
    return res.redirect(redirectUrl);
  } catch (error) {
    const redirectUrl = `http://localhost:5173/payment/status?txnid=${req.body.txnid}&status=failed`;
    return res.redirect(redirectUrl);
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const paymentRecords = await VendorWalletPayments.findAll();

    return res.status(200).json({
      data: paymentRecords,
      correlationId,
    });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};
