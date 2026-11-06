import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDA } from '../../utils/currency';

// The small glass card that appears next to a FloatingJewelry piece on
// hover — dark translucent, blurred, thin border, minimal type.
export default function FloatingProductCard({ product, side = 'bottom' }) {
  const positionClass =
    side === 'bottom'
      ? 'top-full mt-3 left-1/2 -translate-x-1/2'
      : side === 'top'
        ? 'bottom-full mb-3 left-1/2 -translate-x-1/2'
        : side === 'left'
          ? 'right-full mr-3 top-1/2 -translate-y-1/2'
          : 'left-full ml-3 top-1/2 -translate-y-1/2';

  return (
    <motion.div
      initial={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${positionClass} z-20 w-36 rounded-2xl border border-cream/15 bg-plum/80 backdrop-blur-md px-3.5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]`}
    >
      <p className="text-xs font-semibold text-cream leading-snug truncate">{product.name}</p>
      <p className="text-xs text-[#E8C27A] mt-1 font-medium">{formatDA(product.price)}</p>
      <Link
        to={`/produits/${product.slug}`}
        className="mt-2 inline-block text-[10px] uppercase tracking-wide text-petal-light hover:text-cream transition-colors"
      >
        découvrir →
      </Link>
    </motion.div>
  );
}
