const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Password validation function
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Phone validation function
const validatePhone = (phone) => {
  // Check if phone starts with +91 and has exactly 10 digits after
  const phoneRegex = /^\+91\d{10}$/;
  const digitsAfter91 = phone.replace(/^\+91/, '');
  return phoneRegex.test(phone) && digitsAfter91.length === 10 && /^\d{10}$/.test(digitsAfter91);
};

// Email validation function
const validateEmail = (email) => {
  // More comprehensive email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && 
         email.length >= 5 && 
         email.length <= 254 && 
         !email.startsWith('.') && 
         !email.endsWith('.') &&
         !email.includes('..') &&
         email.split('@').length === 2;
};

exports.signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body); // Debug log
    
    const { name, email, phone, password, address, rememberMe } = req.body;

    // Input validation
    if (!name || !email || !phone || !password || !address) {
      console.log("Missing required fields"); // Debug log
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log("Invalid email format:", email); // Debug log
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number
    if (!validatePhone(phone)) {
      console.log("Invalid phone format:", phone); // Debug log
      return res.status(400).json({ 
        message: "Phone number must be in format +91XXXXXXXXXX with exactly 10 digits after +91" 
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log("Password validation failed:", passwordValidation.errors); // Debug log
      return res.status(400).json({ 
        message: "Password requirements not met", 
        errors: passwordValidation.errors 
      });
    }

    console.log("All validations passed, checking for existing users..."); // Debug log

    // Check if email already exists (case-insensitive)
    const existingUser = await pool.query("SELECT * FROM citizens WHERE LOWER(email) = LOWER($1)", [email]);
    if (existingUser.rows.length > 0) {
      console.log("Email already exists:", email); // Debug log
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists (only check non-null phones)
    const existingPhone = await pool.query("SELECT * FROM citizens WHERE phone = $1 AND phone IS NOT NULL", [phone]);
    if (existingPhone.rows.length > 0) {
      console.log("Phone already exists:", phone); // Debug log
      return res.status(400).json({ message: "Phone number already exists" });
    }

    console.log("No existing users found, proceeding with registration..."); // Debug log

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully"); // Debug log

    // Insert user into DB - match your actual table structure
    // Since you don't have an 'id' column, we'll use a different approach
    const result = await pool.query(
      "INSERT INTO citizens (name, email, phone, password, address, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING name, email",
      [name.trim(), email.toLowerCase(), phone, hashedPassword, address.trim()]
    );

    console.log("User inserted successfully:", result.rows[0]); // Debug log

    const newUser = result.rows[0];

    // If rememberMe is true, create a longer-lasting token
    const tokenExpiry = rememberMe ? "30d" : "1d";

    // Generate JWT Token without user_id since there's no id column
    const token = jwt.sign(
      { 
        name: newUser.name, 
        email: newUser.email, 
        role: "citizen" 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    console.log("JWT token generated successfully"); // Debug log

    // Set JWT in httpOnly Cookie with appropriate expiration
    const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: cookieExpiry
    });

    console.log("Registration completed successfully for:", email); // Debug log

    res.status(201).json({ 
      message: "Citizen registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    
    // Handle specific PostgreSQL errors
    if (error.code === '23505') { // Unique constraint violation
      if (error.detail && error.detail.includes('email')) {
        return res.status(400).json({ message: "Email already exists" });
      } else if (error.detail && error.detail.includes('phone')) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      return res.status(400).json({ message: "This email or phone number is already registered" });
    }
    
    if (error.code === '23514') { // Check constraint violation
      return res.status(400).json({ message: "Invalid data format provided" });
    }

    if (error.code === '42P01') { // Table doesn't exist
      return res.status(500).json({ message: "Database table not found" });
    }

    res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const user = await pool.query("SELECT * FROM citizens WHERE LOWER(email) = LOWER($1)", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If rememberMe is true, create a longer-lasting token
    const tokenExpiry = rememberMe ? "30d" : "1d";

    // Generate JWT Token without user_id since there's no id column
    const token = jwt.sign(
      { 
        name: user.rows[0].name, 
        email: user.rows[0].email, 
        role: "citizen" 
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Set JWT in httpOnly Cookie with appropriate expiration
    const cookieExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day in milliseconds
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: cookieExpiry
    });

    res.status(200).json({ 
      message: "Login successful", 
      user: {
        name: user.rows[0].name,
        email: user.rows[0].email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Optional: Logout function to clear cookie
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    });
    
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};