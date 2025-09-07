const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendOtpEmail } = require("../utils/mailer");
require("dotenv").config();

const router = express.Router();

// In-memory OTP store
const otpStore = {};

// ---------------- LOGIN / SIGNUP ----------------
// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, number, password, password_check ,email} = req.body;
    if (!name || !number || !password || !email)
      return res.status(400).send("All fields required");

    const existingUser = await User.findOne({ number });
    if (existingUser) return res.status(400).send("User Already Exists!");
    if (password !== password_check)
      return res.status(400).send("Passwords do not match!");

    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, number, password: hash ,email});

    const token = jwt.sign({ userid: newUser._id }, process.env.TOKEN_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});

// Login
// Login
router.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;
    if (!number || !password)
      return res.status(400).send("Mobile and password are required");

    // ======= ADMIN CHECK =======
    if (number === process.env.NUMBER && password === process.env.APP_PASSWORD) {
      // Generate a token if you want to protect admin routes (optional)
      const token = jwt.sign({ admin: true }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/admin"); // redirect to admin page
    }

    // ======= NORMAL USER LOGIN =======
    const user = await User.findOne({ number });
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign({ userid: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/"); // redirect normal users to homepage
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});


// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// ---------------- FORGOT PASSWORD ----------------

// Step 0: Show forgot password form
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

// Step 1: Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const emailTrimmed = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailTrimmed });
    if (!user) return res.status(404).send("No account with that email");

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[emailTrimmed] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await sendOtpEmail(emailTrimmed, otp);
    console.log(`OTP for ${emailTrimmed}: ${otp}`); // debug
    res.render("verify-otp", { email: emailTrimmed });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send OTP");
  }
});

// Step 2: Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const emailTrimmed = email.trim().toLowerCase();
  const record = otpStore[emailTrimmed];

  if (!record) return res.status(400).send("No OTP request found");
  if (Date.now() > record.expires) return res.status(400).send("OTP expired");
  if (parseInt(otp) !== record.otp) return res.status(400).send("Invalid OTP");

  res.render("reset-password", { email: emailTrimmed });
});

// Step 3: Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const emailTrimmed = email.trim().toLowerCase();

    if (!newPassword || newPassword.length < 6)
      return res.status(400).send("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return res.status(400).send("Passwords do not match");

    const user = await User.findOne({ email: emailTrimmed });
    if (!user) return res.status(404).send("User not found");

    const hash = await bcrypt.hash(newPassword, 12);
    user.password = hash;
    await user.save(); // ✅ ensures DB is updated
   
    delete otpStore[emailTrimmed]; // remove OTP
    console.log(`Password for ${emailTrimmed} successfully updated.`);

    res.send("✅ Password reset successful. <a href='/login'>Login now</a>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Password reset failed");
  }
});

module.exports = router;
