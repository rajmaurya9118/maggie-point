// routes/order.js
const express = require("express");
const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");

module.exports = (io) => {
  const router = express.Router();

  // Middleware: check if logged in
  function checkAuth(req, res, next) {
    if (!req.user) {
      // If it's an AJAX/XHR or client expects JSON, return JSON 401 instead of redirecting HTML
      const acceptsJson = req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"));
      if (acceptsJson) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.redirect("/login");
    }
    next();
  }

  // GET /order -> current + previous orders
  router.get("/order", checkAuth, async (req, res) => {
    try {
      const userId = req.user._id;

      const [cart, orders, user] = await Promise.all([
        Cart.findOne({ user: userId }).lean(),
        Order.find({ user: userId }).sort({ createdAt: -1 }).lean(),
        User.findById(userId).lean()
      ]);

      const currentOrders = cart?.items.map(it => {
        const quantity = Number(it.quantity) || 1;
        const price = Number(it.price) || 0;
        return {
          name: it.name,
          quantity,
          unitPrice: price,
          total: price * quantity
        };
      }) || [];

      const previousOrders = (orders || []).map(o => ({
        id: o._id.toString(), // ensure string id
        date: o.createdAt ? o.createdAt.toLocaleString() : "-",
        items: (o.items || []).map(i => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          total: i.total
        })),
        total: o.totalAmount,
        status: o.status
      }));

      res.render("order", {
        currentOrders,
        previousOrders,
        hasAddress: Boolean(user?.addresses && user.addresses.length > 0)
      });
    } catch (err) {
      console.error("GET /order error:", err);
      res.redirect("/profile");
    }
  });

  // POST /order -> place order and clear cart
  router.post("/order", checkAuth, async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user.addresses || user.addresses.length === 0) {
        return res.status(400).json({ message: "Please add an address before placing an order" });
      }

      const bodyItems = Array.isArray(req.body.items) ? req.body.items : [];
      if (!bodyItems.length) return res.status(400).json({ message: "No items to order." });

      const items = bodyItems.map(i => ({
        name: String(i.name || "Unnamed Item"),
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        total: (Number(i.price) || 0) * (Number(i.quantity) || 1)
      }));

      const totalAmount = Number(req.body.totalAmount) || items.reduce((sum, it) => sum + it.total, 0);

      const order = await Order.create({ user: userId, items, totalAmount, status: "Pending" });

      // Clear cart
      await Cart.findOneAndDelete({ user: userId });

      // Notify admin(s)
      io.emit("newOrder", {
        orderId: order._id.toString(),
        customer: req.user.name,
        items,
        totalAmount,
        status: order.status
      });

      res.json({ message: "Order placed successfully", orderId: order._id.toString() });
    } catch (err) {
      console.error("POST /order error:", err);
      res.status(500).json({ message: "Order failed" });
    }
  });

  // PATCH /order/cancel/:id -> cancel a previous order
  router.patch("/order/cancel/:id", checkAuth, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status === "Delivered") return res.status(400).json({ message: "Cannot cancel delivered order" });
      if (order.status === "Cancelled") return res.status(400).json({ message: "Order already cancelled" });

      order.status = "Cancelled";
      await order.save();

      io.emit("orderCancelled", { orderId: order._id.toString(), customer: req.user.name });

      return res.json({ message: "Order cancelled successfully" });
    } catch (err) {
      console.error("PATCH /order/cancel error:", err);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  });

  // PATCH /order/cancel-item/:name -> remove single item from user's cart
  router.patch("/order/cancel-item/:name", checkAuth, async (req, res) => {
    try {
      const userId = req.user._id;
      const itemName = decodeURIComponent(req.params.name);

      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const idx = cart.items.findIndex(i => i.name === itemName);
      if (idx === -1) return res.status(404).json({ message: "Item not found in cart" });

      cart.items.splice(idx, 1);
      await cart.save();

      return res.json({ message: "Item removed from cart", cart });
    } catch (err) {
      console.error("PATCH /order/cancel-item error:", err);
      res.status(500).json({ message: "Failed to remove item" });
    }
  });

  return router;
};
