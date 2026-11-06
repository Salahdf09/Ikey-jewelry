import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-petal-light rounded-pill">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="p-3 text-wine hover:text-rose"
        aria-label="Diminuer la quantité"
      >
        <Minus size={15} strokeWidth={2} />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-plum">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="p-3 text-wine hover:text-rose"
        aria-label="Augmenter la quantité"
      >
        <Plus size={15} strokeWidth={2} />
      </button>
    </div>
  );
}
