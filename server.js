// server.js - Express server with MongoDB Atlas connection
require('dotenv').config(); // Load environment variables from a .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files like HTML, CSS, JS

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error('❌ Error saving user data:', err);  // Log detailed error
        res.status(500).json({ error: "Failed to save user data." });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
        const user = await User.findOne({ username, password: hashedPassword });
        if (user) {
            res.status(200).json({ message: "Login successful!" });
        } else {
            res.status(401).json({ error: "Invalid username or password!" });
        }
    } catch (err) {
        console.error('❌ Error during login:', err);  // Log detailed error
        res.status(500).json({ error: "Failed to load user data." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
