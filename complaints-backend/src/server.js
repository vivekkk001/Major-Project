// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const pool = require("./config/db");
// const session = require('express-session');
// require("dotenv").config();

// const app = express();

// // --- Setup CORS ---
// const allowedOrigins = [
//   process.env.LOCAL_DEV_URL,
//   process.env.FRONTEND_URL,
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow no origin (like curl or Postman)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error("Blocked by CORS:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { 
//     secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
//     httpOnly: true,
//     maxAge: 10 * 60 * 1000 // 10 minutes
//   }
// }));

// // --- Middlewares ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(bodyParser.json());

// // --- Routes ---
// app.use("/api/citizen", require("./routes/citizen"));
// app.use("/api/official", require("./routes/official"));
// app.use("/api/complaints", require("./routes/complaints"));
// app.use("/api/admin", require("./routes/admin"));

// // --- 404 Fallback ---
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // --- Start Server Only After DB Connect ---
// pool.query("SELECT NOW()", (err, dbRes) => {
//   if (err) {
//     console.error("DB connection error:", err);
//     process.exit(1);
//   } else {
//     console.log("DB connected:", dbRes.rows[0].now);
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () =>
//       console.log(`Server running at http://localhost:${PORT}`)
//     );
//   }
// });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const pool = require("./config/db");
const session = require("express-session");
require("dotenv").config();

const app = express();

// ===========================
//        CORS CONFIG
// ===========================

const allowedOrigins = [
  "https://smartcivic.tech",
  "https://www.smartcivic.tech",
  process.env.FRONTEND_URL,       // ex: http://localhost:5173
  process.env.LOCAL_DEV_URL,      // ex: http://localhost:3000
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps / server-side)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ===========================
//        SESSION CONFIG
// ===========================

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // secure only on HTTPS
      httpOnly: true,
      sameSite: "none", // IMPORTANT for cross-site cookies
      maxAge: 10 * 60 * 1000, // 10 minutes
    },
  })
);

// ===========================
//        MIDDLEWARES
// ===========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// ===========================
//        ROUTES
// ===========================

app.use("/api/citizen", require("./routes/citizen"));
app.use("/api/official", require("./routes/official"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/admin", require("./routes/admin"));

// ===========================
//        404 FALLBACK
// ===========================

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===========================
//   DB CONNECT → START SERVER
// ===========================

pool.query("SELECT NOW()", (err, dbRes) => {
  if (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  } else {
    console.log("DB connected:", dbRes.rows[0].now);
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  }
});
