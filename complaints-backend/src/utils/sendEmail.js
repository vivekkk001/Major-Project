const nodemailer = require("nodemailer");
require("dotenv").config();
const pool = require("../config/db");

// Department email mapping
const departmentEmails = {
  "Road Maintenance": "infrastructure@smartcivic.tech",
  "Water Supply": "utilities@smartcivic.tech",
  "Sanitation": "parks.environment@smartcivic.tech, utilities@smartcivic.tech",
  "Sewage": "utilities@smartcivic.tech",
  "Parks and Recreation": "parks.environment@smartcivic.tech",
  "Public Transportation": "infrastructure@smartcivic.tech",
  "Electrical Department": "infrastructure@smartcivic.tech",
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Send department notification email
async function sendDepartmentEmail(complaint) {
  const recipientEmail = departmentEmails[complaint.department] || "default@example.com";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    cc: "admin@smartcivic.tech",
    subject: `New Complaint Assigned - ${complaint.department}`,
    text: `
Complaint ID: ${complaint.complaint_id}
Citizen: ${complaint.citizen_name}
Description: ${complaint.description}
Location: ${complaint.address}
View Location: https://www.google.com/maps/search/?api=1&query=${complaint.latitude},${complaint.longitude}

Please take necessary action.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Department email sent to: ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending department email:", error);
  }
}

// 🔹 Citizen status update email
async function sendCitizenEmail(complaintId, newStatus) {
  try {
    const result = await pool.query(
      "SELECT citizen_email, citizen_name, description, latitude, longitude FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (result.rows.length === 0) return;

    const { citizen_email, citizen_name, description, latitude, longitude } = result.rows[0];
    let subject = "";
    let message = "";

    // FIXED — match backend status values
    if (newStatus === "in-progress") {
      subject = "Your Complaint is Now In Progress";
      message = `
Dear ${citizen_name},

Your complaint regarding "${description}" is now in progress.

Location: ${latitude}, ${longitude}
Complaint ID: ${complaintId}

Regards,
SmartCivic Team
      `;
    }

    if (newStatus === "resolved") {
      subject = "Your Complaint Has Been Resolved";
      message = `
Dear ${citizen_name},

Your complaint regarding "${description}" has been resolved.

Location: ${latitude}, ${longitude}
Complaint ID: ${complaintId}

Regards,
SmartCivic Team
      `;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: citizen_email,
      subject,
      text: message,
    });

    console.log("Citizen status update email sent:", citizen_email);
  } catch (error) {
    console.error("Error sending citizen status email:", error);
  }
}


// 🔹 NEW: Send password reset email
async function sendPasswordResetEmail(email, resetURL) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SmartCivic Password Reset",
      text: `
We received a request to reset your password.

Click the link below to reset it:

${resetURL}

This link will expire in 10 minutes.

If you did not request this, please ignore it.

Regards,
SmartCivic Team
      `,
    });

    console.log("Password reset email sent:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

module.exports = {
  sendDepartmentEmail,
  sendCitizenEmail,
  sendPasswordResetEmail,
};
