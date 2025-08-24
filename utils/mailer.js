const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.ZOHO_EMAIL_USER, // e.g., 'yourname@yourdomain.com'
    pass: process.env.ZOHO_EMAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Tofar Logistics Agency" <${process.env.ZOHO_EMAIL_USER}>`, // include a name
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;

// SMTP transport setup with ZeptoMail
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: "smtp.zeptomail.com", // ZeptoMail SMTP host
//   port: 587,                  // TLS port (465 for SSL if needed)
//   secure: false,              // true if you use 465
//   auth: {
//     user: "your-generated-email-token", // NOT your email, use the token provided by ZeptoMail
//     pass: "your-generated-token-secret"
//   },
//   tls: {
//     rejectUnauthorized: false // sometimes needed for ZeptoMail
//   }
// });

// const sendMail = async (to, subject, html) => {
//   const mailOptions = {
//     from: '"Tofar Logistics Agency" <no-reply@yourdomain.com>', 
//     to,
//     subject,
//     html,
//   };

//   try {
//     let info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: ", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

// module.exports = sendMail;
