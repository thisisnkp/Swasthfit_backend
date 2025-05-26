// Easebuzz/initiate_payment.js
const crypto = require("crypto");
const util = require("./util");
const qs = require("querystring");
const initiatePaymentModel = require("../server/easeBuzz_payment/model/easebuzz_trans.model");
const { getUserByEmail } = require("../server/user/user.controller");
const { v4: uuidv4 } = require("uuid");

// function geturl(env) {
//   return env === 'test' ? 'https://pay.easebuzz.in/' : 'https://testpay.easebuzz.in/';
// }

// ✅ Add this function
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

  if (!isValidTxnId(req.body.txnid)) {
    return res.status(400).json({
      status: 0,
      message:
        "Invalid txnid format. It must start with 'TXN' and be followed by exactly 16 digits.",
    });
  }

  try {
    const data = {
      txnid: txnid,
      user_id: req.body.user_id,
      amount: req.body.amount,
      firstname: req.body.firstname,
      email: req.body.email,
      phone: req.body.phone,
      productinfo: req.body.productinfo,
      surl: req.body.surl,
      furl: req.body.furl,
      address1: req.body.address1 || "",
      address2: req.body.address2 || "",
      city: req.body.city || "",
      state: req.body.state || "",
      country: req.body.country || "",
      zipcode: req.body.zipcode || "",
      udf1: req.body.udf1 || "",
      udf2: req.body.udf2 || "",
      udf3: req.body.udf3 || "",
      udf4: req.body.udf4 || "",
      udf5: req.body.udf5 || "",
      key: config.key,
    };

    // Generate hash and attach to form
    const hash = generateHash(data, config.key, config.salt);
    data.hash = hash;

    const payment_url = geturl(config.env);
    const call_url = payment_url + "payment/initiateLink";

    const paymentForm = qs.stringify(data);

    util
      .call(call_url, paymentForm)
      .then(async (response) => {
        console.log("Easebuzz API Response:", response.data);

        if (!response || !response.data || typeof response.data !== "string") {
          return res.status(400).send({
            status: 0,
            message: "Failed to initiate payment: Invalid access key",
            response: response,
          });
        }

        const access_key = response.data;

        // ✅ Save into DB
        await initiatePaymentModel.create({
          txnid: txnid,
          user_id: req.body.user_id,
          amount: req.body.amount,
          firstname: req.body.firstname,
          email: req.body.email,
          phone: req.body.phone,
          product_info: req.body.productinfo,
          success_url: req.body.surl,
          failure_url: req.body.furl,
          address1: req.body.address1 || "",
          address2: req.body.address2 || "",
          city: req.body.city || "",
          state: req.body.state || "",
          country: req.body.country || "",
          zip_code: req.body.zipcode || "",
          udf1: req.body.udf1 || "",
          udf2: req.body.udf2 || "",
          udf3: req.body.udf3 || "",
          udf4: req.body.udf4 || "",
          udf5: req.body.udf5 || "",
          transaction_status: "Success",
          access_key: access_key,
        });

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

exports.getAllPayments = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const correlationId = req.headers["x-correlation-id"] || uuidv4();

    if (!apiKey || apiKey !== process.env.AUTH_SECRET) {
      return res.status(403).json({
        errors: [{ code: "AUTH001", message: "Invalid API Key" }],
      });
    }

    const paymentRecord = await initiatePaymentModel.findAll();

    if (!paymentRecord) {
      return res.status(404).json({
        errors: [{ code: "NOT_FOUND", message: "Membership not found" }],
      });
    }

    return res.status(200).json({ data: paymentRecord, correlationId });
  } catch (error) {
    return res.status(500).json({
      errors: [{ code: "SERVER_ERROR", message: error.message }],
    });
  }
};
