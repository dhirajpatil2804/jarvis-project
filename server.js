const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   ENV DEBUG
========================= */

console.log("ENV CHECK:", {
  host: process.env.MYSQLHOST || "❌",
  user: process.env.MYSQLUSER || "❌",
  password: process.env.MYSQLPASSWORD ? "✔️" : "❌",
  database: process.env.MYSQLDATABASE || "❌",
  port: process.env.MYSQLPORT || "❌",
  appPort: process.env.PORT || "❌"
});

/* =========================
   DATABASE CONNECTION
========================= */

let pool;

try {
  pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
  });

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("❌ DB Connection Error:", err.message);
    } else {
      console.log("✅ Connected to Railway MySQL");
      conn.release();
    }
  });

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
   START SERVER (IMPORTANT FIX)
========================= */

const PORT = process.env.PORT; // 🔥 VERY IMPORTANT

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
