const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   DATABASE CONNECTION (FINAL GUARANTEED FIX)
========================= */

// 🔥 Hardcoded Railway INTERNAL DB URL (from your screenshot)
const dbUrl = "mysql://root:suIGnCa0wI1vnhKWrHEirgusRPNGTVhR@mysql.railway.internal:3306/railway";

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
   REGISTER API
========================= */
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: 'Insert error' });

        res.status(200).json({ message: 'Registration successful' });
      }
    );
  });
});

/* =========================
   LOGIN API
========================= */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful' });
  });
});

/* =========================
   COMMAND API
========================= */
app.post('/command', (req, res) => {
  const { userId, command } = req.body;

  db.query(
    'INSERT INTO commands (user_id, command) VALUES (?, ?)',
    [userId, command],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB insert error' });

      let reply = '';

      if (command.includes('hello')) {
        reply = 'Hello, how can I assist you?';
      } else if (command.includes('time')) {
        const now = new Date();
        reply = `Current time is ${now.getHours()}:${now.getMinutes()}`;
      } else {
        reply = "I didn't understand that.";
      }

      res.json({ reply });
    }
  );
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
