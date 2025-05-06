const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Get all users
exports.getUsers = async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM users");
  res.json(result.rows);
};

// Get all departments
exports.getDepartments = async (req, res) => {
  const result = await pool.query("SELECT * FROM departments");
  res.json(result.rows);
};

// Create department
exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  await pool.query("INSERT INTO departments (name) VALUES ($1)", [name]);
  res.json({ message: "Department created" });
};

// Register official
exports.registerOfficial = async (req, res) => {
  const { official_id, email, password, department_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO officials (official_id, email, password, department_id) VALUES ($1, $2, $3, $4)",
    [official_id, email, hashedPassword, department_id]
  );
  res.json({ message: "Official registered" });
};
