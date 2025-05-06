// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/db");

// exports.login = async (req, res) => {
//   try {
//     const { official_id, password } = req.body;

//     // Check if official exists
//     const official = await pool.query("SELECT * FROM officials WHERE official_id = $1", [official_id]);
//     if (official.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

//     // Compare password
//     const validPassword = await bcrypt.compare(password, official.rows[0].password);
//     if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

//     // Generate JWT Token
//     const token = jwt.sign(
//       { official_id: official.rows[0].official_id, role: "official" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" } // Token expires in 1 day
//     );

//     res.cookie("token", token, { 
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === "production", 
//       sameSite: "Lax"
//     });

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// controllers/official.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.login = async (req, res) => {
  try {
    const { official_id, password } = req.body;

    const official = await pool.query("SELECT * FROM officials WHERE official_id = $1", [official_id]);
    if (official.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, official.rows[0].password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { official_id: official.rows[0].official_id, role: "official" },
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
