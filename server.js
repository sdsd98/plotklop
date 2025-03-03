require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
app.use(cors({ origin: "http://localhost:5500", credentials: true })); // Adjust frontend URL

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error saving user data:", err);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Login Endpoint (Sends JWT token in HTTP-only Cookie)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  try {
    const user = await User.findOne({ username, password: hashedPassword });
    if (user) {
      const token = generateToken(user);
      res
        .cookie("token", token, {
          httpOnly: true, // Prevents client-side access to the cookie
          secure: false, // Set to `true` in production with HTTPS
          maxAge: 3600000, // 1 hour
        })
        .json({ success: true, message: "Login successful!" });
    } else {
      res.status(401).json({ error: "Invalid username or password!" });
    }
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Failed to load user data." });
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
app.post("/logout", (req, res) => {
    res.clearCookie("token").json({ success: true, message: "Logged out successfully!" });
});
app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});
