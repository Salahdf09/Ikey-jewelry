import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  easeInOut,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  CAMPAIGN_PHOTO,
  CAMPAIGN_PHOTO_SMALL,
  CAMPAIGN_RATIO,
  HOTSPOTS,
  ORBIT_CROPS,
  START_CROP,
} from '../../config/campaign';

// Ouverture "campagne" de la page d'accueil, pilotée par le scroll :
// 1. des gros plans de la photo tournent autour d'un pendentif goutte ;
// 2. au scroll, ils s'éparpillent et un gros plan grandit jusqu'à révéler
//    toute la photo ;
// 3. des points apparaissent sur ses bijoux et ouvrent la collection.

const GOLD = '#E8C27A';
const lerp = (a, b, t) => a + (b - a) * t;

function CropImage({ crop, alt = '', className = '' }) {
  return (
    <img
      src={CAMPAIGN_PHOTO_SMALL}
      alt={alt}
      draggable={false}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{
        objectPosition: `${crop.x}% ${crop.y}%`,
        transformOrigin: `${crop.x}% ${crop.y}%`,
        transform: `scale(${crop.zoom})`,
      }}
    />
  );
}

function TeardropPendant() {
  return (
    <svg viewBox="0 0 100 120" className="w-[84px] h-[100px]" role="img" aria-label="pendentif goutte en or">
      <path
        d="M50 8 C34 28 22 50 22 70 C22 92 34 108 50 108 C66 108 78 92 78 70 C78 50 66 28 50 8 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth="9"
      />
      <path
        d="M50 8 C34 28 22 50 22 70 C22 92 34 108 50 108 C66 108 78 92 78 70 C78 50 66 28 50 8 Z"
        fill="none"
        stroke="#4B1528"
        strokeWidth="3.6"
        strokeDasharray="0.1 7"
        strokeLinecap="round"
      />
      <path d="M46 18 C36 32 28 48 27 64" fill="none" stroke="#FFF3D6" strokeWidth="1.4" />
      <path className="campaign-glint" d="M70 46 l2.5 7 l7 2.5 l-7 2.5 l-2.5 7 l-2.5 -7 l-7 -2.5 l7 -2.5 z" fill="#FFFFFF" />
    </svg>
  );
}

function OrbitTile({ crop, index, scatter, k }) {
  const transform = useTransform(
    [scatter, k],
    ([s, kk]) => `rotate(${index * 45}deg) translateY(${-(215 + s * 420) * kk}px) scale(${kk})`
  );
  return (
    <motion.div
      className="absolute -left-[58px] -top-[58px] w-[116px] h-[116px] rounded-[30px] overflow-hidden bg-blush shadow-[0_14px_30px_-8px_rgba(75,21,40,0.35)]"
      style={{ transform }}
    >
      <CropImage crop={crop} />
    </motion.div>
  );
}

function Hotspot({ spot, index }) {
  const labelOnLeft = spot.x > 60;
  return (
    <motion.div
      className="absolute"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Link
        to={`/produits?category=${spot.category}`}
        aria-label={`voir ${spot.label}`}
        className="group absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center"
      >
        <span className="absolute inset-0 rounded-full border border-cream bg-plum/30 backdrop-blur-sm campaign-ping" />
        <span className="relative w-2.5 h-2.5 rounded-full bg-cream" />
        <span
          className={`hidden sm:block absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-pill bg-cream text-plum text-xs font-semibold px-3 py-1.5 shadow-md transition-transform group-hover:scale-105 ${
            labelOnLeft ? 'right-12' : 'left-12'
          }`}
        >
          {spot.label} →
        </span>
      </Link>
    </motion.div>
  );
}

function Twinkles({ show }) {
  if (!show) return null;
  return HOTSPOTS.map((s, i) => (
    <span
      key={s.id}
      className="campaign-twinkle"
      style={{ left: `${s.x + 2.5}%`, top: `${s.y - 3.5}%`, animationDelay: `${-i * 0.6}s` }}
    />
  ));
}

