import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatDA } from '../../utils/currency';
import { useCartStore } from '../../store/cartStore';

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4 border-b border-petal-light last:border-0">
      <div className="w-20 h-20 rounded-xl bg-blush shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-petal-light" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-plum leading-tight">{item.name}</p>
            {item.variantName && <p className="text-xs text-wine/60 mt-0.5">{item.variantName}</p>}
          </div>
          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="text-wine/40 hover:text-rose transition-colors p-1"
            aria-label="Retirer du panier"
          >
            <Trash2 size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-petal-light rounded-pill">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="p-1.5 text-wine hover:text-rose"
              aria-label="Diminuer la quantité"
            >
              <Minus size={13} strokeWidth={2} />
            </button>
            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="p-1.5 text-wine hover:text-rose"
              aria-label="Augmenter la quantité"
            >
              <Plus size={13} strokeWidth={2} />
            </button>
          </div>
          <span className="text-sm font-semibold text-rose">{formatDA(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
