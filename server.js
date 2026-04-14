// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors());

// MySQL Database connection
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// API Endpoint for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'Registration successful' });
        });
    });
});

// API Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result[0];

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

// API Endpoint for handling JARVIS commands (search/queries)
app.post('/command', (req, res) => {
    const { userId, command } = req.body;

    // Log the command to the database
    db.query('INSERT INTO commands (user_id, command) VALUES (?, ?)', [userId, command], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving command to database' });
        }

        // Respond to the user
        let reply = '';
        if (command.includes('hello')) {
            reply = 'Hello, how can I assist you today?';
        } else if (command.includes('time')) {
            const date = new Date();
            reply = `The current time is ${date.getHours()}:${date.getMinutes()}`;
        } else {
            reply = "I'm sorry, I didn't understand that command.";
        }

        res.json({ reply });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
