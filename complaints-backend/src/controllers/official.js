const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.login = async (req, res) => {
  try {
    const { official_id, password, department } = req.body;

    // Validate official ID and password
    const officialRes = await pool.query("SELECT * FROM officials WHERE official_id = $1", [official_id]);
    if (officialRes.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const official = officialRes.rows[0];
    const validPassword = await bcrypt.compare(password, official.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    // Validate department
    if (official.department !== department) {
      return res.status(403).json({ message: "Department mismatch" });
    }

    // Generate token
    const token = jwt.sign(
      { official_id: official.official_id, department: official.department, role: "official" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// New endpoint to fetch all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = [
      "Road Maintenance",
      "Water Supply",
      "Sanitation",
      "Sewage",
      "Parks and Recreation",
      "Public Transportation",
      "Electrical Department"
    ];
    res.json(departments.map((name, index) => ({ id: index + 1, name })));
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Server error" });
  }
};