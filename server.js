
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail, Outlook)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password (Use App Passwords for security)
    }
});
const crypto = require("crypto"); // For generating reset tokens

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required!" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Generate a secure random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store the token in the database (you need to modify your User schema)
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send password reset email
        const resetLink = `https://opravdova-webovka.onrender.com/reset-password.html?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link is valid for 1 hour.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset link has been sent to your email!" });

    } catch (err) {
        console.error("❌ Error in forgot password:", err);
        res.status(500).json({ error: "Failed to process request." });
    }
});
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
      return res.status(400).json({ error: "All fields are required!" });
  }

  try {
      // Find the user with the matching token
      const user = await User.findOne({
          resetToken: token,
          resetTokenExpiration: { $gt: Date.now() } // Ensure token is still valid
      });

      if (!user) {
          return res.status(400).json({ error: "Invalid or expired token!" });
      }

      // Hash the new password and save it
      user.password = crypto.createHash("sha256").update(newPassword).digest("hex");
      user.resetToken = undefined; // Clear reset token
      user.resetTokenExpiration = undefined;
      await user.save();

      res.json({ message: "Password has been reset successfully!" });

  } catch (err) {
      console.error("❌ Error resetting password:", err);
      res.status(500).json({ error: "Failed to reset password." });
  }
});



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const crypto = require("crypto"); // ✅ Built-in module for SHA-256 hashing
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

const allowedOrigins = [
  "http://localhost:5500", // ✅ Local development
  "https://opravdova-webovka.onrender.com", // ✅ Your Render frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔍 Request Origin:", origin); // ✅ Log the origin for debugging

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // ✅ Allow the request
      } else {
        console.warn("⛔ CORS Blocked:", origin); // ✅ Log blocked requests
        callback(new Error("CORS policy does not allow this origin."), false);
      }
    },
    credentials: true, // ✅ Allow cookies (needed for JWT authentication)
    optionsSuccessStatus: 200, // ✅ Prevents CORS preflight errors in some browsers
  })
);


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the same folder as server.js
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔒 Secure SHA-256 Hashing Function
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// 🔑 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// 🔹 User Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashedPassword = hashPassword(password); // 🔒 SHA-256 Hashing
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error saving user data:", err);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// 🔹 User Login Endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = hashPassword(password); // 🔒 Hash before checking

  try {
    const user = await User.findOne({ username, password: hashedPassword });
    if (user) {
      const token = generateToken(user);
      res
        .cookie("token", token, {
          httpOnly: true, // Prevents client-side access
          secure: process.env.NODE_ENV === "production", // Use HTTPS in production
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

// 🔹 Middleware to Check JWT Authentication
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

// 🔹 Check Login Status (Protected Route)
app.get("/isLoggedIn", verifyToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});


// 🔹 Logout Endpoint (Clears Cookie)
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully!" });
});


// 🚀 Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
