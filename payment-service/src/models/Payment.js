const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String },
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  stripePaymentIntentId: { type: String },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
