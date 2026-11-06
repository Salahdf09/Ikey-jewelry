import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Gem, ChevronRight, Truck, ShieldCheck } from 'lucide-react';
import { fetchProduct } from '../services/products.service';
import { formatDA } from '../utils/currency';
import { useCartStore } from '../store/cartStore';
import VariantSelector from '../components/product/VariantSelector';
import QuantitySelector from '../components/product/QuantitySelector';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchProduct(slug)
      .then((p) => {
        setProduct(p);
        setVariant(p.variants?.length ? p.variants[0] : null);
        setActiveImage(0);
        setQuantity(1);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-center text-wine/50">chargement...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-wine/60 mb-4">ce produit n'existe pas ou n'est plus disponible.</p>
        <Link to="/produits" className="btn-outline">voir tous les produits</Link>
      </div>
    );
  }

  const unitPrice = product.price + (variant?.priceDelta || 0);
  const availableStock = product.trackStock ? (variant ? variant.stock : product.stock) : Infinity;
  const inStock = availableStock > 0;
  const images = product.images?.length ? product.images : [];

  function buildCartLine() {
    return {
      productId: product.id,
      variantId: variant?.id || null,
      name: product.name,
      variantName: variant?.name || null,
      price: unitPrice,
      image: images[0]?.url,
      slug: product.slug,
    };
  }

  function handleAddToCart() {
    addItem(buildCartLine(), quantity);
    toast.success(`${product.name} ajouté au panier`);
  }

  function handleBuyNow() {
    addItem(buildCartLine(), quantity);
    navigate('/commande');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <nav className="flex items-center gap-1.5 text-xs text-wine/50 mb-6">
        <Link to="/" className="hover:text-rose">accueil</Link>
        <ChevronRight size={12} />
        <Link to="/produits" className="hover:text-rose">produits</Link>
        <ChevronRight size={12} />
        <span className="text-wine/70">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-blush border border-petal-light relative">
            {images.length ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]?.url}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover absolute inset-0"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-petal-light">
                <Gem size={48} strokeWidth={1.25} className="text-cream/80" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {images.map((img, i) => (
                <motion.button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-rose' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {product.isNew && (
            <motion.span
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="badge bg-rose text-cream mb-3"
            >
              nouveau
            </motion.span>
          )}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="text-3xl sm:text-4xl text-plum mb-3"
          >
            {product.name}
          </motion.h1>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex items-center gap-3 mb-5"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={unitPrice}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-semibold text-rose"
              >
                {formatDA(unitPrice)}
              </motion.span>
            </AnimatePresence>
            {product.compareAtPrice && (
              <span className="text-base text-wine/40 line-through">{formatDA(product.compareAtPrice)}</span>
            )}
          </motion.div>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="text-wine/75 leading-relaxed mb-6"
          >
            {product.description}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="space-y-5 mb-6"
          >
            <VariantSelector variants={product.variants} selected={variant} onSelect={setVariant} />

            <div>
              <p className="label-field">quantité</p>
              <QuantitySelector value={quantity} onChange={setQuantity} max={availableStock === Infinity ? 20 : availableStock} />
            </div>
          </motion.div>

          {!inStock && <p className="text-sm text-rose-deep font-medium mb-4">ce produit est actuellement en rupture de stock.</p>}

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <button onClick={handleAddToCart} disabled={!inStock} className="btn-outline flex-1 sm:flex-none">
              ajouter au panier
            </button>
            <button onClick={handleBuyNow} disabled={!inStock} className="btn-primary flex-1 sm:flex-none">
              acheter maintenant
            </button>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col gap-2.5 text-sm text-wine/70 border-t border-petal-light pt-5"
          >
            <div className="flex items-center gap-2">
              <Truck size={16} strokeWidth={1.75} className="text-rose-deep" />
              paiement à la livraison, partout en Algérie
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-rose-deep" />
              fait main, avec des matériaux soignés
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
