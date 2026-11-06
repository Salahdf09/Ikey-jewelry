import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { submitOrder, fetchDeliveryFees } from '../services/orders.service';
import { estimateDeliveryFee } from '../utils/deliveryFee';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();

  const [wilaya, setWilaya] = useState('');
  const [deliveryType, setDeliveryType] = useState('domicile');
  const [deliverySpeed, setDeliverySpeed] = useState('express');
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    document.title = 'Commande — ikey.';
    fetchDeliveryFees().then(setDeliveryFees).catch(() => {});
  }, []);

  if (items.length === 0) {
    return <Navigate to="/panier" replace />;
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = estimateDeliveryFee(deliveryFees, wilaya, deliveryType, deliverySpeed);

  async function handleSubmit(values) {
    setSubmitting(true);
    setServerErrors({});
    try {
      const order = await submitOrder({
        ...values,
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
      });
      // Navigate away first — clearing the cart is left to the success page,
      // so Checkout is already unmounted by the time items becomes empty
      // and never races its own empty-cart redirect against this navigation.
      navigate(`/order-success/${order.orderNumber}`, { replace: true });
    } catch (err) {
      const response = err.response?.data;
      if (response?.details) {
        const fieldErrors = {};
        response.details.forEach((d) => {
          fieldErrors[d.field] = d.message;
        });
        setServerErrors(fieldErrors);
      }
      toast.error(response?.message || 'Impossible d\'envoyer la commande. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl mb-8">finaliser ta commande</h1>

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 items-start">
        <CheckoutForm
          onSubmit={handleSubmit}
          submitting={submitting}
          serverErrors={serverErrors}
          deliveryFees={deliveryFees}
          onValuesChange={(v) => {
            setWilaya(v.wilaya);
            setDeliveryType(v.deliveryType);
            setDeliverySpeed(v.deliverySpeed);
          }}
        />
        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          deliveryType={deliveryType}
          deliverySpeed={deliverySpeed}
        />
      </div>
    </div>
  );
}
