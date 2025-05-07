const express = require("express");
const axios = require("axios");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");
const reverseGeocode = require("../utils/reverseGeocode");
const { sendDepartmentEmail, sendCitizenEmail } = require("../utils/sendEmail");
const blockchainService = require("../utils/blockchainService");
// const cv = require('@u4/opencv4nodejs');

require("dotenv").config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔍 Utility to check image blur using Laplacian variance
// function isImageBlurred(buffer, threshold = 100) {
//   const image = cv.imdecode(buffer); // Decode buffer into Mat
//   const gray = image.bgrToGray(); // Convert to grayscale
//   const laplacian = gray.laplacian(cv.CV_64F); // Apply Laplacian
//   const variance = laplacian.meanStdDev().stddev.at(0) ** 2; // Variance

//   console.log("🔍 Blur variance:", variance);
//   return variance < threshold;
// }

// 📌 Complaint Submission Route
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;
    const citizen_name = req.user.name;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    // if (isImageBlurred(req.file.buffer)) {
    //   return res.status(400).json({
    //     message: "Image is too blurry. Please retake the photo or upload a clearer one.",
    //   });
    // }

    // 🔹 Step 1: ML Department classification
    const mlResponse = await axios.post(process.env.ML_MODEL_API_URL, { description });
    const department = mlResponse.data.department;
    console.log("Step 1 - Department:", department);

    // 🔹 Step 2: Convert to .webp and upload to Cloudinary
    const buffer = await sharp(req.file.buffer).webp().toBuffer();

    const cloudinaryUpload = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "complaints", format: "webp" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    const image_url = await cloudinaryUpload();
    console.log("Step 2 - Uploaded to Cloudinary:", image_url);

    // 🔹 Step 3: Validate location
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location access is required to submit the complaint" });
    }

    // 🔹 Step 4: Reverse Geocoding
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const address = await reverseGeocode(lat, lng);
    console.log("Step 4 - Geocoded Address:", address);

    // 🔹 Step 5: Generate complaint_id
    const counterRes = await pool.query("SELECT last_used_id FROM complaint_counter WHERE id = 1");
    const newComplaintId = counterRes.rows[0].last_used_id + 1;
    await pool.query("UPDATE complaint_counter SET last_used_id = $1 WHERE id = 1", [newComplaintId]);

    // 🔹 Step 6: Insert complaint into DB
    const newComplaint = await pool.query(
      `INSERT INTO complaints 
        (complaint_id, citizen_name, department, description, image_url, latitude, longitude, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [newComplaintId, citizen_name, department, description, image_url, lat, lng, address]
    );

    // 🔹 Step 7: Add complaint to blockchain
    try {
      const txHash = await blockchainService.addComplaint(newComplaintId.toString());
      await pool.query(
        "UPDATE complaints SET blockchain_tx_hash = $1 WHERE complaint_id = $2",
        [txHash, newComplaintId.toString()]
      );
      console.log(`Blockchain Tx saved: ${txHash}`);
    } catch (blockchainError) {
      console.error("Blockchain recording error:", blockchainError);
    }

    // 🔹 Step 8: Send email to department
    await sendDepartmentEmail(newComplaint.rows[0]);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint.rows[0],
    });

  } catch (error) {
    console.error(" Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
// official dashboard Data of citizen
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaints ORDER BY complaint_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//Update the database when we change the status in the official dashboard
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE complaints SET status = $1 WHERE complaint_id = $2 RETURNING *",
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Status updated", complaint: result.rows[0] });
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Complaint Status Update Route (Only for Officials)
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

    // Update status on blockchain
    try {
      const txHash = await blockchainService.updateStatus(complaintId.toString(), newStatus);

      // Store transaction hash in database (optional)
      await pool.query(
        `INSERT INTO complaint_status_history 
          (complaint_id, status, blockchain_tx_hash) 
         VALUES ($1, $2, $3)`,
        [complaintId, newStatus, txHash]
      );

      console.log(`Status updated on blockchain for complaint ${complaintId}. Tx: ${txHash}`);
    } catch (blockchainError) {
      // Log error but don't fail the request if blockchain update fails
      console.error("Blockchain status update error:", blockchainError);
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

//  Get complaints for logged-in citizen
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

// Get all complaints (for officials only)
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

// New route: Verify complaint on blockchain
router.get("/verify/:id", verifyToken, async (req, res) => {
  try {
    const complaintId = req.params.id;

    // Get complaint from database
    const dbResult = await pool.query(
      "SELECT * FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const dbComplaint = dbResult.rows[0];

    // Get complaint data from blockchain
    try {
      const blockchainData = await blockchainService.getComplaint(complaintId.toString());

      // Verify that DB status matches latest blockchain status
      const latestBlockchainStatus = blockchainData.statusUpdates[blockchainData.statusUpdates.length - 1];
      const isVerified = dbComplaint.status === latestBlockchainStatus;

      res.json({
        verified: isVerified,
        message: isVerified
          ? "Complaint record verified on blockchain"
          : "Warning: Database record doesn't match blockchain record",
        dbRecord: dbComplaint,
        blockchainRecord: {
          complaintId: blockchainData.complaintId,
          createdAt: blockchainData.timestamp,
          statusHistory: blockchainData.statusUpdates
        }
      });
    } catch (blockchainError) {
      console.error("Blockchain verification error:", blockchainError);
      res.status(500).json({
        verified: false,
        message: "Failed to verify on blockchain",
        error: blockchainError.message
      });
    }
  } catch (error) {
    console.error("Error verifying complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
