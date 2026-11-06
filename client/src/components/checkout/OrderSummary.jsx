import { formatDA } from '../../utils/currency';

export default function OrderSummary({ items, subtotal, deliveryFee, deliveryType, deliverySpeed }) {
  const total = subtotal + (deliveryFee || 0);

  return (
    <div className="card p-5 sm:p-6 space-y-5">
      <h2 className="font-display text-lg text-plum">résumé de la commande</h2>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId || 'd'}`} className="flex gap-3">
            <div className="w-14 h-14 rounded-lg bg-blush shrink-0 overflow-hidden relative">
              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
              <span className="absolute -top-1.5 -right-1.5 bg-plum text-cream text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-plum truncate">{item.name}</p>
              {item.variantName && <p className="text-xs text-wine/50">{item.variantName}</p>}
            </div>
            <span className="text-sm font-semibold text-wine shrink-0">{formatDA(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-petal-light pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-wine/70">sous-total</span>
          <span className="font-medium text-plum">{formatDA(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-wine/70">
            livraison
            {deliveryFee != null &&
              ` (${deliverySpeed === 'economique' ? 'économique' : 'express'}, ${
                deliveryType === 'stopdesk' ? 'stop-desk' : 'à domicile'
              })`}
          </span>
          <span className="font-medium text-plum">{deliveryFee != null ? formatDA(deliveryFee) : '—'}</span>
        </div>
        <div className="flex justify-between text-base pt-2 border-t border-petal-light">
          <span className="font-semibold text-plum">total</span>
          <span className="font-bold text-rose">{formatDA(total)}</span>
        </div>
      </div>

      <div className="bg-blush text-plum text-center text-sm font-semibold py-2.5 rounded-pill">
        paiement : à la livraison
      </div>
    </div>
  );
}
