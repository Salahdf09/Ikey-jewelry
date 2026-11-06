import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Phone, Truck } from 'lucide-react';
import { fetchOrderByNumber } from '../services/orders.service';
import { formatDA } from '../utils/currency';
import { useCartStore } from '../store/cartStore';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const clearCart = useCartStore((s) => s.clearCart);

  // Reaching this page at all means the order was already placed
  // server-side, so the cart is cleared here regardless of how the
  // order-detail fetch below turns out.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return <div className="max-w-xl mx-auto px-4 py-24 text-center text-wine/50">chargement...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-wine/60 mb-4">commande introuvable.</p>
        <Link to="/" className="btn-outline">retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mx-auto mb-6 animate-pop">
        <Heart size={34} strokeWidth={1.5} className="text-rose fill-rose" />
      </div>

      <h1 className="text-3xl sm:text-4xl mb-3 animate-fade-up">
        Merci pour ta commande, {order.customerName.split(' ')[0]} !
      </h1>
      <p className="text-wine/70 mb-1 animate-fade-up" style={{ animationDelay: '80ms' }}>
        Nous te contactons pour confirmer les détails de livraison.
      </p>

      <div
        className="inline-block badge bg-plum text-cream mt-5 mb-8 px-5 py-2 text-sm animate-fade-up"
        style={{ animationDelay: '150ms' }}
      >
        {order.orderNumber}
      </div>

      <div className="card p-6 text-left space-y-4 animate-fade-up" style={{ animationDelay: '220ms' }}>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-wine/80">
                {item.quantity} × {item.productName}
                {item.variantName && <span className="text-wine/50"> — {item.variantName}</span>}
              </span>
              <span className="font-medium text-plum">{formatDA(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-petal-light pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-wine/70">sous-total</span><span>{formatDA(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-wine/70">livraison</span><span>{formatDA(order.deliveryFee)}</span></div>
          <div className="flex justify-between text-base pt-1.5 border-t border-petal-light">
            <span className="font-semibold text-plum">total</span>
            <span className="font-bold text-rose">{formatDA(order.total)}</span>
          </div>
        </div>
        <div className="bg-blush text-plum text-center text-sm font-semibold py-2.5 rounded-pill">
          paiement : à la livraison
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 text-sm text-wine/70">
        <div className="flex items-center gap-2 justify-center"><Phone size={15} strokeWidth={1.75} className="text-rose-deep" /> {order.phone}</div>
        <div className="flex items-center gap-2 justify-center"><Truck size={15} strokeWidth={1.75} className="text-rose-deep" /> {order.wilaya}, {order.commune}</div>
      </div>

      <Link to="/produits" className="btn-outline mt-10 inline-block">continuer mes achats</Link>
    </div>
  );
}
