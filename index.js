// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const expressFileUpload = require("express-fileupload");
const sha512 = require("js-sha512");
require("dotenv").config();

const swaggerSpec = require("./swagger");
const Routes = require("./routes");

const easebuzzController = require("./Easebuzz/initiate_payment");
const transaction = require("./Easebuzz/transaction");
const transaction_date = require("./Easebuzz/tranaction_date");
const payout = require("./Easebuzz/payout");
const refund = require("./Easebuzz/refund");

require("./server/zegocloud/reminderScheduler/reminderScheduler");

const app = express();

// Server
const port = process.env.PORT || 4001;
// const host = process.env.HOST || 4001;

// Middleware
app.use(
  cors({
    origin: "*", // Be more specific in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload({ parseNested: true }));

// Static & View Setup
app.use("/static", express.static(path.join(__dirname, "assets")));
app.use("/view", express.static(path.join(__dirname, "views")));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Easebuzz Config
const config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV || "test",
  enable_iframe: parseInt(process.env.EASEBUZZ_IFRAME || "0", 10),
};

console.log("Easebuzz Config:", config);

// Routes
app.post(
  "/initiate",
  (req, res) =>
    console.log("Initiate Payment API called") ||
    easebuzzController.initiatePayment(req, res, config)
);
// Serve Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// require("./server/marketing/postScheduler");

// const Routes = require("./routes");

app.get(
  "/getAllPayments",
  (req, res) =>
    console.log("Initiate Payment API called") ||
    easebuzzController.getAllPayments(req, res, config)
);

// getAllPayments

app.post("/response", function (req, res) {
  function checkReverseHash(response) {
    const hashstring = [
      config.salt,
      response.status,
      response.udf10,
      response.udf9,
      response.udf8,
      response.udf7,
      response.udf6,
      response.udf5,
      response.udf4,
      response.udf3,
      response.udf2,
      response.udf1,
      response.email,
      response.firstname,
      response.productinfo,
      response.amount,
      response.txnid,
      response.key,
    ].join("|");

    const hash_key = sha512.sha512(hashstring);
    return hash_key === req.body.hash;
  }

  if (checkReverseHash(req.body)) {
    res.send(req.body);
  } else {
    res.send("false, check the hash value");
  }
});

app.post("/transaction", (req, res) =>
  transaction.transaction(req.body, config, res)
);
app.post("/transaction_date", (req, res) =>
  transaction_date.tranaction_date(req.body, config, res)
);
app.post("/payout", (req, res) => payout.payout(req.body, config, res));
app.post("/refund", (req, res) => refund.refund(req.body, config, res));

app.use("/", Routes);

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at: http://"0.0.0.0":${port}`);
});

// app.listen(port, host, () => {
//   console.log(`🚀 Server running at: http://${host}:${port}`);
// });

// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const swaggerUi = require("swagger-ui-express");
// const expressFileUpload = require("express-fileupload");
// const sha512 = require("js-sha512");
// require("dotenv").config();

// const initiate_payment = require("./Easebuzz/initiate_payment");
// const transaction = require("./Easebuzz/transaction");
// const transaction_date = require("./Easebuzz/tranaction_date");
// const payout = require("./Easebuzz/payout");
// const refund = require("./Easebuzz/refund");
// const swaggerSpec = require("./swagger");
// const Routes = require("./routes");
// const easebuzzController = require('./Easebuzz/initiate_payment');
// // const easebuzzController = require('./Easebuzz/initiate_payment');

// const app = express();

// // Middleware

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(expressFileUpload({ parseNested: true }));

// // Static & view setup
// app.use("/static", express.static(path.join(__dirname, "assets")));
// app.use("/view", express.static(path.join(__dirname, "views")));
// app.engine("html", require("ejs").renderFile);
// app.set("view engine", "ejs");

// // Swagger Docs
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Easebuzz config
// const config = {
//   key: process.env.EASEBUZZ_KEY,
//   salt: process.env.EASEBUZZ_SALT,
//   env: process.env.EASEBUZZ_ENV,
//   enable_iframe: parseInt(process.env.EASEBUZZ_IFRAME || "0", 10),
// };

// console.log("KEY:", config);
// // Main Route Setup

// // Payment Response Verification
// app.post("/response", function (req, res) {
//   function checkReverseHash(response) {
//     const hashstring = [
//       config.salt,
//       response.status,
//       response.udf10,
//       response.udf9,
//       response.udf8,
//       response.udf7,
//       response.udf6,
//       response.udf5,
//       response.udf4,
//       response.udf3,
//       response.udf2,
//       response.udf1,
//       response.email,
//       response.firstname,
//       response.productinfo,
//       response.amount,
//       response.txnid,
//       response.key,
//     ].join("|");

//     const hash_key = sha512.sha512(hashstring);
//     return hash_key === req.body.hash;
//   }

//   if (checkReverseHash(req.body)) {
//     res.send(req.body);
//   } else {
//     res.send("false, check the hash value");
//   }
// });

// app.post('/initiate', easebuzzController.initiatePayment);

// // initiate_payment API
// // app.post("/initiate_payment", function (req, res) {
// //   console.log("Initiate Payment API called");
// //   console.log("Request Body:", req.body); // Log the request body
// //   try {
// //     const data = req.body;
// //     console.log(data, "data in initiate_payment");
// //     initiate_payment.initiate_payment(data, config, res);
// //   } catch (err) {
// //     console.error("Initiate Payment Error:", err);
// //     res.status(500).send("Internal Server Error");
// //   }
// // });

// // Transaction API
// app.post("/transaction", function (req, res) {
//   try {
//     const data = req.body;
//     transaction.transaction(data, config, res);
//   } catch (err) {
//     console.error("Transaction Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Transaction Date API
// app.post("/transaction_date", function (req, res) {
//   try {
//     const data = req.body;
//     transaction_date.tranaction_date(data, config, res);
//   } catch (err) {
//     console.error("Transaction Date Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Payout API
// app.post("/payout", function (req, res) {
//   try {
//     const data = req.body;
//     payout.payout(data, config, res);
//   } catch (err) {
//     console.error("Payout Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Refund API
// app.post("/refund", function (req, res) {
//   try {
//     const data = req.body;
//     refund.refund(data, config, res);
//   } catch (err) {
//     console.error("Refund Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.use("/", Routes);

// // Start Server
// const port = process.env.PORT || 4001;
// app.listen(port, () => {
//   console.log(`🚀 Server running at: http://localhost:${port}`);
// });
