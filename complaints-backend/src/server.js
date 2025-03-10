const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const pool = require("./config/db"); // Import DB connection
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Import Routes
const citizenRoutes = require("./routes/citizen");
const officialRoutes = require("./routes/official");
const complaintsRoutes = require("./routes/complaints"); // Assuming complaints route exists

// Use Routes
app.use("/api/citizen", citizenRoutes);
app.use("/api/official", officialRoutes);
app.use("/api/complaints", complaintsRoutes); // Protect this route using JWT

// ✅ Test Database Connection Before Starting Server
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Stop server if DB connection fails
  } else {
    console.log("Database connected successfully at:", res.rows[0].now);

    // Start Server Only After DB Connection is Confirmed
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
