const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://Admin:popelnice@userdata.djtsf.mongodb.net/UserAuthDB?retryWrites=true&w=majority&appName=userData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static(__dirname));

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
        res.status(500).json({ error: "Failed to load user data." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
