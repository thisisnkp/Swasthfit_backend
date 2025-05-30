const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or Mailgun, SendGrid, etc.
  auth: {
    user: process.env.MAIL_USER, // add your email here
    pass: process.env.MAIL_PASS, // add your email here
  },
});

module.exports = async function sendEmail(to, message) {
  await transporter.sendMail({
    from: process.env.MAIL_USER, // add your email here
    to,
    subject: "Meeting Reminder",
    text: message,
  });
};
