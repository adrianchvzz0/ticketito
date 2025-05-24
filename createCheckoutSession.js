const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint para crear una sesión de Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
  // Adaptar para soportar ambos formatos
  const eventId = req.body.eventId;
  const amount = req.body.amount || req.body.total;
  const eventName = req.body.eventName || (req.body.eventDetails && req.body.eventDetails.title);
  console.log('POST /create-checkout-session', { eventId, amount, eventName });

  // Validaciones básicas
  if (!amount || isNaN(amount) || amount <= 0) {
    console.error('Monto inválido:', amount);
    return res.status(400).json({ error: 'El monto es inválido o no fue enviado.' });
  }
  if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
    console.error('Nombre de evento inválido:', eventName);
    return res.status(400).json({ error: 'El nombre del evento es inválido o no fue enviado.' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: eventName || 'Evento',
              metadata: { eventId: eventId || '' }
            },
            unit_amount: amount * 100, // Stripe: centavos
          },
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    res.status(200).json({ clientSecret: session.id, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para consultar el estado de la sesión
router.get('/session-status', async (req, res) => {
  const { session_id } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.status(200).json({ status: session.status, customer_email: session.customer_details?.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
