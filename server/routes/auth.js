const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db");
const axios = require("axios");
const {
  sendWelcomeEmail,
  sendVerificationEmail,
} = require("../utils/Email.js");
const crypto = require("crypto");

console.log("Auth router initialized");

const verifyToken = (req, res, next) => {
  console.log("Verifying token");
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("No Authorization header found");
    return res.status(401).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
  if (!token) {
    console.log("No token found in Authorization header");
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("Token verified successfully");
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

router.post("/register", async (req, res) => {
  console.log("Received registration request");
  try {
    const { username, email, password, recaptchaToken } = req.body;
    console.log("Registration details:", {
      username,
      email,
      recaptchaToken: "HIDDEN",
    });

    // Verify reCAPTCHA
    console.log("Verifying reCAPTCHA");
    const recaptchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );

    if (!recaptchaVerify.data.success) {
      console.log("reCAPTCHA verification failed");
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    console.log("reCAPTCHA verified successfully");

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    console.log("Verification token generated");

    const [result] = await db.query(
      "INSERT INTO users (username, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, verificationToken, false]
    );
    console.log("User inserted into database");

    // Send verification email
    try {
      await sendVerificationEmail(email, username, verificationToken);
      console.log("Verification email sent");
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Consider how to handle this error (e.g., delete the user, or flag for manual follow-up)
    }

    res
      .status(201)
      .json({
        message:
          "User registered successfully. Please check your email to verify your account.",
      });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  console.log("Received verification request");
  try {
    const { token } = req.params;
    console.log("Verification token:", token);

    const [users] = await db.query(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );
    console.log("Users found:", users.length);

    if (users.length === 0) {
      console.log("Invalid verification token");
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = users[0];
    console.log("User details:", {
      id: user.id,
      email: user.email,
      is_verified: user.is_verified,
    });

    if (user.is_verified) {
      console.log("User already verified");
      return res.status(400).json({ message: "User is already verified" });
    }

    const [updateResult] = await db.query(
      "UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?",
      [user.id]
    );
    console.log("Update result:", updateResult);

    if (updateResult.affectedRows > 0) {
      console.log("User verified successfully");
      res.json({
        message: "Account verified successfully. You can now log in.",
      });
    } else {
      console.log("Failed to update user verification status");
      res
        .status(500)
        .json({ message: "Failed to verify account. Please try again." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

router.get("/check-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const [users] = await db.query(
      "SELECT id, email, is_verified, verification_token FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  console.log("Received login request");
  try {
    const { email, password, recaptchaToken } = req.body;
    console.log("Login details:", { email, recaptchaToken: "HIDDEN" });

    // Verify reCAPTCHA
    console.log("Verifying reCAPTCHA");
    const recaptchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    );

    if (!recaptchaVerify.data.success) {
      console.log("reCAPTCHA verification failed");
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    console.log("reCAPTCHA verified successfully");

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log(
      "User query result:",
      users.length > 0 ? "User found" : "User not found"
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    if (!user.is_verified) {
      console.log("User not verified");
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("JWT token generated");

    try {
      console.log("Sending welcome email");
      await sendWelcomeEmail(user.email, user.username);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't block login if email fails to send
      console.log("Continuing with login despite email error");
    }

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", verifyToken, async (req, res) => {
  console.log("Received request to get all users");
  try {
    const [users] = await db.query("SELECT id, username, email FROM users");
    console.log(`Retrieved ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", verifyToken, async (req, res) => {
  console.log("Received request to delete user");
  try {
    const userId = req.params.id;
    console.log("User ID to delete:", userId);

    // Check if the user exists
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

    if (user.length === 0) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found, proceeding with deletion");

    // Delete the user
    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    console.log("User deleted successfully");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

console.log("Auth router exported");
