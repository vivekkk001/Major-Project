const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const pool = require("./config/db"); // DB connection
require("dotenv").config(); // Load environment variables

const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URL], // Frontend origin
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const citizenRoutes = require("./routes/citizen");
const officialRoutes = require("./routes/official");
const complaintsRoutes = require("./routes/complaints");

app.use("/api/citizen", citizenRoutes);
app.use("/api/official", officialRoutes);
app.use("/api/complaints", complaintsRoutes); 

// Test DB connection and start server
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(" Database connection error:", err);
    process.exit(1); // Exit if DB fails
  } else {
    console.log(" Database connected at:", res.rows[0].now);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on ${process.env.CLIENT_ORIGIN?.replace(/3000$/, PORT) || "http://localhost:" + PORT}`));
  }
});
