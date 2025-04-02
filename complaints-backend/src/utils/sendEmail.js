const nodemailer = require("nodemailer");
require("dotenv").config();
const pool = require("../config/db");

// Department email mapping
const departmentEmails = {
  "Road Maintenance": "vivekkulal905@gmail.com",
  "Water Supply": "vivekkulal905@gmail.com",
  "Sanitation": "vivekkulal905@gmail.com",
  "Sewage": "vivekkulal905@gmail.com",
  "Parks and Recreation": "vivekkulal905@gmail.com",
  "Public Transportation": "vivekkulal905@gmail.com",
  "Electrical Department": "vivekkulal905@gmail.com",
};

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email to the assigned department
async function sendDepartmentEmail(complaint) {
  const recipientEmail = departmentEmails[complaint.department] || "default@example.com";

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `New Complaint Assigned - ${complaint.department}`,
    text: `Complaint ID: ${complaint.complaint_id}\nCitizen: ${complaint.citizen_name}\nDescription: ${complaint.description}\nLocation: ${complaint.latitude}, ${complaint.longitude}\n\nPlease take necessary action.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to department: ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Error sending department email:", error);
  }
}

// Function to send email to the citizen when status is updated
async function sendCitizenEmail(complaintId, newStatus) {
  try {
    const result = await pool.query(
      "SELECT citizen_email, citizen_name, description, latitude, longitude FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (result.rows.length === 0) {
      console.error("❌ Complaint not found");
      return;
    }

    const { citizen_email, citizen_name, description, latitude, longitude } = result.rows[0];
    
    let subject, message;
    if (newStatus === "In Progress") {
      subject = "Your Complaint is Now In Progress!";
      message = `Dear ${citizen_name},\n\nYour complaint regarding \"${description}\" has been taken up and is now in progress.\n\nLocation: ${latitude}, ${longitude}\nComplaint ID: ${complaintId}\n\nYou will be notified once the issue is resolved.\n\nRegards,\nMunicipality Team`;
    } else if (newStatus === "Resolved") {
      subject = "Your Complaint Has Been Resolved";
      message = `Dear ${citizen_name},\n\nWe are pleased to inform you that your complaint regarding \"${description}\" has been marked resolved.\n\nLocation: ${latitude}, ${longitude}\nComplaint ID: ${complaintId}\n\nIf the issue still persists, please contact the respective department.\n\nRegards,\nMunicipality Team`;
    }

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: citizen_email, subject, text: message });
    console.log(`📩 Email sent to citizen: ${citizen_email}`);
  } catch (error) {
    console.error("❌ Error sending email to citizen:", error);
  }
}

module.exports = { sendDepartmentEmail, sendCitizenEmail };
