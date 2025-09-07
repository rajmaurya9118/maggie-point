const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  totalAmount: Number,
  status: { type: String, default: "Pending" }, // Pending, Cooking, On the Way, Delivered, Cancelled
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
