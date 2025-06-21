import React, { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const location = useLocation();
  const { amount } = location.state || {};
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!amount) return;
    fetch("https://backend-00.netlify.app/payment/create-payment-intent", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100, currency: 'mxn' })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm />
    </Elements>
  ) : (
    <div>Cargando formulario de pago...</div>
  );
};

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required"
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} style={{ width: '100%', padding: 12, fontSize: 16, marginTop: 16 }}>
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 16 }}>¡Pago realizado con éxito!</div>}
    </form>
  );
};


export default function PaymentPage() {
  return (
    <div className="App">
      <CheckoutForm />
    </div>
  );
}
