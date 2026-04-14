const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   FINAL DATABASE FIX (HARDCODED)
========================= */

// 🔥 YOUR ACTUAL INTERNAL DB URL (from Railway)
const db = mysql.createConnection({
  host: "mysql.railway.internal",
  user: "root",
  password: "suIGnCa0wI1vnhKWrHEirgusRPNGTVhR",
  database: "railway",
  port: 3306
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
