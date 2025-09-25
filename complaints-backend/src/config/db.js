// // This is local testing only
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL ");
});

module.exports = pool;

//This is Deployment
// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT || 5432,
//   ssl: {
//     rejectUnauthorized: false, // Allow self-signed AWS certs
//   },
// });

// pool.on("connect", () => {
//   console.log("Connected to AWS RDS PostgreSQL");
// });

// module.exports = pool;
