import { motion } from 'framer-motion';

// Fades + lifts children into place the first time they scroll into view.
// `delay` (ms) staggers a group of siblings. framer-motion's viewport
// tracking already respects prefers-reduced-motion via useReducedMotion
// internally for the transform, and our global CSS still collapses any
// leftover CSS transitions on the wrapped content.
export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