function AnimatedCampaign() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const W = useMotionValue(1280);
  const H = useMotionValue(720);
  const [wide, setWide] = useState(true);
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      W.set(width);
      H.set(height);
      setWide(width >= 1024);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, H]);

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(p, 'change', (v) => setShowDots(v > 0.88));

  const k = useTransform(W, (w) => Math.max(0.55, Math.min(1, w / 1200)));

  // 1 · orbite + pendentif
  const scatter = useTransform(p, [0.16, 0.36], [0, 1]);
  const orbitSpin = useTransform(p, [0, 1], [0, 520]);
  const orbitOpacity = useTransform(p, [0.24, 0.38], [1, 0]);
  const orbitBlurPx = useTransform(scatter, [0, 1], [0, 14]);
  const orbitFilter = useMotionTemplate`blur(${orbitBlurPx}px)`;
  const pendantOpacity = useTransform(p, [0.1, 0.26], [1, 0]);
  const pendantBlurPx = useTransform(p, [0.1, 0.26], [0, 14]);
  const pendantFilter = useMotionTemplate`blur(${pendantBlurPx}px)`;
  const headOpacity = useTransform(p, [0.48, 0.62], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.04], [1, 0]);

  // 2 · le gros plan grandit jusqu'à la photo entière
  const appear = useTransform(p, [0.28, 0.38], [0, 1]);
  const grow = useTransform(p, [0.42, 0.8], [0, 1], { ease: easeInOut });
  const geom = useTransform([grow, W, H, k], ([g, w, h, kk]) => {
    const isWide = w >= 1024;
    const endW = Math.min(h * CAMPAIGN_RATIO - (isWide ? 0 : 0), isWide ? w - 440 : w - 32);
    const endH = endW / CAMPAIGN_RATIO;
    const w0 = 260 * kk;
    const h0 = w0 / CAMPAIGN_RATIO;
    const startCx = w * (isWide ? 0.66 : 0.5);
    const startCy = h * (isWide ? 0.5 : 0.64);
    const endCx = isWide ? w - endW / 2 - 40 : w / 2;
    const endCy = isWide ? h / 2 : Math.min(h - endH / 2 - 24, h * 0.62);
    const cw = lerp(w0, endW, g);
    const ch = lerp(h0, endH, g);
    return { w: cw, h: ch, x: lerp(startCx, endCx, g) - cw / 2, y: lerp(startCy, endCy, g) - ch / 2 };
  });
  const cardW = useTransform(geom, (v) => v.w);
  const cardH = useTransform(geom, (v) => v.h);
  const cardX = useTransform(geom, (v) => v.x);
  const cardY = useTransform(geom, (v) => v.y);
  const cardRotate = useTransform(grow, [0, 1], [-7, 0]);
  const cardScale = useTransform(appear, [0, 1], [0.6, 1]);
  const cardRadius = useTransform(grow, [0, 1], [28, 20]);
  const imgScale = useTransform(grow, [0, 1], [START_CROP.zoom, 1]);
  const imgPos = useTransform(grow, (g) => `${lerp(START_CROP.x, 50, g)}% ${lerp(START_CROP.y, 50, g)}%`);
  const textOpacity = useTransform(p, [0.8, 0.9], [0, 1]);
  const textY = useTransform(p, [0.8, 0.9], [24, 0]);
  const textMaxW = useTransform([W, H], ([w, h]) => {
    const endW = Math.min(h * CAMPAIGN_RATIO, w - 440);
    return Math.max(300, w - endW - 150);
  });

  const orbitCenter = wide ? { left: '66%', top: '50%' } : { left: '50%', top: '64%' };
  // sur téléphone la chaîne part sous le titre pour ne pas le traverser
  const pendantBox = wide
    ? { top: 0, height: `calc(${orbitCenter.top} + 50px)` }
    : { top: `calc(${orbitCenter.top} - 150px)`, height: '200px' };

  return (
    <section ref={sectionRef} className="relative bg-cream" style={{ height: '360vh' }}>
      <div ref={stageRef} className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        {/* titre de départ */}
        <motion.div
          style={{ opacity: headOpacity }}
          className={`absolute z-[1] ${
            wide ? 'left-[6%] top-1/2 -translate-y-1/2 max-w-xl' : 'inset-x-0 top-8 px-5 text-center'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-rose font-semibold mb-5">fait main · ikey.</p>
          <h1 className="font-display italic text-plum text-4xl sm:text-6xl lg:text-7xl leading-[0.98]">
            des bijoux pour <span className="text-rose">tes rituels</span> de chaque jour.
          </h1>
          {wide && (
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/produits" className="btn-primary">
                découvrir la collection
              </Link>
              <Link to="/produits?featured=true" className="btn-outline">
                nos coups de cœur
              </Link>
            </div>
          )}
        </motion.div>
        {wide && (
          <motion.p
            style={{ opacity: headOpacity }}
            className="absolute left-[6%] bottom-8 max-w-xs text-sm text-wine/60 z-[1]"
          >
            pièces faites main, livrées chez toi — payables à la réception.
          </motion.p>
        )}

        {/* orbite de gros plans + pendentif */}
        <div className="absolute w-0 h-0 z-[1]" style={orbitCenter}>
          <motion.div className="absolute left-0 top-0" style={{ rotate: orbitSpin, opacity: orbitOpacity, filter: orbitFilter }}>
            <div className="absolute left-0 top-0 campaign-orbit">
              {ORBIT_CROPS.map((crop, i) => (
                <OrbitTile key={i} crop={crop} index={i} scatter={scatter} k={k} />
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute z-[1] -translate-x-1/2"
          style={{ left: orbitCenter.left, ...pendantBox, opacity: pendantOpacity, filter: pendantFilter }}
          aria-hidden="true"
        >
          <div className="h-full flex flex-col items-center origin-top campaign-swing">
            <span className="flex-1 w-0 border-l-2 border-dashed" style={{ borderColor: GOLD }} />
            <TeardropPendant />
          </div>
        </motion.div>

        {/* fond flou de la photo */}
        <motion.div style={{ opacity: grow }} className="absolute inset-0 z-[2] overflow-hidden bg-plum">
          <img
            src={CAMPAIGN_PHOTO_SMALL}
            alt=""
            className="absolute -inset-20 w-[calc(100%+10rem)] h-[calc(100%+10rem)] object-cover blur-[38px] brightness-[0.35] saturate-[1.1]"
          />
        </motion.div>

        {/* la photo qui grandit */}
        <motion.div
          className="absolute left-0 top-0 z-[3] overflow-hidden bg-blush shadow-[0_30px_70px_-20px_rgba(75,21,40,0.45)]"
          style={{
            width: cardW,
            height: cardH,
            x: cardX,
            y: cardY,
            rotate: cardRotate,
            scale: cardScale,
            opacity: appear,
            borderRadius: cardRadius,
          }}
        >
          <motion.img
            src={CAMPAIGN_PHOTO}
            alt="mannequin portant colliers, bagues et jonc en or"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imgPos, transformOrigin: imgPos, scale: imgScale }}
          />
          <Twinkles show={showDots} />
          <AnimatePresence>
            {showDots && HOTSPOTS.map((s, i) => <Hotspot key={s.id} spot={s} index={i} />)}
          </AnimatePresence>
        </motion.div>

        {/* texte final */}
        <div
          className={`absolute z-[4] pointer-events-none ${
            wide ? 'left-[6%] top-1/2 -translate-y-1/2' : 'inset-x-0 top-8 px-5 text-center'
          }`}
        >
        <motion.div style={{ opacity: textOpacity, y: textY, maxWidth: wide ? textMaxW : undefined }} className="text-cream">
          <h2 className="font-display italic text-cream text-4xl sm:text-5xl lg:text-6xl leading-[0.98] drop-shadow-lg">
            fait main,
            <br />
            porté chaque jour.
          </h2>
          <p className="mt-5 text-cream/75 text-sm sm:text-base max-w-sm mx-auto lg:mx-0">
            façonnés et finis à la main, en petites séries. touche ses bijoux pour découvrir la collection.
          </p>
        </motion.div>
        </div>

        {/* indication de scroll */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 z-[5] flex items-center gap-3 text-[10px] tracking-[0.4em] text-wine/60"
          aria-hidden="true"
        >
          <span className="relative block w-px h-9 bg-wine/20 overflow-hidden">
            <span className="absolute inset-0 bg-rose campaign-cue" />
          </span>
          DÉFILER
        </motion.div>
      </div>
    </section>
  );
}

// Version calme pour les personnes qui préfèrent réduire les animations.
function StaticCampaign() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.8fr,1.2fr] gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-rose font-semibold mb-5">fait main · ikey.</p>
          <h1 className="font-display italic text-plum text-4xl sm:text-6xl leading-[0.98]">
            des bijoux pour <span className="text-rose">tes rituels</span> de chaque jour.
          </h1>
          <p className="mt-6 text-wine/60">touche ses bijoux pour découvrir la collection.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/produits" className="btn-primary">
              découvrir la collection
            </Link>
          </div>
        </div>
        <div className="relative rounded-[1.25rem] overflow-hidden" style={{ aspectRatio: CAMPAIGN_RATIO }}>
          <img src={CAMPAIGN_PHOTO} alt="mannequin portant colliers, bagues et jonc en or" className="absolute inset-0 w-full h-full object-cover" />
          {HOTSPOTS.map((s, i) => (
            <Hotspot key={s.id} spot={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CampaignHero() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticCampaign /> : <AnimatedCampaign />;
}

