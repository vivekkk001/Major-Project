const nodemailer = require("nodemailer");
require("dotenv").config();

// Mapping department names to email addresses
const departmentEmails = {
  "Road Maintenance": "vivekkulal905@gmail.com",
  "Water Supply": "vivekkulal905@gmail.com",
  "Sanitation": "vivekkulal905@gmail.com",
  "Sewage": "vivekkulal905@gmail.com",
  "Parks and Recreation": "vivekkulal905@gmail.com",
  "Public Transportation": "vivekkulal905@gmail.com",
  "Electrical Department": "vivekkulal905@gmail.com"
};

async function sendEmail(complaint) {
  const recipientEmail = departmentEmails[complaint.department] || "default@example.com";

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `New Complaint Assigned - ${complaint.department}`,
    text: `Complaint ID: ${complaint.complaint_id}\nCitizen: ${complaint.citizen_name}\nDescription: ${complaint.description}\nLocation: ${complaint.latitude}, ${complaint.longitude}\n\nPlease take necessary action.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

module.exports = sendEmail;
