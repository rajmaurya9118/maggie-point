const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");
const User = require("../models/user");
require("dotenv").config();

module.exports = (io) => {
  const router = express.Router();

  // ======== INLINE ADMIN PROTECTION MIDDLEWARE ========
  function protectAdmin(req, res, next) {
    try {
      const token = req.cookies.token; // read JWT from cookie
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (decoded.admin) return next(); // allow access

      return res.status(403).send("Access denied: Admins only");
    } catch (err) {
      console.error("Admin auth error:", err);
      return res.redirect("/login");
    }
  }

  // ======== ADMIN DASHBOARD ========
  router.get("/", protectAdmin, async (req, res) => {
    res.render("admin");
  });

  // ======== FETCH ALL ORDERS ========
  router.get("/orders", protectAdmin, async (req, res) => {
    const orders = await Order.find().populate("user").sort({ createdAt: -1 }).lean();
    res.json(
      orders.map(o => ({
        id: o._id,
        customer: o.user?.name || "-",
        items: o.items.map(i => `${i.name} × ${i.quantity}`).join(", "),
        time: o.createdAt ? o.createdAt.toLocaleString() : "-",
        payment: o.totalAmount,
        status: o.status
      }))
    );
  });

  // ======== UPDATE ORDER STATUS ========
  router.patch("/orders/:id", protectAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = status;
      await order.save();

      io.emit("orderUpdated", { orderId: order._id.toString(), status });
      res.json({ message: "Order updated" });
    } catch (err) {
      console.error("PATCH /orders/:id error:", err);
      res.status(500).json({ message: "Update failed" });
    }
  });

  // ======== FETCH STATS ========
  router.get("/stats", protectAdmin, async (req, res) => {
    try {
      const orders = await Order.find().lean();
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
      const revenue = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const itemsSold = orders.filter(o => o.status === "Delivered")
                              .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

      res.json({ totalOrders, pendingOrders, revenue, itemsSold });
    } catch (err) {
      console.error("GET /stats error:", err);
      res.status(500).json({ message: "Stats fetch failed" });
    }
  });

  // ======== FETCH CUSTOMERS ========
  router.get("/customers", protectAdmin, async (req, res) => {
    try {
      const users = await User.find().lean();
      res.json(
        users.map(u => ({
          id: u._id,
          name: u.name,
          number: u.number || "-",
          address: u.addresses?.[0] || "-"
        }))
      );
    } catch (err) {
      console.error("GET /customers error:", err);
      res.status(500).json({ message: "Customer fetch failed" });
    }
  });

  return router;
};
