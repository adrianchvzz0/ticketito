const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint para crear Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos (amount, currency).' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos: $10.00 MXN = 1000
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
