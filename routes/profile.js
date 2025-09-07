const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

// Require login
function requireAuth(req, res, next) {
  if (!req.user) return res.redirect("/login");
  next();
}

// Profile page
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("orders");
    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }
});

// Check if user has at least one address
router.get("/user/has-address", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    const hasAddress = Array.isArray(user.addresses) && user.addresses.length > 0;
    res.json({ hasAddress });
  } catch (err) {
    console.error("Address check error:", err);
    res.status(500).json({ hasAddress: false });
  }
});

// Update email
router.post("/update-email", requireAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { email: req.body.email });
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update email");
  }
});

// Update password
router.post("/update-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send("Current password is wrong");
    if (newPassword !== confirmPassword) return res.status(400).send("Passwords do not match");

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Password update failed");
  }
});

// Add address
router.post("/add-address", requireAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $push: { addresses: req.body.address } });
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add address");
  }
});

module.exports = router;
