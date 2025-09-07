const express = require("express");
const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Auth middleware
function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decoded.userid;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Add to cart
router.post("/cart/add", checkAuth, async (req, res) => {
  try {
    const { name, price, quantity, total } = req.body;

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find(i => i.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total += total;
    } else {
      cart.items.push({ name, price, quantity, total });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Update quantity OR remove item
router.patch("/cart/update", checkAuth, async (req, res) => {
  try {
    const { name, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.name === name);
    if (itemIndex === -1) return res.status(404).json({ success: false, error: "Item not found" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); // remove item
    } else {
      const unitPrice = cart.items[itemIndex].price;
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = unitPrice * quantity;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ success: false, error: "Failed to update cart" });
  }
});

module.exports = router;
