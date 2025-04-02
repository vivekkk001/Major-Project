const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");
const { sendDepartmentEmail, sendCitizenEmail } = require("../utils/sendEmail");

const router = express.Router();

// 📌 Complaint Submission Route
router.post("/", verifyToken, async (req, res) => {
  try {
    const { description, latitude, longitude, image_url } = req.body;
    const citizen_name = req.user.name;
    const citizen_email = req.user.email;
    console.log("User Data from Token:", req.user);

    // 🔹 Step 1: Call ML API to Get Department
    const mlResponse = await axios.post("http://localhost:8000/predict", { description });
    console.log("ML API Response:", mlResponse.data);
    const department = mlResponse.data.department;

    // 🔹 Step 2: Insert Complaint into Database
    const newComplaint = await pool.query(
      "INSERT INTO complaints (citizen_name, citizen_email, department, description, image_url, status, created_at, latitude, longitude) VALUES ($1, $2, $3, $4, $5, 'Pending', NOW(), $6, $7) RETURNING *",
      [citizen_name, citizen_email, department, description, image_url, latitude, longitude]
    );

    // 🔹 Step 3: Send Email to the Respective Department
    await sendDepartmentEmail(newComplaint.rows[0]);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint.rows[0],
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Complaint Status Update Route (Only for Officials)
router.put("/update-status", verifyToken, async (req, res) => {
  try {
    const { complaintId, newStatus } = req.body;

    // Update the status in the database
    const updateResult = await pool.query(
      "UPDATE complaints SET status = $1 WHERE complaint_id = $2 RETURNING *",
      [newStatus, complaintId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Send Email Notification to Citizen
    await sendCitizenEmail(complaintId, newStatus);

    res.json({ message: "Status updated and email sent to citizen" });
  } catch (error) {
    console.error("❌ Error updating complaint status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;