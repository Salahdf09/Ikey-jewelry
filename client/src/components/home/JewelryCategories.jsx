import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchCategories, fetchProducts } from '../../services/products.service';
import JewelryBackground from '../ui/JewelryBackground';
import Reveal from '../ui/Reveal';

// Same explorer as the collection it replaces: hover (desktop) or tap
// (touch) a category to bring it into focus; the large display crossfades.
// Each category's artwork is its first product's photo.
export default function JewelryCategories() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    fetchCategories().then(async (cats) => {
      const withImages = await Promise.all(
        cats.map(async (c) => {
          if (!c.productCount) return { ...c, image: null };
          const { items } = await fetchProducts({ category: c.slug, limit: 1 });
          return { ...c, image: items[0]?.images?.[0]?.url ?? null };
        })
      );
      setCategories(withImages);
    });
  }, []);

  if (categories.length === 0) return null;

  const active = categories[selected] || categories[0];
  const countLabel = (n) => (n === 1 ? '1 pièce' : `${n} pièces`);

  return (
    <section className="relative overflow-hidden bg-plum py-20 sm:py-28">
      <JewelryBackground local />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl text-cream">les catégories</h2>
          <p className="text-cream/50 mt-2">explore, catégorie par catégorie</p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 lg:gap-16 items-center">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-cream/10 bg-blush/5">
            <AnimatePresence mode="wait">
              {active.image ? (
                <motion.img
                  key={active.slug}
                  src={active.image}
                  alt={active.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-gradient-to-br from-petal-light/30 to-plum"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-plum/60 via-transparent to-transparent" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl sm:text-3xl text-cream">{active.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#E8C27A] text-lg font-medium">{countLabel(active.productCount)}</span>
                  <Link to={`/produits?category=${active.slug}`} className="btn-primary">
                    voir la catégorie
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((c, i) => (
              <button
                key={c.slug}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-blush/10"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      i === selected ? 'opacity-100 scale-105' : 'opacity-50 group-hover:opacity-80'
                    }`}
                  />
                )}
                <span className="absolute bottom-3 left-3 right-3 text-left font-display text-base text-cream drop-shadow">
                  {c.name}
                </span>
                <div
                  className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-300 ${
                    i === selected ? 'border-[#E8C27A]' : 'border-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
