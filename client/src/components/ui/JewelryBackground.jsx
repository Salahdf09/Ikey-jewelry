// Ambient, site-wide decoration — tiny gem/sparkle silhouettes drifting
// slowly behind the page content. Purely CSS-driven (transform + opacity
// only, so it stays on the GPU compositor and never touches layout), fixed
// to the viewport so it costs nothing on scroll, and it quietly goes still
// under prefers-reduced-motion via the global rule in index.css rather than
// needing its own media query here.
//
// Positions/sizes/delays are hand-tuned (not Math.random()) so the
// arrangement stays the same — and stays deliberately sparse — on every
// mount instead of reshuffling into a denser-looking cluster by chance.
const GOLD = '#D4A657';
const GOLD_LIGHT = '#F0D68A';
const CREAM = '#FFF9FB';

const PIECES = [
  { x: 6, y: 14, size: 12, kind: 'diamond', tone: GOLD, opacity: 0.16, drift: 'a', duration: 28, delay: 0 },
  { x: 92, y: 10, size: 7, kind: 'dot', tone: CREAM, opacity: 0.22, drift: 'b', duration: 20, delay: 1.4, sparkle: true },
  { x: 16, y: 38, size: 20, kind: 'facet', tone: GOLD, opacity: 0.1, drift: 'c', duration: 34, delay: 2.2, blur: 1 },
  { x: 80, y: 30, size: 10, kind: 'diamond', tone: CREAM, opacity: 0.18, drift: 'b', duration: 24, delay: 0.6 },
  { x: 48, y: 8, size: 6, kind: 'dot', tone: GOLD_LIGHT, opacity: 0.2, drift: 'a', duration: 19, delay: 3.1, sparkle: true },
  { x: 4, y: 62, size: 8, kind: 'dot', tone: GOLD, opacity: 0.16, drift: 'c', duration: 22, delay: 0.9 },
  { x: 96, y: 55, size: 16, kind: 'facet', tone: CREAM, opacity: 0.08, drift: 'a', duration: 36, delay: 1.8, blur: 2 },
  { x: 62, y: 72, size: 9, kind: 'diamond', tone: GOLD, opacity: 0.14, drift: 'b', duration: 26, delay: 2.6 },
  { x: 24, y: 82, size: 7, kind: 'dot', tone: CREAM, opacity: 0.2, drift: 'c', duration: 21, delay: 0.3, sparkle: true },
  { x: 88, y: 80, size: 11, kind: 'diamond', tone: GOLD_LIGHT, opacity: 0.15, drift: 'a', duration: 30, delay: 1.1 },
  { x: 38, y: 92, size: 22, kind: 'fragment', tone: GOLD, opacity: 0.12, drift: 'b', duration: 32, delay: 2.0 },
  { x: 70, y: 48, size: 5, kind: 'dot', tone: GOLD, opacity: 0.18, drift: 'c', duration: 17, delay: 3.6, sparkle: true },
  { x: 10, y: 90, size: 9, kind: 'diamond', tone: CREAM, opacity: 0.14, drift: 'a', duration: 27, delay: 0.5 },
  { x: 55, y: 55, size: 18, kind: 'fragment', tone: CREAM, opacity: 0.07, drift: 'c', duration: 33, delay: 2.9 },
];

function Shape({ kind, size, tone }) {
  if (kind === 'dot') {
    return (
      <div
        className="rounded-full"
        style={{ width: size, height: size, background: tone, boxShadow: `0 0 ${size}px ${tone}` }}
      />
    );
  }

  if (kind === 'diamond') {
    return (
      <svg width={size} height={size} viewBox="0 0 10 10">
        <polygon points="5,0 10,4 5,10 0,4" fill={tone} opacity="0.7" />
        <polygon points="5,0 10,4 5,4" fill={tone} opacity="0.4" />
      </svg>
    );
  }

  if (kind === 'facet') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <polygon
          points="10,1 18,6 18,14 10,19 2,14 2,6"
          fill="none"
          stroke={tone}
          strokeWidth="0.6"
        />
        <line x1="10" y1="1" x2="10" y2="19" stroke={tone} strokeWidth="0.4" />
      </svg>
    );
  }

  // fragment — a short tapered sliver, like a splinter of gold leaf
  return (
    <svg width={size} height={size * 0.3} viewBox="0 0 24 7">
      <path d="M0 3.5 Q 12 0 24 3.5 Q 12 7 0 3.5 Z" fill={tone} opacity="0.55" />
    </svg>
  );
}

// `local`: renders as an `absolute inset-0` layer instead of a viewport-
// `fixed` one, for mounting inside an opaque section (e.g. the dark Hero)
// that the site-wide fixed instance can't show through — that one sits at
// -z-10 behind the whole page, so it's invisible wherever a section paints
// its own solid background over it.
export default function JewelryBackground({ local = false }) {
  return (
    // Negative z-index is deliberate: a static-flow sibling with no
    // z-index of its own still paints above a positioned z:0 element, so
    // z:0 here would sit ON TOP of page content instead of behind it.
    <div
      className={`${local ? 'absolute' : 'fixed'} inset-0 -z-10 overflow-hidden pointer-events-none`}
      aria-hidden="true"
    >
      {PIECES.map((p, i) => (
        // Drift (position) lives on this outer element; sparkle (opacity/scale
        // pulse) lives on the inner one when present — two elements, not two
        // animations fighting over the same `animation` shorthand on one.
        <div
          key={i}
          className={`absolute jewel-drift-${p.drift}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.sparkle ? (
            <div className="jewel-sparkle" style={{ animationDelay: `${p.delay * 0.7}s` }}>
              <Shape kind={p.kind} size={p.size} tone={p.tone} />
            </div>
          ) : (
            <Shape kind={p.kind} size={p.size} tone={p.tone} />
          )}
        </div>
      ))}
    </div>
  );
}
