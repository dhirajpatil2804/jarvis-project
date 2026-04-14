const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   DEBUG ENV VARIABLES
========================= */

console.log("ENV CHECK:", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD ? "✔️" : "❌",
  db: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});

/* =========================
   DATABASE CONNECTION (FORCE TRY)
========================= */

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 3306,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ DB Error:", err.message);
  } else {
    console.log("✅ Connected to DB");
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
