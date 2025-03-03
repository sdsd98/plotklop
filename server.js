require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Secure password hashing
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5500",
    credentials: true,
  })
);

// Serve static files from the same folder as server.js
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Registration Endpoint (With Secure Password Hashing)
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error saving user data:", err);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Login Endpoint (Using Secure Password Hashing)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      res
        .cookie("token", token, {
          httpOnly: true, // Prevents client-side access to the cookie
          secure: process.env.NODE_ENV === "production", // Secure only in production
          sameSite: "Strict",
          maxAge: 3600000, // 1 hour
        })
        .json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ error: "Invalid username or password!" });
    }
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Failed to authenticate." });
  }
});

// Middleware to check authentication
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ loggedIn: false, message: "Unauthorized" });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ loggedIn: false, message: "Forbidden" });
    req.user = user; // Attach user data to the request
    next();
  });
};

// Check Login Status (Protected Route)
app.get("/isLoggedIn", verifyToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

// Logout Endpoint (Clears Cookie)
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully!" });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
