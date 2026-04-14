const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   SAFE DATABASE SETUP
========================= */

let pool = null;

try {
  if (
    process.env.MYSQLHOST &&
    process.env.MYSQLUSER &&
    process.env.MYSQLPASSWORD
  ) {
    console.log("ENV OK ✅");

    pool = mysql.createPool({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
    });

    pool.getConnection((err, conn) => {
      if (err) {
        console.error("❌ DB Error:", err.message);
      } else {
        console.log("✅ Connected to DB");
        conn.release();
      }
    });
  } else {
    console.log("⚠️ ENV VARIABLES MISSING");
  }
} catch (err) {
  console.error("❌ DB INIT ERROR:", err.message);
}

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
