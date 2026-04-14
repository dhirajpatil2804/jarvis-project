const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   DATABASE CONNECTION (FINAL FIX)
========================= */

const dbUrl = process.env.MYSQL_URL;

if (!dbUrl) {
  console.error("❌ MYSQL_URL not found");
}

const parsed = new URL(dbUrl);

const db = mysql.createConnection({
  host: parsed.hostname,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.replace('/', ''),
  port: parsed.port
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
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
