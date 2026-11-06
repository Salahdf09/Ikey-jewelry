import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Logo from './Logo';
import LightRays from './LightRays';

// Set VITE_DISABLE_INTRO=true in client/.env to skip this during
// development — it otherwise plays once on every full page load. This
// screen is fully self-contained: it mounts once in StorefrontLayout,
// controls its own timeline, and unmounts completely — nothing it does
// here touches the rest of the site.
const INTRO_ENABLED = import.meta.env.VITE_DISABLE_INTRO !== 'true';

// Timeline (ms): welcome text -> light rays converge and reveal the logo ->
// brief hero hold -> everything fades away together.
const WELCOME_MS = 800;
const LIGHT_MS = 1300;
const HOLD_MS = 900;
const EXIT_START = WELCOME_MS + LIGHT_MS + HOLD_MS; // 3000
const EXIT_MS = 850;
const TOTAL_MS = EXIT_START + EXIT_MS;

function ReducedMotionScreen({ onDone }) {
  // Per the brief: "Welcome text -> logo fade/reveal -> subtle jewelry
  // appearance -> website" — no rays, no continuous motion. Two tiny static
  // glyphs standing in for "subtle jewelry appearance", gone the moment
  // they've faded in.
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-plum flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        onAnimationComplete={() => setTimeout(onDone, 900)}
      >
        <p className="font-display text-xl text-cream/90">bienvenue.</p>
        <Logo size={88} tone="light" />
        <div className="flex items-center gap-5 opacity-70">
          <svg width="22" height="22" viewBox="0 0 40 40">
            <circle cx="20" cy="22" r="10" fill="none" stroke="#D4A657" strokeWidth="2" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 40 40">
            <polygon points="20,4 32,15 20,36 8,15" fill="#D4A657" opacity="0.8" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function JewelryLoadingScreen() {
  const [visible, setVisible] = useState(INTRO_ENABLED);
  // welcome -> light -> hold -> exit
  const [stage, setStage] = useState('welcome');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!INTRO_ENABLED || reduceMotion) return undefined;

    const timers = [
      setTimeout(() => setStage('light'), WELCOME_MS),
      setTimeout(() => setStage('hold'), WELCOME_MS + LIGHT_MS),
      setTimeout(() => setStage('exit'), EXIT_START),
      setTimeout(() => setVisible(false), TOTAL_MS),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  if (!INTRO_ENABLED) return null;

  const logoVisible = stage !== 'welcome' && stage !== 'exit';

  return (
    <AnimatePresence>
      {visible &&
        (reduceMotion ? (
          <ReducedMotionScreen onDone={() => setVisible(false)} />
        ) : (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{ pointerEvents: stage === 'exit' ? 'none' : 'auto' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dissolves independently of (and slightly behind) the logo —
                what's already floating in the hero shows through as this fades. */}
            <motion.div
              className="absolute inset-0 bg-plum"
              initial={{ opacity: 1 }}
              animate={{ opacity: stage === 'exit' ? 0 : 1 }}
              transition={
                stage === 'exit'
                  ? { duration: EXIT_MS / 1000, delay: 0.15, ease: [0.4, 0, 0.2, 1] }
                  : { duration: 0 }
              }
            />

            <LightRays active={stage === 'light'} duration={LIGHT_MS / 1000} />

            {/* Welcome text — fades/blurs in, then gives way to the light */}
            <motion.p
              className="absolute font-display text-2xl sm:text-3xl tracking-wide text-cream text-center px-6"
              initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
              animate={
                stage === 'welcome'
                  ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : { opacity: 0, scale: 1.03, filter: 'blur(6px)' }
              }
              transition={{ duration: stage === 'welcome' ? 0.7 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              bienvenue.
            </motion.p>

            {/* Logo — revealed by the light rather than simply appearing;
                left completely undistorted throughout, only opacity/scale move. */}
            <motion.div
              className="relative z-10"
              animate={{
                opacity: logoVisible ? 1 : 0,
                scale: stage === 'exit' ? 0.88 : 1,
              }}
              transition={
                stage === 'light'
                  ? { duration: (LIGHT_MS / 1000) * 0.75, delay: (LIGHT_MS / 1000) * 0.2, ease: 'easeOut' }
                  : stage === 'exit'
                    ? { duration: EXIT_MS / 1000, ease: 'easeIn' }
                    : { duration: 0.3 }
              }
            >
              <Logo size={104} tone="light" />
            </motion.div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
