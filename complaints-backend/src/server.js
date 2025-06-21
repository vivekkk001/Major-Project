const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const pool = require("./config/db");
require("dotenv").config();

const app = express();

// FIRST: Setup CORS before anything else
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ROUTES
app.use("/api/citizen", require("./routes/citizen"));
app.use("/api/official", require("./routes/official"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/admin", require("./routes/admin"));

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  Test DB + Start server
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(" DB connection error:", err);
    process.exit(1);
  } else {
    console.log("DB connected:", res.rows[0].now);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  }
});
