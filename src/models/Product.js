const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  image: { type: [String] },
  description: { type: String },
  discount: { type: Number },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);