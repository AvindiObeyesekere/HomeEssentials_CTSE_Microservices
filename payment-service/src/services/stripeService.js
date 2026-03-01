const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

const createPaymentIntent = async ({
  amount,
  currency = "usd",
  metadata = {},
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    payment_method_types: ["card"],
  });
  return paymentIntent;
};

const retrievePaymentIntent = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id);
  return paymentIntent;
};

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
};
