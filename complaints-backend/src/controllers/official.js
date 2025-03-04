const bcrypt = require("bcrypt");
const pool = require("../config/db"); // Import DB connection

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if official exists
    const official = await pool.query("SELECT * FROM officials WHERE email = $1", [email]);
    if (official.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const validPassword = await bcrypt.compare(password, official.rows[0].password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
