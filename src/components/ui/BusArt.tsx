/** Side-view illustration of the coach, used in the hero and journey sections. */
export default function BusArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 170" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bus-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB648" />
          <stop offset="0.55" stopColor="#FF5E62" />
          <stop offset="1" stopColor="#D6246E" />
        </linearGradient>
        <linearGradient id="bus-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E1D5C" />
          <stop offset="1" stopColor="#160C36" />
        </linearGradient>
        <linearGradient id="bus-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* headlight beam */}
      <path d="M418 112 L440 96 L440 140 Z" fill="url(#bus-beam)" opacity="0.9" />
      {/* shadow */}
      <ellipse cx="210" cy="156" rx="190" ry="8" fill="#000" opacity="0.35" />
      {/* body */}
      <path d="M20 40 Q20 18 44 18 H372 Q402 18 414 46 L424 84 Q428 98 428 112 V128 Q428 140 416 140 H32 Q20 140 20 128 Z" fill="url(#bus-body)" />
      {/* roof rail */}
      <rect x="60" y="10" width="280" height="10" rx="5" fill="#3A2470" />
      {/* windows */}
      <path d="M36 34 H360 Q384 34 394 56 L402 80 H36 Z" fill="url(#bus-glass)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={84 + i * 48} y="34" width="4" height="46" fill="#FF6F7F" />
      ))}
      {/* window glints */}
      <path d="M50 38 L70 38 L52 76 L36 76 Z" fill="#fff" opacity="0.08" />
      <path d="M200 38 L214 38 L196 76 L184 76 Z" fill="#fff" opacity="0.07" />
      {/* warm cabin lights */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={60 + i * 48} cy="70" r="2.2" fill="#FFD27A" opacity="0.9" />
      ))}
      {/* door */}
      <rect x="352" y="44" width="30" height="88" rx="4" fill="none" stroke="#B51C5C" strokeWidth="2" />
      {/* stripe */}
      <path d="M20 96 H426" stroke="#120A2A" strokeWidth="8" />
      <path d="M20 104 H426" stroke="#FFE2A6" strokeWidth="2" opacity="0.7" />
      {/* headlight + tail light */}
      <rect x="414" y="112" width="12" height="8" rx="3" fill="#FFF3C9" />
      <rect x="20" y="110" width="8" height="12" rx="2" fill="#FF3B3B" />
      {/* wheels */}
      {[100, 330].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="140" r="22" fill="#120A2A" />
          <circle cx={cx} cy="140" r="11" fill="#6B5C8F" />
          <circle cx={cx} cy="140" r="4" fill="#D9D0EE" />
        </g>
      ))}
    </svg>
  )
}
