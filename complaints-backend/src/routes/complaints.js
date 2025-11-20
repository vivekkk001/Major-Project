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
const svgCaptcha = require("svg-captcha");

require("dotenv").config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ==============================
   CAPTCHA ROUTES
   ============================== */

// Generate CAPTCHA
router.get("/captcha", (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 0,
      color: true,
      background: "#1E293B",
      width: 200,
      height: 70,
      fontSize: 60,
      disort: false,
      charPreset:
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789",
    });

    req.session.captcha = captcha.text.toLowerCase();
    console.log("CAPTCHA Generated:", req.session.captcha);

    res.type("svg");
    res.status(200).send(captcha.data);
  } catch (error) {
    console.error("Error generating CAPTCHA:", error);
    res.status(500).json({ message: "Failed to generate CAPTCHA" });
  }
});

// Optional: verify CAPTCHA
router.post("/verify-captcha", (req, res) => {
  try {
    const { captcha } = req.body;

    if (!req.session.captcha) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA expired. Please refresh.",
      });
    }

    const isValid = captcha.toLowerCase() === req.session.captcha;

    if (isValid) {
      return res.json({ success: true, message: "CAPTCHA verified" });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid CAPTCHA. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    res.status(500).json({ message: "CAPTCHA verification failed" });
  }
});

/* ==============================
   AI SUGGESTION ROUTE
   ============================== */

