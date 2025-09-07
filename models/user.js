const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, default: "" },
  addresses: [{ type: String }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
});

module.exports = mongoose.model("User", userSchema);
