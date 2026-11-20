import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { formatDA } from '../../utils/currency';
import Reveal from '../ui/Reveal';

// Vitrine épinglée : chaque cran de scroll montre le bijou suivant.
// À gauche la photo du produit (bouton "découvrir" → page produit).
// À droite les bijoux qui tournent en 3D (lien → page de la collection).

const EASE = [0.22, 1, 0.36, 1];
const GOLD = '#E8C27A';
const ORDER = ['colliers', 'bagues', 'bracelets', 'boucles-oreilles', 'piercing'];
const COLLECTION_LABEL = {
  colliers: 'voir les colliers',
  bagues: 'voir les bagues',
  bracelets: 'voir les bracelets',
  'boucles-oreilles': "voir les boucles d'oreilles",
  piercing: 'voir les piercings',
};
const MAX_ITEMS = ORDER.length;

// Une pièce par catégorie (dans l'ordre ci-dessus), complétée si besoin.
function pickShowcase(products) {
  const picked = [];
  ORDER.forEach((slug) => {
    const found = products.find((p) => p.category?.slug === slug && p.images?.length && !picked.includes(p));
    if (found) picked.push(found);
  });
  products.forEach((p) => {
    if (picked.length < MAX_ITEMS && p.images?.length && !picked.includes(p)) picked.push(p);
  });
  return picked.slice(0, MAX_ITEMS);
}

function JewelGlyph({ slug }) {
  const common = { viewBox: '0 0 120 120', width: 120, height: 120, fill: 'none', 'aria-hidden': true };
  if (slug === 'bagues') {
    return (
      <svg {...common}>
        <ellipse cx="60" cy="62" rx="26" ry="40" stroke={GOLD} strokeWidth="9" />
        <ellipse cx="60" cy="62" rx="26" ry="40" stroke="#4B1528" strokeWidth="3" strokeDasharray="0.1 6" strokeLinecap="round" />
        <path d="M18 84 C18 72 102 72 102 84" stroke={GOLD} strokeWidth="5" />
      </svg>
    );
  }
  if (slug === 'bracelets') {
    return (
      <svg {...common} strokeLinecap="round">
        <path d="M44 30 C14 40 10 82 40 94 C60 102 84 96 96 82" stroke={GOLD} strokeWidth="5" />
        <path d="M54 18 C66 18 72 30 64 38 C58 44 48 40 48 32 C48 24 50 18 54 18 Z" fill="#FFF9FB" stroke="#4B1528" strokeWidth="3" />
        <rect x="94" y="56" width="18" height="24" rx="4" fill="#FFF9FB" stroke="#4B1528" strokeWidth="3" />
      </svg>
    );
  }
  if (slug === 'piercing') {
    return (
      <svg {...common} strokeLinecap="round">
        <circle cx="60" cy="26" r="9" fill="#FFF9FB" stroke={GOLD} strokeWidth="4" />
        <line x1="60" y1="35" x2="60" y2="52" stroke={GOLD} strokeWidth="3" />
        <circle cx="60" cy="80" r="27" stroke={GOLD} strokeWidth="5" />
        <circle cx="60" cy="80" r="3.5" fill={GOLD} />
      </svg>
    );
  }
  if (slug === 'boucles-oreilles') {
    return (
      <svg {...common} strokeLinecap="round">
        <path d="M40 10 V34 M80 10 V34" stroke={GOLD} strokeWidth="3" />
        <path d="M40 34 C30 50 26 62 26 72 C26 84 32 92 40 92 C48 92 54 84 54 72 C54 62 50 50 40 34 Z" stroke={GOLD} strokeWidth="5" />
        <path d="M80 34 C70 50 66 62 66 72 C66 84 72 92 80 92 C88 92 94 84 94 72 C94 62 90 50 80 34 Z" stroke={GOLD} strokeWidth="5" />
      </svg>
    );
  }
  return (
    <svg {...common} strokeLinecap="round">
      <path d="M14 6 C20 44 44 56 60 56 C76 56 100 44 106 6" stroke={GOLD} strokeWidth="2.5" strokeDasharray="4 3" />
      <path d="M60 56 C46 70 40 84 40 94 C40 106 49 114 60 114 C71 114 80 106 80 94 C80 84 74 70 60 56 Z" stroke={GOLD} strokeWidth="7" />
      <path
        d="M60 56 C46 70 40 84 40 94 C40 106 49 114 60 114 C71 114 80 106 80 94 C80 84 74 70 60 56 Z"
        stroke="#4B1528"
        strokeWidth="2.4"
        strokeDasharray="0.1 5.2"
      />
    </svg>
  );
}

