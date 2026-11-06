import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatDA } from '../../utils/currency';
import CartItem from './CartItem';

export default function CartDrawer({ open, onClose }) {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-plum/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-cream shadow-xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-petal-light shrink-0">
              <h2 className="font-display text-lg text-plum">ton panier</h2>
              <button onClick={onClose} className="p-2 text-plum hover:text-rose transition-colors" aria-label="Fermer le panier">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center gap-3 py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center">
                    <ShoppingBag size={26} strokeWidth={1.5} className="text-petal" />
                  </div>
                  <p className="text-wine/70 text-sm">ton panier est vide pour le moment.</p>
                  <button onClick={onClose} className="btn-outline mt-1">
                    continuer mes achats
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId || 'd'}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-petal-light p-5 space-y-4 shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-wine/70">sous-total</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.15, color: '#D4537E' }}
                    animate={{ scale: 1, color: '#4B1528' }}
                    className="font-semibold"
                  >
                    {formatDA(subtotal)}
                  </motion.span>
                </div>
                <p className="text-xs text-wine/50">frais de livraison calculés à l'étape suivante</p>
                <Link to="/commande" onClick={onClose} className="btn-primary w-full">
                  passer la commande
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
