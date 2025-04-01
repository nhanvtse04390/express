const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Người đặt hàng
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true},
        price: { type: Number, required: true }, 
        quantity: { type: Number },
        image: { type: [String] },
        description: { type: String },
        discount: { type: Number },
        isActive: { type: Boolean, default: true },
      },
    ],
    totalAmount: { type: Number, required: true }, // Tổng tiền
    paymentMethod: {
      type: String,
      enum: ["COD", "VNPay", "Momo"],
      required: true,
    }, // Phương thức thanh toán
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    }, // Trạng thái thanh toán
    shippingAddress: { type: String },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    transactionId: { type: String, default: null }, // ID giao dịch từ VNPay/Momo
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    codeRef: { type: String, default: "67eb61f476e957124cb49bb7"},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
