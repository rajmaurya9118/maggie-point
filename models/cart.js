const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);
