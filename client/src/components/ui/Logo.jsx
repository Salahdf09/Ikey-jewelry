// Recreated as inline SVG (not a raster image) so it stays crisp at every
// size used across the site — compact in the nav, large on the login page —
// and can inherit the page's own web fonts for the lettering.
export default function Logo({ size = 48, tone = 'gold', className = '' }) {
  const ring = tone === 'light' ? '#F6E3A1' : '#B8860B';
  const textFill = `url(#ikeyGold-${tone})`;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`ikey-logo shrink-0 ${className}`}
      role="img"
      aria-label="ikey. jewelry"
    >
      <defs>
        <linearGradient id={`ikeyGold-${tone}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6E3A1" />
          <stop offset="35%" stopColor="#D4A657" />
          <stop offset="60%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#F0D68A" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="86" fill="none" stroke={ring} strokeWidth="1.6" opacity="0.85" />

      <g transform="translate(100, 62)" fill={textFill}>
        <path d="M-22 4 L-14 -14 L-6 0 L0 -18 L6 0 L14 -14 L22 4 Q0 -2 -22 4 Z" />
        <circle cx="-14" cy="-16" r="2.4" />
        <circle cx="0" cy="-20" r="2.6" />
        <circle cx="14" cy="-16" r="2.4" />
      </g>

      <text
        x="100"
        y="112"
        textAnchor="middle"
        fill={textFill}
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="34"
        fontWeight="600"
        letterSpacing="10"
      >
        IKEY
      </text>

      <text
        x="100"
        y="132"
        textAnchor="middle"
        fill={textFill}
        fontFamily="'Nunito Sans', sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="4"
      >
        • JEWELRY •
      </text>

      <g stroke={textFill} strokeWidth="1">
        <line x1="70" y1="146" x2="90" y2="146" />
        <line x1="110" y1="146" x2="130" y2="146" />
      </g>
      <path
        d="M100 150 c-2.2 -2.4 -6 -1 -6 2 c0 2.6 6 6.4 6 6.4 s6 -3.8 6 -6.4 c0 -3 -3.8 -4.4 -6 -2Z"
        fill={textFill}
      />

      <text
        x="100"
        y="168"
        textAnchor="middle"
        fill={textFill}
        fontFamily="'Nunito Sans', sans-serif"
        fontSize="7.5"
        fontWeight="500"
        letterSpacing="2.5"
        opacity="0.85"
      >
        TIMELESS BEAUTY
      </text>

      <g className="ikey-logo-sparkle" fill={textFill} style={{ transformOrigin: '162px 44px' }}>
        <path d="M162 30 L165 41 L176 44 L165 47 L162 58 L159 47 L148 44 L159 41 Z" />
      </g>
      <circle className="ikey-logo-sparkle-sm" cx="176" cy="30" r="2" fill={textFill} />

      <path
        d="M34 156 c-3 -3.4 -8.6 -1.4 -8.6 3 c0 3.8 8.6 9.2 8.6 9.2 s8.6 -5.4 8.6 -9.2 c0 -4.4 -5.6 -6.4 -8.6 -3Z"
        fill={textFill}
        opacity="0.9"
      />
    </svg>
  );
}
