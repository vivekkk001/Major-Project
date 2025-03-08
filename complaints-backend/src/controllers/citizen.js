const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if email already exists
    const existingUser = await pool.query("SELECT * FROM citizens WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    await pool.query(
      "INSERT INTO citizens (name, email, phone, password, created_at) VALUES ($1, $2, $3, $4, NOW())",
      [name, email, phone, hashedPassword]
    );

    res.status(201).json({ message: "Citizen registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM citizens WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { user_id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: "citizen" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