function ProductStage({ product }) {
  const url = product.images?.[0]?.url;
  const slug = product.category?.slug;
  return (
    <div className="relative flex-1 min-w-0 rounded-[2rem] overflow-hidden bg-blush border border-petal-light">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={product.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.97, filter: 'blur(14px)' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {url && <img src={url} alt={product.name} className="w-full h-full object-cover" draggable={false} />}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-plum/70 via-transparent to-plum/30" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={product.id}
          className="absolute inset-0 flex flex-col justify-between items-center py-7 px-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h3 className="font-display italic text-cream text-4xl sm:text-5xl drop-shadow-lg">{product.name}.</h3>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              <Link to={`/produits/${product.slug}`} className="btn-pill bg-cream text-plum hover:bg-blush">
                découvrir
              </Link>
              <span className="btn-pill bg-cream/20 text-cream backdrop-blur pointer-events-none">{formatDA(product.price)}</span>
            </div>
            <p className="text-cream/80 text-sm">
              {product.category?.name ? `${product.category.name.toLowerCase()} · ` : ''}fait main
            </p>
            {slug && (
              <Link to={`/produits?category=${slug}`} className="md:hidden text-cream text-xs tracking-[0.2em] uppercase underline underline-offset-4">
                {COLLECTION_LABEL[slug] || 'voir la collection'}
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ScrollShowcase({ items }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length))));
  });

  const product = items[active];

  return (
    <section ref={sectionRef} className="relative bg-cream" style={{ height: `${items.length * 85 + 30}vh` }}>
      <div className="sticky top-16 h-[calc(100svh-4rem)] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto h-full flex gap-4">
          <ProductStage product={product} />

          <div className="hidden md:block relative w-[300px] shrink-0 rounded-[2rem] overflow-hidden bg-plum text-cream">
            <span className="absolute top-6 right-6 z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-cream/80">
              <span className="w-2 h-2 rounded-full border border-cream/80" />
              fais défiler pour explorer
            </span>

            <motion.div
              className="absolute inset-x-0 top-1/2"
              animate={{ y: -active * 230 - 115 }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ perspective: 600 }}
            >
              {items.map((p, i) => {
                const on = i === active;
                const slug = p.category?.slug;
                return (
                  <motion.div
                    key={p.id}
                    className="h-[230px] flex flex-col items-center justify-center gap-4"
                    animate={{ opacity: on ? 1 : 0.3, scale: on ? 1.2 : 0.8 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <Link
                      to={slug ? `/produits?category=${slug}` : '/produits'}
                      aria-label={COLLECTION_LABEL[slug] || 'voir la collection'}
                      tabIndex={on ? 0 : -1}
                      className="flex flex-col items-center gap-3"
                    >
                      <span className="block jewel-spin3d" style={{ animationDuration: on ? '5s' : '9s' }}>
                        <JewelGlyph slug={slug} />
                      </span>
                      <span className="text-[10px] tracking-[0.3em] uppercase border-b border-cream/50 pb-1">
                        {COLLECTION_LABEL[slug] || 'voir la collection'}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="absolute left-6 bottom-6 flex gap-1.5" aria-hidden="true">
              {items.map((p, i) => (
                <span
                  key={p.id}
                  className="block h-0.5 rounded-full transition-all duration-500"
                  style={{ width: i === active ? 34 : 12, background: i === active ? '#FFF9FB' : 'rgba(255,249,251,0.3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticShowcase({ items }) {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10">
          <h2 className="font-display italic text-3xl sm:text-4xl">nos pièces signature</h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((p) => (
            <Link key={p.id} to={`/produits/${p.slug}`}>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-blush border border-petal-light">
                <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="font-display text-lg text-plum mt-3">{p.name}</p>
              <p className="text-rose text-sm">{formatDA(p.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JewelShowcase({ products = [] }) {
  const reduceMotion = useReducedMotion();
  const items = useMemo(() => pickShowcase(products), [products]);
  if (items.length === 0) return null;
  return reduceMotion ? <StaticShowcase items={items} /> : <ScrollShowcase items={items} />;
}
