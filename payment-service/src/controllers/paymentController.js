const stripeService = require("../services/stripeService");
const Payment = require("../models/Payment");

// Create a Payment Intent and return client secret
const createPayment = async (req, res, next) => {
  try {
    const { orderId, userId, amount, currency } = req.body;
    if (!orderId || !userId || !amount) {
      return res
        .status(400)
        .json({ error: "orderId, userId and amount are required" });
    }

    // Ensure amount is integer (cents)
    const amountInt = Math.round(amount);

    const metadata = { orderId, userId };
    const pi = await stripeService.createPaymentIntent({
      amount: amountInt,
      currency,
      metadata,
    });

    // Save a pending payment record (optional: keep minimal until confirm)
    const payment = new Payment({
      paymentId: pi.id,
      orderId,
      userId,
      amount: amountInt,
      currency: currency || "usd",
      stripePaymentIntentId: pi.id,
      paymentStatus: "pending",
    });
    await payment.save();

    return res.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (err) {
    next(err);
  }
};

// Verify payment status on Stripe and update MongoDB
const verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId)
      return res.status(400).json({ error: "paymentIntentId is required" });

    const pi = await stripeService.retrievePaymentIntent(paymentIntentId);

    const status = pi.status; // e.g., 'succeeded'

    const existing = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (status === "succeeded") {
      if (existing) {
        existing.paymentStatus = "success";
        await existing.save();
      } else {
        const payment = new Payment({
          paymentId: pi.id,
          orderId: pi.metadata?.orderId || "",
          userId: pi.metadata?.userId || "",
          amount: pi.amount,
          currency: pi.currency,
          stripePaymentIntentId: pi.id,
          paymentStatus: "success",
        });
        await payment.save();
      }

      const redirectUrl =
        process.env.SUCCESS_URL || "http://frontend-service/payment-success";
      return res.redirect(302, redirectUrl);
    } else {
      if (existing) {
        existing.paymentStatus = "failed";
        await existing.save();
      }
      const redirectUrl =
        process.env.CANCEL_URL || "http://frontend-service/payment-failed";
      return res.redirect(302, redirectUrl);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};
