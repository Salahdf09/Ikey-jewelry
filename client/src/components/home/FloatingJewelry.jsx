import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'framer-motion';
import FloatingProductCard from './FloatingProductCard';

// One piece of jewelry floating in the hero: a slow independent bob+sway
// loop (inner layer) composed with a cursor-parallax offset scaled by its
// own depth (outer layer) — two nested elements rather than one, since
// framer-motion can't cleanly sum a looping `animate` transform with a
// separately-driven motion-value transform on the same element.
export default function FloatingJewelry({
  product,
  size = 140,
  depth = 1,
  position,
  floatDuration = 9,
  floatDelay = 0,
  rotateRange = 3,
  cardSide = 'bottom',
  parallax,
  className = '',
}) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const px = useTransform(parallax.x, (v) => v * depth * 26);
  const py = useTransform(parallax.y, (v) => v * depth * 26);

  const image = product?.images?.[0]?.url;

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ ...position, x: reduceMotion ? 0 : px, y: reduceMotion ? 0 : py }}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -16, 0], rotate: [0, rotateRange, 0, -rotateRange, 0] }
        }
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="relative"
      >
        <Link to={`/produits/${product.slug}`} aria-label={product.name}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative cursor-pointer"
            style={{ width: size, height: size }}
          >
            {/* soft gold glow, brightens on hover — stands in for a metallic highlight */}
            <motion.div
              className="absolute -inset-3 rounded-full"
              style={{ background: 'radial-gradient(closest-side, rgba(232,194,122,0.35), transparent 70%)' }}
              animate={{ opacity: hovered ? 1 : 0.35 }}
              transition={{ duration: 0.4 }}
            />

            <div className="relative w-full h-full rounded-full overflow-hidden border border-cream/15 bg-blush/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              {image ? (
                <img src={image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-petal-light/20" />
              )}
              {/* glass highlight sweep */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 35%)',
                }}
              />
            </div>
          </motion.div>
        </Link>

        <AnimatePresence>{hovered && <FloatingProductCard product={product} side={cardSide} />}</AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
