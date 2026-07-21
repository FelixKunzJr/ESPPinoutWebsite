import type { ReactNode } from 'react'

// Brand lockup: chip icon (3x3 pin grid with a green signal diagonal) plus the
// ESP32 / PINOUT STUDIO wordmark. Colors follow the theme via the --logo-*
// variables in index.css; the favicon is a standalone copy of the same icon.

export function LogoIcon({ size = 34 }: { size?: number }) {
  const pins: ReactNode[] = []
  const centers = [19, 27.7, 36.3, 45]
  for (const c of centers) {
    pins.push(<rect key={`t${c}`} x={c - 2.3} y={3} width={4.6} height={10} rx={2.3} />)
    pins.push(<rect key={`b${c}`} x={c - 2.3} y={51} width={4.6} height={10} rx={2.3} />)
    pins.push(<rect key={`l${c}`} x={3} y={c - 2.3} width={10} height={4.6} rx={2.3} />)
    pins.push(<rect key={`r${c}`} x={51} y={c - 2.3} width={10} height={4.6} rx={2.3} />)
  }
  const dots: ReactNode[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      dots.push(
        <circle key={`${r}${c}`} cx={32 + (c - 1) * 9.5} cy={32 + (r - 1) * 9.5} r={3.3}
          fill={r + c === 2 ? 'var(--logo-green)' : '#f8fafc'} />,
      )
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}>
      {/* Legs get the same silhouette ring as the body so they read on dark UIs */}
      <g fill="var(--logo-body)" stroke="var(--logo-ring)" strokeWidth={1.5}>{pins}</g>
      <rect x={11} y={11} width={42} height={42} rx={10} fill="var(--logo-body)"
        stroke="var(--logo-ring)" strokeWidth={1.5} />
      {dots}
    </svg>
  )
}

export function Logo({ iconSize = 58 }: { iconSize?: number }) {
  return (
    <span className="flex items-center gap-3">
      <LogoIcon size={iconSize} />
      <span className="flex flex-col" style={{ gap: 3 }}>
        <span className="font-extrabold leading-none" style={{ fontSize: 33, letterSpacing: 0.2, color: 'var(--logo-ink)' }}>
          ESP<span style={{ color: 'var(--logo-green)' }}>32</span>
        </span>
        <span className="font-medium leading-none" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11.5, letterSpacing: 5, color: 'var(--logo-ink)', opacity: 0.8 }}>
          PINOUT STUDIO
        </span>
      </span>
    </span>
  )
}
