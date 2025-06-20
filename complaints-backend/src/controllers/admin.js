const pool = require("../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@smartcivic.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ message: "Admin login successful", token: "admin-token" });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departments");
    res.json(result.rows);
  } catch (err) {
    console.error("getDepartments error:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO departments (name) VALUES ($1)", [name]);
    res.json({ message: "Department created" });
  } catch (err) {
    console.error("createDepartment error:", err);
    res.status(500).json({ message: "Failed to create department" });
  }
};

exports.registerOfficial = async (req, res) => {
  const { official_id, email, password, department_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO officials (official_id, email, password, department_id) VALUES ($1, $2, $3, $4)",
      [official_id, email, hashedPassword, department_id]
    );
    res.json({ message: "Official registered" });
  } catch (err) {
    console.error("registerOfficial error:", err);
    res.status(500).json({ message: "Failed to register official" });
  }
};
