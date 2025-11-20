const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const { sendPasswordResetEmail } = require("../utils/sendEmail");

// ======================================================
// VALIDATION HELPERS
// ======================================================
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Must contain lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Must contain a special character");
  return { isValid: errors.length === 0, errors };
};

const validatePhone = (phone) => /^\+91\d{10}$/.test(phone);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ======================================================
// SIGNUP
// ======================================================
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, address, rememberMe } = req.body;

    if (!name || !email || !phone || !password || !address)
      return res.status(400).json({ message: "All fields are required" });

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (!validatePhone(phone))
      return res.status(400).json({ message: "Phone must be +91XXXXXXXXXX" });

    const passCheck = validatePassword(password);
    if (!passCheck.isValid)
      return res.status(400).json({ message: "Weak password", errors: passCheck.errors });

    const exists = await pool.query("SELECT email FROM citizens WHERE email=$1", [email]);
    if (exists.rows.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPw = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO citizens (name, email, phone, password, address, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [name.trim(), email, phone, hashedPw, address.trim()]
    );

    res.json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================================
// LOGIN
// ======================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await pool.query("SELECT * FROM citizens WHERE email=$1", [email]);
    if (data.rows.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = data.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Login success", user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================================
// LOGOUT
// ======================================================
exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// ======================================================
// FORGOT PASSWORD
// ======================================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query("SELECT email FROM citizens WHERE email=$1", [email]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "Email not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await pool.query(
      "UPDATE citizens SET reset_token=$1, reset_token_expiry=NOW() + INTERVAL '10 minutes' WHERE email=$2",
      [hashed, email]
    );

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(email, link);

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await pool.query(
      "SELECT email FROM citizens WHERE reset_token=$1 AND reset_token_expiry > NOW()",
      [hashed]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ message: "Invalid or expired link" });

    const check = validatePassword(password);
    if (!check.isValid)
      return res.status(400).json({ message: "Weak password", errors: check.errors });

    const hashedPw = await bcrypt.hash(password, 12);

    await pool.query(
      "UPDATE citizens SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=$2",
      [hashedPw, hashed]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================================
// GET PROFILE
// ======================================================
exports.getProfile = async (req, res) => {
  try {
    const email = req.user.email;

    const data = await pool.query(
      "SELECT name, email, phone, address, created_at FROM citizens WHERE email=$1",
      [email]
    );

    res.json(data.rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup: exports.signup,
  login: exports.login,
  logout: exports.logout,
  forgotPassword: exports.forgotPassword,
  resetPassword: exports.resetPassword,
  getProfile: exports.getProfile
};
