const express = require("express");
const axios = require("axios"); // For calling ML API
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// 📌 Complaint Submission Route
router.post("/", verifyToken, async (req, res) => {
  try {
    const { description, latitude, longitude, image_url } = req.body;
    const citizen_name = req.user.name; // Get citizen name from token
    console.log("User Data from Token:", req.user);

    // 🔹 Step 1: Call ML API to Get Department
    const mlResponse = await axios.post("http://localhost:8000/predict", {
      description,
    });
    console.log("ML API Response:", mlResponse.data);
    const department = mlResponse.data.department;

    // 🔹 Step 2: Insert Complaint into Database (Status = "Pending")
    const newComplaint = await pool.query(
      "INSERT INTO complaints (citizen_name, department, description, image_url, status, created_at, latitude, longitude) VALUES ($1, $2, $3, $4, 'Pending', NOW(), $5, $6) RETURNING *",
      [citizen_name, department, description, image_url, latitude, longitude]
    );

    // 🔹 Step 3: Send Email to the Respective Department
    await sendEmail(newComplaint.rows[0]);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint.rows[0],
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
