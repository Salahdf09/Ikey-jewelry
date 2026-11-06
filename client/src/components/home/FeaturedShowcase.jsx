import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { formatDA } from '../../utils/currency';
import Reveal from '../ui/Reveal';

const EASE = [0.22, 1, 0.36, 1];
const AUTOPLAY_MS = 3200;
const AUTOPLAY_TRAVEL_S = 1.1;
const PIN_END = 0.6;

const LAYOUT_DESKTOP = { w: 260, h: 330, spacing: 300, arc: 26 };
const LAYOUT_MOBILE = { w: 170, h: 215, spacing: 150, arc: 14 };

const matchesSmallScreen = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches;

function Photo({ product }) {
  const url = product.images?.[0]?.url;
  return url ? (
    <img src={url} alt={product.name} className="w-full h-full object-cover" loading="lazy" draggable={false} />
  ) : (
    <div className="w-full h-full bg-blush" />
  );
}

// Each card hangs on an arc around the centre. Its distance from the active
// slot (index − position) drives position, scale, tilt and fade, so the
// carousel is fully motion-value-driven with no React re-renders per frame.
// A velocity spring adds a short swing whenever the carousel moves.
function HangingCard({ product, index, position, swing, layout }) {
  const x = useTransform(position, (v) => (index - v) * layout.spacing);
  const y = useTransform(position, (v) => Math.pow(Math.abs(index - v), 1.6) * layout.arc);
  const scale = useTransform(position, (v) => 1 - 0.22 * Math.min(1, Math.abs(index - v)));
  const rotate = useTransform([position, swing], ([v, s]) => -(index - v) * 9 + s);
  const opacity = useTransform(position, (v) => Math.max(0, Math.min(1, 1 - (Math.abs(index - v) - 1.4) * 0.9)));
  const zIndex = useTransform(position, (v) => 20 - Math.round(Math.abs(index - v) * 5));

  return (
    <motion.div
      className="absolute left-1/2 top-[52%]"
      style={{
        x,
        y,
        scale,
        rotate,
        opacity,
        zIndex,
        width: layout.w,
        height: layout.h,
        marginLeft: -layout.w / 2,
        marginTop: -layout.h / 2,
      }}
    >
      <Link
        to={`/produits/${product.slug}`}
        aria-label={product.name}
        className="block w-full h-full rounded-[2rem] overflow-hidden bg-blush border border-petal-light shadow-[0_30px_60px_-20px_rgba(75,21,40,0.35)]"
      >
        <Photo product={product} />
      </Link>
    </motion.div>
  );
}

function ScrollShowcase({ products }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [layout] = useState(() => (matchesSmallScreen() ? LAYOUT_MOBILE : LAYOUT_DESKTOP));
  const carousel = products.slice(0, 6);
  const gridItems = products.slice(0, 4);
  const lastIndex = carousel.length - 1;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // The carousel position (in piece-index units) is driven by two things:
  // manual scroll (it follows the page) and autoplay (it glides to the next
  // piece on a timer). Whichever moved it last wins; scrolling stops autoplay.
  const position = useMotionValue(0);
  const velocity = useVelocity(position);
  const smoothVelocity = useSpring(velocity, { damping: 30, stiffness: 180 });
  const swing = useTransform(smoothVelocity, (v) => Math.max(-14, Math.min(14, -v * 10)));

  const controlsRef = useRef(null);
  const directionRef = useRef(1);
  const stageInView = useInView(stageRef, { amount: 0.5 });
  const [hovered, setHovered] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    controlsRef.current?.stop();
    position.set(Math.min(v / PIN_END, 1) * Math.max(lastIndex, 0.0001));
  });

  useEffect(() => {
    if (!stageInView || hovered || lastIndex < 1) return undefined;

    const step = () => {
      if (scrollYProgress.get() > PIN_END) return;
      const current = Math.round(position.get());
      let next = current + directionRef.current;
      if (next > lastIndex) {
        directionRef.current = -1;
        next = current - 1;
      } else if (next < 0) {
        directionRef.current = 1;
        next = current + 1;
      }
      controlsRef.current = animate(position, next, { duration: AUTOPLAY_TRAVEL_S, ease: EASE });
    };

    const timer = setInterval(step, AUTOPLAY_MS);
    return () => {
      clearInterval(timer);
      controlsRef.current?.stop();
    };
  }, [stageInView, hovered, lastIndex, position, scrollYProgress]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(position, 'change', (v) => {
    setActive(Math.min(lastIndex, Math.max(0, Math.round(v))));
  });

  const piecesHeadingOpacity = useTransform(scrollYProgress, [0.46, PIN_END], [1, 0]);
  const productsHeadingOpacity = useTransform(scrollYProgress, [0.68, 0.84], [0, 1]);
  const carouselOpacity = useTransform(scrollYProgress, [PIN_END, 0.74], [1, 0]);
  const carouselPointer = useTransform(scrollYProgress, (v) => (v < 0.66 ? 'auto' : 'none'));
  const gridOpacity = useTransform(scrollYProgress, [0.7, 0.86], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.7, 0.86], [48, 0]);
  const gridPointer = useTransform(scrollYProgress, (v) => (v > 0.78 ? 'auto' : 'none'));

  const activeProduct = carousel[active];

  return (
    <section ref={sectionRef} className="relative bg-cream" style={{ height: '300vh' }}>
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="absolute top-24 sm:top-28 inset-x-0 h-20 text-center px-4">
          <motion.div style={{ opacity: piecesHeadingOpacity }} className="absolute inset-x-0">
            <h2 className="text-3xl sm:text-4xl">pièces à la une</h2>
            <p className="text-wine/60 mt-2">fais défiler pour découvrir</p>
          </motion.div>
          <motion.div style={{ opacity: productsHeadingOpacity }} className="absolute inset-x-0">
            <h2 className="text-3xl sm:text-4xl">nos produits</h2>
          </motion.div>
        </div>

        <motion.div style={{ opacity: carouselOpacity, pointerEvents: carouselPointer }} className="absolute inset-0">
          {carousel.map((p, i) => (
            <HangingCard key={p.id} product={p} index={i} position={position} swing={swing} layout={layout} />
          ))}

          <div className="absolute bottom-10 sm:bottom-14 inset-x-0 text-center px-4">
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <h3 className="font-display text-2xl sm:text-3xl text-plum">{activeProduct.name}</h3>
                  <p className="font-display text-xl text-rose mt-1">{formatDA(activeProduct.price)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: gridOpacity, y: gridY, pointerEvents: gridPointer }}
          className="absolute left-0 right-0 mx-auto max-w-5xl top-44 sm:top-48 px-4 sm:px-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {gridItems.map((p) => (
              <Link key={p.id} to={`/produits/${p.slug}`} className="group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-blush border border-petal-light">
                  <Photo product={p} />
                </div>
                <p className="font-display text-lg text-plum mt-3">{p.name}</p>
                <p className="text-rose text-sm">{formatDA(p.price)}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/produits" className="btn-outline inline-block">
              voir toute la collection
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StaticShowcase({ products }) {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl">pièces à la une</h2>
          <p className="text-wine/60 mt-2">quatre pièces, choisies pour leur caractère</p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <Link key={p.id} to={`/produits/${p.slug}`} className="group">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-blush border border-petal-light">
                <Photo product={p} />
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

export default function FeaturedShowcase({ products }) {
  const reduceMotion = useReducedMotion();

  if (!products || products.length === 0) return null;

  return reduceMotion ? <StaticShowcase products={products} /> : <ScrollShowcase products={products} />;
}
