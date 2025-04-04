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
    console.log("User Data from Token:", req.user);

    // 🔹 Step 1: Call ML API to Get Department
    const mlResponse = await axios.post("http://localhost:8000/predict", { description });
    console.log("ML API Response:", mlResponse.data);
    const department = mlResponse.data.department;

    // 🔹 Step 2: Insert Complaint into Database
    const newComplaint = await pool.query(
      `INSERT INTO complaints 
        (citizen_name, department, description, image_url, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        citizen_name,        // From JWT token
        department,          // From ML API
        description,         // From req.body
        image_url,           // From req.body
        latitude,            // From req.body
        longitude            // From req.body
      ]
    );
    
    // 🔹 Step 3: Send Email to the Respective Department
    await sendDepartmentEmail(newComplaint.rows[0]);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint.rows[0],
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 📌 Complaint Status Update Route (Only for Officials)
router.put("/update-status", verifyToken, async (req, res) => {
  try {
    const { complaintId, newStatus } = req.body;
    
    // Check if the user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: "Unauthorized: Only officials can update complaint status" });
    }

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

    res.json({ 
      message: "Status updated and email sent to citizen",
      complaint: updateResult.rows[0]
    });
  } catch (error) {
    console.error("❌ Error updating complaint status:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 📌 Get complaints for logged-in citizen
router.get("/my-complaints", verifyToken, async (req, res) => {
  try {
    const citizenName = req.user.name;
    
    const complaints = await pool.query(
      "SELECT * FROM complaints WHERE citizen_name = $1 ORDER BY created_at DESC",
      [citizenName]
    );
    
    res.json(complaints.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Get all complaints (for officials only)
router.get("/all", verifyToken, async (req, res) => {
  try {
    // Check if user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: "Unauthorized: Only officials can view all complaints" });
    }
    
    // Officials can filter by department
    const { department } = req.query;
    let complaints;
    
    if (department) {
      complaints = await pool.query(
        "SELECT * FROM complaints WHERE department = $1 ORDER BY created_at DESC",
        [department]
      );
    } else {
      complaints = await pool.query(
        "SELECT * FROM complaints ORDER BY created_at DESC"
      );
    }
    
    res.json(complaints.rows);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;