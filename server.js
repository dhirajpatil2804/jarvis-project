const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ✅ DB Connection (ONLY ONCE)
const db = mysql.createConnection({
    host: "monorail.proxy.rlwy.net",
    user: "root",
    password: "suIGnCa0wI1vnhKWrHEirgusRPNGTVhR",
    database: "railway",
    port: 18123
});

db.connect((err) => {
    if (err) {
        console.error('DB error:', err);
    } else {
        console.log('Connected to DB ✅');
    }
});

// ✅ ROOT ROUTE (VERY IMPORTANT)
app.get('/', (req, res) => {
    res.send('Jarvis server is running 🚀');
});

// Register
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
                if (err) return res.status(500).json({ message: 'Database error' });

                res.status(200).json({ message: 'Registration successful' });
            }
        );
    });
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

// Command
app.post('/command', (req, res) => {
    const { userId, command } = req.body;

    db.query(
        'INSERT INTO commands (user_id, command) VALUES (?, ?)',
        [userId, command],
        (err) => {
            if (err) return res.status(500).json({ message: 'Error saving command' });

            let reply = '';

            if (command.includes('hello')) {
                reply = 'Hello, how can I assist you today?';
            } else if (command.includes('time')) {
                const date = new Date();
                reply = `The current time is ${date.getHours()}:${date.getMinutes()}`;
            } else {
                reply = "I didn't understand that command.";
            }

            res.json({ reply });
        }
    );
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
