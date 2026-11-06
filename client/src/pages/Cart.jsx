import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatDA } from '../utils/currency';
import CartItem from '../components/cart/CartItem';

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={26} strokeWidth={1.5} className="text-petal" />
        </div>
        <h1 className="text-2xl mb-3">ton panier est vide</h1>
        <p className="text-wine/60 mb-6 text-sm">découvre nos bijoux faits main et commence ta commande.</p>
        <Link to="/produits" className="btn-primary">découvrir la collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl mb-8">ton panier</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card p-5 sm:p-6">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.variantId || 'd'}`} item={item} />
          ))}
        </div>

        <div className="card p-5 sm:p-6 h-fit space-y-4">
          <h2 className="font-display text-lg text-plum">résumé</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-wine/70">sous-total</span>
            <span className="font-semibold text-plum">{formatDA(subtotal)}</span>
          </div>
          <p className="text-xs text-wine/50">frais de livraison calculés à l'étape suivante</p>
          <Link to="/commande" className="btn-primary w-full">passer la commande</Link>
          <Link to="/produits" className="btn-ghost w-full">continuer mes achats</Link>
        </div>
      </div>
    </div>
  );
}
