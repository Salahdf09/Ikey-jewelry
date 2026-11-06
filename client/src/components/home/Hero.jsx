import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import JewelryBackground from '../ui/JewelryBackground';
import FloatingJewelry from './FloatingJewelry';
import { useMouseParallax } from '../../hooks/useMouseParallax';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Hand-placed slots, not generated — a deliberate composition (one large
// focal piece, a few smaller ones at different depths) rather than a random
// scatter. `hideOnMobile` trims the stage down on small screens per the
// "fewer floating objects on mobile" requirement.
function buildSlots(products) {
  if (!products || products.length === 0) return [];
  const p = (i) => products[i % products.length];
  return [
    { product: p(0), size: 220, position: { right: '6%', top: '14%' }, depth: 1.3, duration: 10, delay: 0, rotateRange: 3, cardSide: 'left' },
    { product: p(1), size: 108, position: { right: '38%', top: '2%' }, depth: 0.7, duration: 8, delay: 0.6, rotateRange: 4, cardSide: 'bottom', hideOnMobile: true },
    { product: p(2), size: 96, position: { right: '2%', top: '64%' }, depth: 1.0, duration: 9, delay: 1.1, rotateRange: 3, cardSide: 'top' },
    { product: p(3), size: 84, position: { right: '44%', top: '66%' }, depth: 0.6, duration: 11, delay: 0.3, rotateRange: 5, cardSide: 'bottom', hideOnMobile: true },
  ];
}

export default function Hero({ products = [] }) {
  const parallax = useMouseParallax();
  const reduceMotion = useReducedMotion();
  const slots = buildSlots(products);

  return (
    <section
      className="relative overflow-hidden bg-plum"
      onMouseMove={parallax.onMouseMove}
      onMouseLeave={parallax.onMouseLeave}
    >
      <JewelryBackground local />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 35%, rgba(237,147,177,0.08), transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 grid lg:grid-cols-2 gap-6 items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
          <motion.span variants={item} className="badge bg-cream/10 text-petal-light border border-cream/10 mb-6">
            <Sparkles size={13} strokeWidth={1.75} className="mr-1.5" />
            fait main, avec tendresse
          </motion.span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-cream">
            <motion.span variants={item} className="block">
              des bijoux qui
            </motion.span>
            <motion.span variants={item} className="block">
              <span className="text-[#E8C27A]">racontent</span> tes histoires.
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-6 text-cream/60 max-w-sm text-base sm:text-lg">
            pièces faites main, livrées chez toi — payables à la réception.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <Link to="/produits" className="btn-primary">
              découvrir la collection
            </Link>
            <Link
              to="/produits?featured=true"
              className="btn-pill border border-cream/25 text-cream hover:bg-cream/10"
            >
              nos coups de cœur
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative mt-16 h-[320px] sm:h-[380px] lg:mt-0 lg:h-[520px]">
          {slots.map((s, i) => (
            <FloatingJewelry
              key={s.product.id}
              product={s.product}
              size={s.size}
              position={s.position}
              depth={s.depth}
              floatDuration={s.duration}
              floatDelay={s.delay}
              rotateRange={s.rotateRange}
              cardSide={s.cardSide}
              parallax={parallax}
              className={s.hideOnMobile ? 'hidden md:block' : ''}
            />
          ))}
        </div>
      </div>

      {/* soft fade into whatever section follows, so the dark hero doesn't end on a hard edge */}
      {!reduceMotion && (
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      )}
    </section>
  );
}
