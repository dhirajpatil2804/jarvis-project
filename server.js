const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   FINAL DATABASE FIX (POOL + ENV)
========================= */

// Use Railway internal variables
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10
});

// Test connection
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
    conn.release();
  }
});

/* =========================
   ROOT ROUTE
========================= */
app.get('/', (req, res) => {
  res.send('🚀 Jarvis server is running successfully!');
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
