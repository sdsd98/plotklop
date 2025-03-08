// Required dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer"); // Place this after express import
const cors = require("cors");
const path = require("path");
const crypto = require("crypto"); // ✅ Only once at the top of the file
const jwt = require("jsonwebtoken");

// Initialize the Express app first
const app = express();

// MongoDB connection URI and JWT secret key
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

// Email transport setup (nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5500", // ✅ Local development
  "https://opravdova-webovka.onrender.com", // ✅ Your Render frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ Allow the request
      } else {
        callback(new Error("CORS policy does not allow this origin."), false);
      }
    },
    credentials: true, // ✅ Allow cookies (needed for JWT authentication)
    optionsSuccessStatus: 200, // ✅ Prevents CORS preflight errors in some browsers
  })
);

// Routes and endpoints
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
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    const resetLink = `https://your-website.com/reset-password.html?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>This link is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link has been sent to your email!" });
  } catch (err) {
    console.error("❌ Error in forgot password:", err);
    res.status(500).json({ error: "Failed to process request." });
  }
});

// Add other routes here...

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
