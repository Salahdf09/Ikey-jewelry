import { useMotionValue, useSpring } from 'framer-motion';

// Tracks the cursor as a -0.5..0.5 offset from the center of whatever
// element spreads these handlers on its onMouseMove/onMouseLeave, smoothed
// through a spring so depth layers glide rather than jump. Consumers scale
// x/y by their own depth factor (useTransform(x, v => v * depth)) so a
// background layer can drift a little while a foreground piece drifts more.
// Skips entirely on touch/coarse-pointer devices — there's no cursor to
// track, so the listeners would just be dead weight.
const hasFinePointer =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

export function useMouseParallax() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 50, damping: 18, mass: 0.5 });
  const y = useSpring(py, { stiffness: 50, damping: 18, mass: 0.5 });

  function onMouseMove(e) {
    if (!hasFinePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return { x, y, onMouseMove, onMouseLeave };
}
