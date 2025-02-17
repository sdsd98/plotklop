const express = require('express');
process.on('uncaughtException', console.error);

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files (HTML, CSS, JS)

// API endpoint for registration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const userData = `${username}, ${email}, ${hashedPassword}\n`;

    fs.appendFile('user_data.txt', userData, (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save user data." });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// API endpoint for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('user_data.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load user data." });
        }

        const users = data.split('\n').filter(line => line).map(line => {
            const [storedUsername, storedEmail, storedPassword] = line.split(', ');
            return { username: storedUsername, email: storedEmail, password: storedPassword };
        });

        const validUser = users.find(user => user.username === username);
        if (!validUser) {
            return res.status(401).json({ error: "Invalid username or password!" });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword === validUser.password) {
            res.status(200).json({ message: "Login successful!" });
        } else {
            res.status(401).json({ error: "Invalid username or password!" });
        }
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Increase timeout values for Render
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000;   // 2 minutes
