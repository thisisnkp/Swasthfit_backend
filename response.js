var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const EasebuzzPayment = require("./server/easeBuzz_payment/model/easebuzz_trans.model");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/response", async function (req, res) {
  // Log the complete payment response
  console.log("Payment Response Received:", req.query);

  try {
    // Extract payment details from the response
    const { txnid, status, error, error_Message, easepayid, bank_ref_num } =
      req.query;

    // Log payment status
    console.log(`Payment Status for txnid ${txnid}: ${status}`);

    if (txnid) {
      // Find the payment record in the database
      const paymentRecord = await EasebuzzPayment.findOne({ where: { txnid } });

      if (paymentRecord) {
        // Update payment status in the database
        paymentRecord.transaction_status = status || "Unknown";

        // Store additional payment details
        paymentRecord.udf1 = easepayid || paymentRecord.udf1;
        paymentRecord.udf2 = bank_ref_num || paymentRecord.udf2;
        paymentRecord.udf3 = error || paymentRecord.udf3;
        paymentRecord.udf4 = error_Message || paymentRecord.udf4;

        // Save the updated record
        await paymentRecord.save();

        console.log(
          `Payment record updated for txnid ${txnid} with status: ${status}`
        );
      } else {
        console.error(`Payment record not found for txnid: ${txnid}`);
      }
    } else {
      console.error("No transaction ID in the payment response");
    }

    // Redirect to a success or failure page based on the payment status
    if (status === "success") {
      res.redirect("/payment-success?txnid=" + txnid);
    } else {
      res.redirect(
        "/payment-failure?txnid=" +
          txnid +
          "&error=" +
          (error_Message || "Payment failed")
      );
    }
  } catch (error) {
    console.error("Error processing payment response:", error);
    res.status(500).send("Error processing payment response");
  }
});

// Export the router if you're using it as a module
module.exports = app;
