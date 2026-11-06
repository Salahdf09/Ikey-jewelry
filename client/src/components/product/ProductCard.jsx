import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ShoppingBag, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDA } from '../../utils/currency';
import { useCartStore } from '../../store/cartStore';

const MotionLink = motion(Link);

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springConfig);
  const glowX = useTransform(px, [0, 1], ['0%', '100%']);
  const glowY = useTransform(py, [0, 1], ['0%', '100%']);

  const image = product.images?.[0]?.url;
  const inStock = !product.trackStock || product.stock > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  function handleMouseMove(e) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!inStock || hasVariants) return;
    setAdding(true);
    addItem(
      {
        productId: product.id,
        variantId: null,
        name: product.name,
        variantName: null,
        price: product.price,
        image,
        slug: product.slug,
      },
      1
    );
    toast.success(`${product.name} ajouté au panier`);
    setTimeout(() => setAdding(false), 400);
  }

  return (
    <MotionLink
      to={`/produits/${product.slug}`}
      className="group block"
      style={{ perspective: 800 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="relative rounded-2xl overflow-hidden bg-blush border border-petal-light aspect-square transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-petal/40 group-hover:border-petal"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-petal-light">
            <Gem size={36} strokeWidth={1.25} className="text-cream/80" />
          </div>
        )}

        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(160px circle at ${glowX} ${glowY}, rgba(255,255,255,0.35), transparent 70%)`,
            }}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge bg-rose text-cream">nouveau</span>}
          {discount && <span className="badge bg-plum text-cream">-{discount}%</span>}
          {!inStock && <span className="badge bg-wine/80 text-cream">rupture de stock</span>}
        </div>

        {inStock && !hasVariants && (
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-cream text-rose flex items-center justify-center shadow-sm opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-300 hover:bg-rose hover:text-cream active:scale-90 ${
              adding ? 'scale-110' : 'scale-100'
            }`}
            aria-label="Ajouter au panier"
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
          </button>
        )}
      </motion.div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-plum leading-snug transition-colors group-hover:text-rose-deep">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-rose">{formatDA(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-wine/40 line-through">{formatDA(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </MotionLink>
  );
}
