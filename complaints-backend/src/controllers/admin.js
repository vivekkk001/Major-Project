const pool = require("../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@smartcivic.tech";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ message: "Admin login successful", token: "admin-token" });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
};

// Get all Citizens
exports.getCitizens = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, email, phone, address FROM citizens"
    );
    res.json({ citizens: result.rows });
  } catch (err) {
    console.error("getCitizens error:", err);
    res.status(500).json({ message: "Failed to fetch citizens" });
  }
};
// Update citizen
exports.updateCitizen = async (req, res) => {
  const { email } = req.params;
  const { name, phone, address } = req.body;

  try {
    const result = await pool.query(
      "UPDATE citizens SET name = $1, phone = $2, address = $3 WHERE email = $4",
      [name, phone, address, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json({ message: "Citizen updated successfully" });
  } catch (err) {
    console.error("updateCitizen error:", err);
    res.status(500).json({ message: "Failed to update citizen" });
  }
};

// Delete citizen
exports.deleteCitizen = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query("DELETE FROM citizens WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    res.json({ message: "Citizen deleted successfully" });
  } catch (err) {
    console.error("deleteCitizen error:", err);
    res.status(500).json({ message: "Failed to delete citizen" });
  }
};


exports.getAllComplaints = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        complaint_id AS id,
        citizen_name,
        citizen_email,
        department,
        description,
        image_url,
        status,
        latitude,
        longitude,
        address
      FROM complaints
      ORDER BY created_at DESC
    `);
    res.json({ complaints: result.rows });
  } catch (err) {
    console.error("getAllComplaints error:", err.message);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

exports.updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { description, latitude, longitude, address, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE complaints 
       SET description = $1, latitude = $2, longitude = $3, address = $4, status = $5
       WHERE complaint_id = $6`,
      [description, latitude, longitude, address, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint updated successfully" });
  } catch (err) {
    console.error("updateComplaint error:", err);
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

exports.deleteComplaint = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM complaints WHERE complaint_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("deleteComplaint error:", err);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
};
