import { motion } from 'framer-motion';

// Thin light streaks converging from outside the screen toward the center,
// plus a handful of small particles gathering along the logo's own ring
// radius — reads as "light constructing the logo" without ever touching
// the logo's actual geometry. Pure CSS/framer-motion (no canvas), so it's
// cheap regardless of device and can run well before the 3D chunk is ready.
const RAY_COUNT_DESKTOP = 8;
const RAY_COUNT_MOBILE = 5;
const PARTICLE_COUNT_DESKTOP = 7;
const PARTICLE_COUNT_MOBILE = 4;

const isSmallScreen = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches;

function buildRays(count) {
  const rays = [];
  for (let i = 0; i < count; i += 1) {
    const angleDeg = (360 / count) * i + (i % 2 === 0 ? 0 : 6); // slight irregularity, not a perfect mechanical fan
    const rad = (angleDeg * Math.PI) / 180;
    rays.push({
      angleDeg,
      dx: Math.sin(rad),
      dy: -Math.cos(rad),
      length: 150 + (i % 3) * 25,
      delay: (i % count) * 0.045,
    });
  }
  return rays;
}

function buildParticles(count, ringRadius) {
  const particles = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (360 / count) * i + 18;
    const rad = (angle * Math.PI) / 180;
    particles.push({
      targetX: Math.sin(rad) * ringRadius,
      targetY: -Math.cos(rad) * ringRadius,
      fromX: Math.sin(rad) * (ringRadius + 180 + (i % 2) * 60),
      fromY: -Math.cos(rad) * (ringRadius + 180 + (i % 2) * 60),
      delay: 0.1 + i * 0.05,
    });
  }
  return particles;
}

const RAYS = buildRays(isSmallScreen ? RAY_COUNT_MOBILE : RAY_COUNT_DESKTOP);
const PARTICLES = buildParticles(isSmallScreen ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP, 58);

export default function LightRays({ active, duration = 1.3 }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* central glow the rays converge into, settling softer once they arrive */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          background: 'radial-gradient(circle, rgba(246,227,161,0.55) 0%, rgba(212,166,87,0.22) 45%, transparent 72%)',
          filter: 'blur(6px)',
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={active ? { opacity: [0, 0.9, 0.35], scale: [0.4, 1.15, 0.85] } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: duration + 0.5, times: [0, 0.65, 1], ease: 'easeOut' }}
      />

      {RAYS.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 2,
            height: ray.length,
            background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.85) 55%, rgba(246,227,161,0.95))',
            transformOrigin: 'bottom center',
            rotate: `${ray.angleDeg}deg`,
            marginLeft: -1,
            // Anchors the ray's near tip (the transform-origin point) on the
            // true center, instead of its far/top edge — without this, the
            // whole bar sits `ray.length` px below-and-right of center before
            // rotation/translate, so every ray converges well off the logo.
            marginTop: -ray.length,
          }}
          initial={{ x: ray.dx * 560, y: ray.dy * 560, opacity: 0 }}
          animate={
            active
              ? { x: [ray.dx * 560, ray.dx * 70], y: [ray.dy * 560, ray.dy * 70], opacity: [0, 0.85, 0] }
              : { opacity: 0 }
          }
          transition={{ duration, delay: ray.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-[5px] h-[5px] rounded-full"
          style={{ background: '#F6E3A1', boxShadow: '0 0 6px 1px rgba(246,227,161,0.8)' }}
          initial={{ x: p.fromX, y: p.fromY, opacity: 0, scale: 0.5 }}
          animate={
            active
              ? { x: [p.fromX, p.targetX], y: [p.fromY, p.targetY], opacity: [0, 1, 0], scale: [0.5, 1, 0.6] }
              : { opacity: 0 }
          }
          transition={{ duration: duration + 0.3, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}
