// eslint-disable-next-line react-refresh/only-export-components
export const PALETTES: Record<string, string[]> = {
  warm: ['#2a201a', '#3d2c20', '#5a3c28', '#8a6a45'],
  cool: ['#161b22', '#1d2530', '#2a3a4d', '#506b85'],
  paper: ['#1a1815', '#2c2820', '#403a2c', '#6a5e44'],
  deep: ['#0d0d10', '#181820', '#252535', '#3d3d54'],
}

/** Portrait SVG placeholder — used in gallery cards and game cards */
export function GalleryPlaceholder({ tone, num }: { tone: string; num: string }) {
  const p = PALETTES[tone] ?? PALETTES.warm
  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="w-full h-full block transition-transform duration-[800ms] ease-[cubic-bezier(.2,.6,.2,1)]">
      <defs>
        <radialGradient id={`g-${num}`} cx="35%" cy="40%" r="80%">
          <stop offset="0%" stopColor={p[3]} stopOpacity="0.9" />
          <stop offset="55%" stopColor={p[2]} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p[0]} />
        </radialGradient>
        <linearGradient id={`l-${num}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={p[0]} stopOpacity="0" />
          <stop offset="100%" stopColor={p[0]} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill={`url(#g-${num})`} />
      <rect x="0" y="540" width="600" height="260" fill={p[1]} opacity="0.55" />
      <rect x="40" y="120" width="220" height="2" fill={p[3]} opacity="0.5" />
      <rect x="40" y="140" width="80" height="2" fill={p[3]} opacity="0.35" />
      <circle cx="430" cy="260" r="90" fill="none" stroke={p[3]} strokeWidth="1" opacity="0.45" />
      <circle cx="430" cy="260" r="40" fill={p[3]} opacity="0.18" />
      <rect x="0" y="0" width="600" height="800" fill={`url(#l-${num})`} />
      <rect x="0" y="0" width="600" height="800" fill="black" opacity="0.04" />
    </svg>
  )
}

/** Landscape placeholder — used in project / game pages */
export function ProjectPlaceholder({ tone, num, ratio = '16/10' }: { tone: string; num: string; ratio?: string }) {
  const p = PALETTES[tone] ?? PALETTES.warm
  return (
    <div className="relative w-full bg-bg-2 overflow-hidden border border-line" style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <radialGradient id={`pg-${num}`} cx="35%" cy="40%" r="80%">
            <stop offset="0%" stopColor={p[3]} stopOpacity="0.9" />
            <stop offset="55%" stopColor={p[2]} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p[0]} />
          </radialGradient>
        </defs>
        <rect width="600" height="400" fill={`url(#pg-${num})`} />
        <rect x="0" y="270" width="600" height="130" fill={p[1]} opacity="0.55" />
        <circle cx="430" cy="160" r="60" fill="none" stroke={p[3]} strokeWidth="1" opacity="0.45" />
        <circle cx="430" cy="160" r="24" fill={p[3]} opacity="0.18" />
        <rect x="40" y="60" width="180" height="2" fill={p[3]} opacity="0.5" />
      </svg>
    </div>
  )
}
