// const nodemailer = require("nodemailer");

// /**
//  * Sends an email using the provided details and SMTP configuration.
//  *
//  * @param {string} subject - The subject of the email.
//  * @param {string} body - The body content of the email (can be plain text or HTML).
//  * @param {string} fromEmail - The email address of the sender.
//  * @param {string} toEmail - The email address of the recipient.
//  * @param {object} smtpConfig - Configuration object for the SMTP transporter.
//  * @returns {Promise<string>} A promise that resolves with the message ID if successful, or rejects with an error.
//  */
// async function sendEmail(subject, body, fromEmail, toEmail, smtpConfig) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: smtpConfig.host,
//       port: smtpConfig.port,
//       secure: smtpConfig.secure,
//       auth: {
//         user: smtpConfig.auth.user,
//         pass: smtpConfig.auth.pass,
//       },
//     });

//     const mailOptions = {
//       from: `"${fromEmail.split("@")[0]}" <${fromEmail}>`,
//       to: toEmail,
//       subject: subject,
//       html: body,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully!");
//     console.log("Message ID:", info.messageId);

//     return info.messageId;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// }

// async function main() {
//   const emailSubject = "Automatic Email from My Node.js App";
//   const emailBodyHtml = `
//         <h1>Namaste Vikram!</h1>
//         <p>Yeh email Node.js script se bheja gaya hai.</p>
//         <p>Aap is content ko apni zaroorat ke anusaar badal sakte hain.</p>
//         <p>Dhanyawad,</p>
//         <p>Vikas</p>
//     `;

//   const YOUR_APP_PASSWORD = "aiob xcyf qfqf vgvh";

//   const senderEmailAddress = "vmandloi852@gmail.com";
//   const recipientEmailAddress = "vikram.mandloi.averybit@gmail.com";

//   const gmailSmtpConfig = {
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: senderEmailAddress,
//       pass: YOUR_APP_PASSWORD,
//     },
//   };

//   if (
//     YOUR_APP_PASSWORD === "AAPKA_16_CHARACTER_KA_APP_PASSWORD_YAHAN_DAALEIN" ||
//     !YOUR_APP_PASSWORD
//   ) {
//     console.error(
//       "कृपया 'YOUR_APP_PASSWORD' ko code mein apne Gmail App Password se replace karein."
//     );
//     console.error("App Password ke bina email nahi bhej sakte.");
//     return;
//   }

//   console.log(
//     `Sending email from ${senderEmailAddress} to ${recipientEmailAddress}...`
//   );
//   console.log(`Subject: ${emailSubject}`);

//   try {
//     await sendEmail(
//       emailSubject,
//       emailBodyHtml,
//       senderEmailAddress,
//       recipientEmailAddress,
//       gmailSmtpConfig
//     );
//   } catch (error) {
//     console.error("Main function mein email bhejte waqt error:", error.message);
//   }
// }

// if (require.main === module) {
//   main();
// }

const nodemailer = require("nodemailer");

/**
 * Sends an email using the provided details and SMTP configuration.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function sendEmailController(req, res) {
  // Extract data from the request body
  const { subject, body, fromEmail, toEmail, smtpConfig } = req.body;

  // Basic validation (you can add more comprehensive validation)
  if (!subject || !body || !fromEmail || !toEmail || !smtpConfig) {
    return res
      .status(400)
      .json({ message: "Missing required email parameters." });
  }

  if (
    !smtpConfig.host ||
    !smtpConfig.port ||
    typeof smtpConfig.secure === "undefined" ||
    !smtpConfig.auth ||
    !smtpConfig.auth.user ||
    !smtpConfig.auth.pass
  ) {
    return res
      .status(400)
      .json({ message: "Missing required SMTP configuration parameters." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure, // true for 465, false for other ports
      auth: {
        user: smtpConfig.auth.user, // Your SMTP username
        pass: smtpConfig.auth.pass, // Your SMTP password or App Password
      },
    });

    const mailOptions = {
      from: `"${fromEmail.split("@")[0]}" <${fromEmail}>`,
      to: toEmail,
      subject: subject,
      html: body, // assuming body is HTML, you could also use 'text' for plain text
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return res.status(200).json({
      message: "Email sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // It's good practice to not expose detailed internal errors to the client
    // Log the detailed error on the server, but send a generic error message to the client
    return res.status(500).json({
      message: "Failed to send email.",
      error: error.message, // Or a more generic error message for production
    });
  }
}

module.exports = {
  sendEmailController,
};
