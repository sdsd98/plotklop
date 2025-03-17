// server.js

// ✅ Required dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// ✅ MongoDB Atlas connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String }, // ✅ Přidáno resetToken pro obnovu hesla
  resetTokenExpiration: { type: Date }, // ✅ Přidána expirace tokenu
});
const User = mongoose.model("User", userSchema);

// ✅ Email transport setup (nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// ✅ CORS configuration
const allowedOrigins = ["http://localhost:5500", "https://opravdova-webovka.onrender.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin."), false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required!" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed!" });
  }
});

// ✅ Route for password reset request (forgot password)
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    console.error("❌ Debug: Chybí token nebo heslo", { token, newPassword });
    return res.status(400).json({ error: "Invalid request!" });
  }

  try {
    console.log("🔍 Debug: Hledám uživatele s tokenem:", token);
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      console.error("❌ Debug: Token je neplatný nebo expiroval");
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    console.log("✅ Debug: Token nalezen, resetuji heslo...");
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: "✅ Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password!" });
  }
});


    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link has been sent to your email!" });
  } catch (err) {
    console.error("❌ Error in forgot password:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// ✅ Route to handle password reset
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Invalid request!" });
  }

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: "✅ Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password!" });
  }
});

// ✅ User registration route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error during registration:", err);
    res.status(500).json({ error: "Registration failed!" });
  }
});

// ✅ Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
