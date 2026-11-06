import { Gem } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Reveal from '../ui/Reveal';

const STAGGER_MS = 60;
const STAGGER_CAP = 8;

export default function ProductGrid({ products, loading, emptyMessage = 'aucun produit trouvé.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
        <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center">
          <Gem size={26} strokeWidth={1.5} className="text-petal" />
        </div>
        <p className="text-wine/60 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
      {products.map((p, i) => (
        <Reveal key={p.id} delay={(i % STAGGER_CAP) * STAGGER_MS}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}