router.post("/generate-suggestions", async (req, res) => {
  try {
    const { keyword } = req.body;

    console.log("=== GENERATE SUGGESTIONS CALLED ===");
    console.log("Keyword:", keyword);

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({
        message: "Gemini API key not configured",
        error: "Server configuration error",
      });
    }

    console.log("✅ API Key found, length:", geminiApiKey.length);

    const models = ["gemini-1.5-flash", "gemini-1.5-pro"];

    const prompt = `Based on the keyword "${keyword}", generate 5 clear and specific complaint descriptions for a civic complaint system. Each description should be a complete sentence that citizens can select to describe their issue. Format the response as a JSON array of strings. Only return the JSON array, nothing else.

Example format:
["Description 1", "Description 2", "Description 3", "Description 4", "Description 5"]`;

    let geminiResponse;
    let lastError;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        geminiResponse = await axios.post(
          geminiUrl,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Successfully used model: ${model}`);
        break;
      } catch (modelError) {
        console.log(`Model ${model} failed, trying next...`);
        lastError = modelError;
        continue;
      }
    }

    if (!geminiResponse) {
      throw lastError || new Error("All models failed");
    }

    const generatedText =
      geminiResponse.data.candidates[0].content.parts[0].text;

    let suggestions;
    try {
      const cleanedText = generatedText
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      suggestions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      suggestions = generatedText
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
        .slice(0, 5);
    }

    res.json({
      keyword,
      suggestions: suggestions.slice(0, 5),
    });
  } catch (error) {
    console.error("=== ERROR GENERATING SUGGESTIONS ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    res.status(500).json({
      message: "Failed to generate suggestions",
      error: error.response?.data?.error?.message || error.message,
      details:
        process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

/* ==============================
   SUBMIT COMPLAINT
   ============================== */

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { description, latitude, longitude, captcha } = req.body;
    const citizen_name = req.user.name;
    const citizen_email = req.user.email;

    // CAPTCHA verify
    if (!captcha || !req.session.captcha) {
      return res.status(400).json({
        message: "CAPTCHA is required. Please refresh and try again.",
      });
    }

    if (captcha.toLowerCase() !== req.session.captcha) {
      delete req.session.captcha;
      return res.status(400).json({
        message: "Invalid CAPTCHA. Please try again.",
      });
    }

    delete req.session.captcha;
    console.log("✅ CAPTCHA verified successfully");

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Step 1: ML classification
    const mlResponse = await axios.post(process.env.ML_MODEL_API_URL, {
      description,
    });
    const department = mlResponse.data.department;
    console.log("Step 1 - Department:", department);

    // Step 2: Cloudinary upload as webp
    const buffer = await sharp(req.file.buffer).webp().toBuffer();
    const cloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "complaints", format: "webp" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });

    const image_url = await cloudinaryUpload();
    console.log("Step 2 - Uploaded to Cloudinary:", image_url);

    // Step 3: location validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        message:
          "Location access is required to submit the complaint",
      });
    }

    // Step 4: reverse geocoding
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const address = await reverseGeocode(lat, lng);
    console.log("Step 4 - Geocoded Address:", address);

    // Step 5: generate complaint_id
    const counterRes = await pool.query(
      "SELECT last_used_id FROM complaint_counter WHERE id = 1"
    );
    const newComplaintId = counterRes.rows[0].last_used_id + 1;
    await pool.query(
      "UPDATE complaint_counter SET last_used_id = $1 WHERE id = 1",
      [newComplaintId]
    );

    // Step 6: insert complaint
    const newComplaint = await pool.query(
      `INSERT INTO complaints 
        (complaint_id, citizen_name, citizen_email, department, description, image_url, latitude, longitude, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        newComplaintId,
        citizen_name,
        citizen_email,
        department,
        description,
        image_url,
        lat,
        lng,
        address,
        "pending",
      ]
    );

    // Step 7: add to blockchain + save pending_hash
    try {
      const txHash = await blockchainService.addComplaint(
        newComplaintId.toString()
      );

      await pool.query(
        "UPDATE complaints SET pending_hash = $1 WHERE complaint_id = $2",
        [txHash, newComplaintId.toString()]
      );
      console.log(`Blockchain Tx saved (pending_hash): ${txHash}`);
    } catch (blockchainError) {
      console.error("Blockchain recording error:", blockchainError);
    }

    // Step 8: email department
    await sendDepartmentEmail(newComplaint.rows[0]);

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint.rows[0],
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

/* ==============================
   SIMPLE FIELD EDIT ROUTES
   (description, address)
   ============================== */

router.put("/:id/description", async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE complaints SET description = $1 WHERE complaint_id = $2 RETURNING *",
      [description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Description updated", complaint: result.rows[0] });
  } catch (err) {
    console.error("Error updating description:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/address", async (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  try {
    const result = await pool.query(
      "UPDATE complaints SET address = $1 WHERE complaint_id = $2 RETURNING *",
      [address, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Address updated", complaint: result.rows[0] });
  } catch (err) {
    console.error("Error updating address:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   ADMIN / OFFICIAL LIST ROUTE
   ============================== */

router.get("/all", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "official") {
      return res.status(403).json({
        message: "Unauthorized: Only officials can view all complaints",
      });
    }

    const department = req.query.department || req.user.department;
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

/* ==============================
   STATUS UPDATE + HASHES
   (USED BY DEPARTMENT DASHBOARD)
   PUT /api/complaints/:id/status
   ============================== */

router.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status: newStatus } = req.body;

    if (req.user.role !== "official") {
      return res.status(403).json({
        message: "Unauthorized: Only officials can update complaint status",
      });
    }

    // 1️⃣ Generate blockchain tx hash for this status change
    let txHash = null;
    try {
      txHash = await blockchainService.updateStatus(
        complaintId.toString(),
        newStatus
      );
    } catch (err) {
      console.error("Blockchain error:", err);
      // We still continue; txHash will be null
    }

    // 2️⃣ Map status -> hash column
    let columnToUpdate = null;
    if (newStatus === "pending") columnToUpdate = "pending_hash";
    if (newStatus === "in-progress") columnToUpdate = "progress_hash";
    if (newStatus === "resolved") columnToUpdate = "resolved_hash";

    if (!columnToUpdate) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 3️⃣ Update status + correct hash column
    const updateQuery = `
      UPDATE complaints 
      SET status = $1, ${columnToUpdate} = $2
      WHERE complaint_id = $3
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, [
      newStatus,
      txHash,
      complaintId,
    ]);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 4️⃣ Send email to citizen
    await sendCitizenEmail(complaintId, newStatus);

    res.json({
      message: "Status updated successfully",
      hash_saved_in: columnToUpdate,
      txHash,
      complaint: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
router.put("/update-status", verifyToken, async (req, res) => {
  try {
    const { complaintId, newStatus } = req.body;

    if (req.user.role !== "official") {
      return res.status(403).json({
        message: "Unauthorized: Only officials can update complaint status",
      });
    }

    console.log(`Updating status for complaint ${complaintId} to "${newStatus}"...`);

    // Blockchain hash generate
    let txHash = null;
    try {
      txHash = await blockchainService.updateStatus(
        complaintId.toString(),
        newStatus
      );
      console.log("Status updated. Tx hash:", txHash);
    } catch (err) {
      console.error("Blockchain error:", err);
    }

    // Map status → correct hash column
    let columnToUpdate = null;
    if (newStatus === "pending") columnToUpdate = "pending_hash";
    if (newStatus === "in-progress") columnToUpdate = "progress_hash";
    if (newStatus === "resolved") columnToUpdate = "resolved_hash";

    if (!columnToUpdate) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update status + hash
    const updateQuery = `
      UPDATE complaints 
      SET status = $1, ${columnToUpdate} = $2
      WHERE complaint_id = $3
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, [
      newStatus,
      txHash,
      complaintId,
    ]);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Email to citizen
    await sendCitizenEmail(complaintId, newStatus);

    res.json({
      message: "Status updated successfully",
      hash_saved_in: columnToUpdate,
      txHash,
      complaint: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


/* ==============================
   CITIZEN: MY COMPLAINTS
   ============================== */

router.get("/my-complaints", verifyToken, async (req, res) => {
  try {
    console.log("=== MY COMPLAINTS ENDPOINT CALLED ===");
    console.log("User from token:", req.user);

    const citizenEmail = req.user.email;
    console.log("Filtering by citizen email:", citizenEmail);

    const complaints = await pool.query(
      `SELECT 
        complaint_id,
        citizen_name,
        citizen_email,
        department,
        description,
        status,
        image_url,
        pending_hash,
        progress_hash,
        resolved_hash,
        latitude,
        longitude,
        address,
        created_at
       FROM complaints
       WHERE citizen_email = $1
       ORDER BY created_at DESC`,
      [citizenEmail]
    );

    console.log(
      `Found ${complaints.rows.length} complaints for email: ${citizenEmail}`
    );
    res.json(complaints.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ==============================
   BLOCKCHAIN VERIFICATION
   ============================== */

router.get("/verify/:id", verifyToken, async (req, res) => {
  try {
    const complaintId = req.params.id;

    const dbResult = await pool.query(
      "SELECT * FROM complaints WHERE complaint_id = $1",
      [complaintId]
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const dbComplaint = dbResult.rows[0];

    try {
      const blockchainData = await blockchainService.getComplaint(
        complaintId.toString()
      );
      const latestBlockchainStatus =
        blockchainData.statusUpdates[
          blockchainData.statusUpdates.length - 1
        ];
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
          statusHistory: blockchainData.statusUpdates,
        },
      });
    } catch (blockchainError) {
      console.error("Blockchain verification error:", blockchainError);
      res.status(500).json({
        verified: false,
        message: "Failed to verify on blockchain",
        error: blockchainError.message,
      });
    }
  } catch (error) {
    console.error("Error verifying complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
