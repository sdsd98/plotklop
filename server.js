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


// ✅ Forgot Password - Poslání resetovacího emailu
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hodina platnosti
    await user.save();

    const resetLink = `https://opravdova-webovka.onrender.com/reset-password.html?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>This link is valid for 1 hour.</p>`,
    };

    // ✅ Ujistíme se, že je `await` uvnitř `async` funkce
    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link has been sent to your email!" });
  } catch (err) {
    console.error("❌ Error in forgot password:", err);
    res.status(500).json({ error: "Failed to process request." });
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
// ✅ Check if user is logged in
app.get("/isLoggedIn", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
      return res.json({ loggedIn: false });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.json({ loggedIn: true, userId: decoded.userId });
  } catch (err) {
      res.json({ loggedIn: false });
  }
});
// ✅ Logout endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "✅ Successfully logged out!" });
});


// ✅ Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
