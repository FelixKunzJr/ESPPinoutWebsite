import { useEffect, useRef, type ReactNode } from 'react'
import { useApp } from '../../context/AppContext'
import { filterPins } from '../../utils/filterPins'
import { useMediaQuery } from '../../utils/useMediaQuery'
import type { Pin, Chip, LayoutPin } from '../../types/chip'
import { ROW_H, getBadge, connectorColor, sevStyle, SpecialBadge, ConstraintChips, FunctionBadges, primaryConstraint, resolveModule, pinActivationProps, pinAriaLabel } from './shared'

// ─── Left / right pin row ─────────────────────────────────────────────────────

interface PinRowProps {
  layoutPin: LayoutPin
  pin: Pin | undefined
  side: 'left' | 'right'
  isSelected: boolean
  isFiltered: boolean
  mappingLabel?: string
  compact?: boolean
  onClick: () => void
}

function PinRow({ layoutPin, pin, side, isSelected, isFiltered, mappingLabel, compact, onClick }: PinRowProps) {
  const color = pin ? connectorColor(pin) : '#4b5563'

  const hasDanger  = !!pin?.constraints.some(c => c.severity === 'danger')
  const hasWarning = !hasDanger && !!pin?.constraints.length

  const constraintChips = pin ? <ConstraintChips pin={pin} compact={compact} /> : null

  const functionBadges = pin
    ? <FunctionBadges pin={pin} side={side} mappingLabel={mappingLabel} compact={compact} />
    : <SpecialBadge label={layoutPin.label ?? 'NC'} />

  const pinNumBox = (
    <div className="flex-shrink-0 flex items-center justify-center font-mono"
      style={{ width: 17, height: 17, background: 'var(--dg-chip-bg)', border: '1px solid var(--dg-chip-border)', borderRadius: 2, fontSize: 7.5, fontWeight: 700, color: 'var(--dg-chip-text)' }}>
      {layoutPin.pinNumber}
    </div>
  )

  // Surface solder pads get a square gold-rimmed marker instead of the round
  // through-hole dot - you cannot put a header pin here, only solder a wire.
  const solderDot = layoutPin.isSurfacePad ? (
    <div className="flex-shrink-0" title="Solder pad only - no header pin. Solder a wire directly."
      style={{ width: 9, height: 9, background: color, border: '1.5px solid #caa83a', borderRadius: 2, boxShadow: `0 0 5px ${color}60` }} />
  ) : (
    <div className="flex-shrink-0 rounded-full"
      style={{ width: 9, height: 9, background: color, boxShadow: `0 0 5px ${color}80` }} />
  )

  const connLine = (
    <div className="flex-shrink-0" style={{ width: compact ? 8 : 14, height: 1.5, background: color + '80' }} />
  )

  const isActive = isFiltered || !pin

  // Subtle row-level tint for constrained pins
  const rowBg = hasDanger
    ? 'rgba(239,68,68,0.07)'
    : hasWarning
    ? 'rgba(245,158,11,0.07)'
    : undefined

  return (
    <div
      {...pinActivationProps(onClick, pinAriaLabel(pin, layoutPin.label ?? 'NC'), pin?.gpio)}
      className={`pin-row flex items-center select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40 is-selected' : ''}
      `}
      style={{
        height: ROW_H,
        borderBottom: '1px solid var(--dg-row-border)',
        background: isSelected ? undefined : rowBg,
      }}
    >
      {side === 'left' ? (
        <>
          <div className="flex-1 flex items-center justify-end gap-[3px] min-w-0 overflow-hidden pr-1.5">
            {constraintChips}
            {functionBadges}
          </div>
          {connLine}
          {pinNumBox}
          <div style={{ width: compact ? 3 : 5, flexShrink: 0 }} />
          {solderDot}
        </>
      ) : (
        <>
          {solderDot}
          <div style={{ width: compact ? 3 : 5, flexShrink: 0 }} />
          {pinNumBox}
          {connLine}
          <div className="flex-1 flex items-center justify-start gap-[3px] min-w-0 overflow-hidden pl-1.5">
            {functionBadges}
            {constraintChips}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Top / bottom pin column ──────────────────────────────────────────────────

interface EdgePinColProps {
  layoutPin: LayoutPin
  pin: Pin | undefined
  colWidth: number
  edge: 'top' | 'bottom'
  isSelected: boolean
  isFiltered: boolean
  compact?: boolean
  onClick: () => void
}

function EdgePinCol({ layoutPin, pin, colWidth, edge, isSelected, isFiltered, compact, onClick }: EdgePinColProps) {
  const color = pin ? connectorColor(pin) : '#4b5563'
  const shortLabel = pin
    ? (pin.names.find(n => /^GPIO\d/.test(n)) ?? pin.names[0] ?? `${pin.gpio}`)
    : (layoutPin.label ?? 'NC')

  const warn = pin ? primaryConstraint(pin) : null
  const isActive = isFiltered || !pin

  const stub = <div style={{ width: 1.5, height: 12, background: color + '70' }} />
  const dot = <div className="rounded-full" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 4px ${color}60` }} />
  const num = (
    <div className="font-mono" style={{ fontSize: 7.5, fontWeight: 700, color: 'var(--dg-chip-text)' }}>
      {layoutPin.pinNumber}
    </div>
  )
  // Compact icon-only constraint marker - the vertical word chips were unreadable
  // at this size; the full detail lives in the pin panel and the side rows.
  const warnIcon = warn ? (
    <span title={warn.title} className="font-mono font-bold rounded-sm flex items-center justify-center flex-shrink-0"
      style={{ background: sevStyle(warn.sev).bg, color: sevStyle(warn.sev).fg, border: `1px solid ${sevStyle(warn.sev).bd}`,
        width: 14, height: 14, fontSize: 9, lineHeight: 1 }}>
      {sevStyle(warn.sev).icon}
    </span>
  ) : <div style={{ width: 14, height: 14 }} />
  // Full function info (the USP) on the bottom/top pads too, not just the GPIO
  // name: every alternate function as its own vertical colored badge, GPIO name
  // first, stacked reading outward from the chip body.
  const orderedNames = pin
    ? (compact ? [shortLabel] : [shortLabel, ...pin.names.filter(n => n !== shortLabel)])
    : [layoutPin.label ?? 'NC']
  const vbadge = (name: string, isPrimary: boolean) => {
    const b = getBadge(name)
    return (
      <span
        key={name}
        className="font-mono font-bold rounded-sm"
        style={{
          background: b.bg, color: b.text,
          fontSize: isPrimary ? 9 : 8,
          padding: isPrimary ? '3px 3px' : '2px 2.5px',
          writingMode: 'vertical-rl',
          transform: edge === 'bottom' ? 'rotate(180deg)' : undefined,
          lineHeight: 1.1,
        }}
      >
        {name}
      </span>
    )
  }
  // For the bottom edge the stack grows downward, so the GPIO name (primary)
  // must render first (closest to the pad); for the top edge, reversed.
  const badgeStack = orderedNames.map((n, i) => vbadge(n, i === 0))
  const label = <span className="flex flex-col items-center" style={{ gap: 3 }}>{
    edge === 'bottom' ? badgeStack : [...badgeStack].reverse()
  }</span>

  // Reading order mirrors the physical direction: bottom edge grows downward,
  // top edge grows upward from the chip body.
  const parts = edge === 'bottom'
    ? [stub, dot, num, warnIcon, label]
    : [label, warnIcon, num, dot, stub]

  return (
    <div
      {...pinActivationProps(onClick, pinAriaLabel(pin, layoutPin.label ?? 'NC'), pin?.gpio)}
      className={`pin-row rounded flex flex-col items-center select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40 is-selected' : ''}
      `}
      style={{ width: colWidth, gap: 3, paddingBottom: edge === 'bottom' ? 4 : 0, paddingTop: edge === 'top' ? 4 : 0 }}
    >
      {parts.map((p, i) => <span key={i} className="flex justify-center">{p}</span>)}
    </div>
  )
}

// ─── Solder-pad strip (front-surface or underside pads, wire-solder only) ─────

function SolderPadStrip({ pads, caption, borderColor, maxW, pinByGpio, selectedPin, filteredSet, onToggle }: {
  pads: LayoutPin[]
  caption: string
  borderColor: string
  maxW: number
  pinByGpio: Map<number, Pin>
  selectedPin: Pin | null
  filteredSet: Set<number>
  onToggle: (pin: Pin | undefined) => void
}) {
  const withPins = pads.filter(lp => lp.gpio !== undefined && pinByGpio.has(lp.gpio))
  if (withPins.length === 0) return null
  return (
    <div className="flex flex-col items-center" style={{ marginTop: 8, maxWidth: maxW }}>
      <span className="font-mono" style={{ fontSize: 8.5, color: 'var(--dg-muted)', letterSpacing: 0.3, marginBottom: 4 }}>
        {caption}
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {withPins.map(lp => {
          const pin = pinByGpio.get(lp.gpio!)!
          const color = connectorColor(pin)
          const { bg, text } = getBadge(pin.names.find(n => /^GPIO\d/.test(n)) ?? pin.names[0])
          const warn = primaryConstraint(pin)
          const isSelected = selectedPin?.gpio === pin.gpio
          const isActive = filteredSet.has(pin.gpio)
          return (
            <div
              key={lp.pinNumber}
              {...pinActivationProps(() => onToggle(pin), pinAriaLabel(pin, `pad ${lp.pinNumber}`), pin.gpio)}
              className={`pin-pad flex items-center gap-1.5 select-none rounded-md transition-colors
                ${isActive ? '' : 'opacity-[0.07]'}
                ${isSelected ? 'bg-violet-950/60 is-selected' : ''}`}
              style={{ padding: '3px 7px', border: `1px dashed ${borderColor}`, background: isSelected ? undefined : 'var(--dg-chip-bg)' }}
            >
              <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, background: color, boxShadow: `0 0 4px ${color}60` }} />
              <span className="font-mono" style={{ fontSize: 7.5, fontWeight: 700, color: 'var(--dg-chip-text)' }}>{lp.pinNumber}</span>
              <span className="font-mono font-bold rounded-sm" style={{ background: bg, color: text, fontSize: 9, lineHeight: '15px', padding: '0 4px' }}>
                {pin.names.find(n => /^GPIO\d/.test(n)) ?? pin.names[0]}
              </span>
              {warn && (
                <span title={warn.title} className="font-mono font-bold rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: sevStyle(warn.sev).bg, color: sevStyle(warn.sev).fg, border: `1px solid ${sevStyle(warn.sev).bd}`,
                    width: 12, height: 12, fontSize: 8, lineHeight: 1 }}>
                  {sevStyle(warn.sev).icon}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SVG Chip body ────────────────────────────────────────────────────────────

// Square-wave serpentine - reads as an etched meander PCB antenna trace.
function meanderPath(x0: number, x1: number, yTop: number, yBot: number): string {
  const teeth = Math.max(5, Math.round((x1 - x0) / 11))
  const w = (x1 - x0) / teeth
  let d = `M ${x0},${yBot}`
  for (let i = 0; i <= teeth; i++) {
    const x = x0 + i * w
    const y = i % 2 === 0 ? yTop : yBot
    d += ` L ${x.toFixed(1)},${y.toFixed(1)}`
    if (i < teeth) d += ` L ${(x + w).toFixed(1)},${y.toFixed(1)}`
  }
  return d
}

// Deterministic 8×8 data-matrix-ish pattern, seeded from the chip id.
function dataMatrix(seed: string, x: number, y: number, cell: number): ReactNode {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) }
  const cells: ReactNode[] = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      // Solid L-finder on left + bottom edge (real data-matrix look)
      const finder = c === 0 || r === 7
      h = Math.imul(h ^ (r * 8 + c), 16777619)
      const on = finder || (h & 0x10000) !== 0
      if (on) cells.push(<rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill="#2a3a48" />)
    }
  }
  return <g opacity="0.85">{cells}</g>
}

function ChipBody({ chip, sideHeight, bottomCount, width }: { chip: Chip; sideHeight: number; bottomCount: number; width: number }) {
  const m = resolveModule(chip)
  const isMini = m.form === 'mini'
  const uid = chip.id

  const W = width
  const H = sideHeight
  const cx = W / 2

  // Layout zones
  const pcbBorder = 7
  // The antenna keep-out is a fixed physical size (about 6.2 mm on WROOM and
  // WROVER, the notched tab about 4.6 mm on MINI), so with known real module
  // dimensions its share of the render scales like the real thing.
  const mm = chip.packageLayout?.bodyMm
  const antennaH  = mm
    ? Math.round(Math.min(130, Math.max(40, H * (isMini ? 4.6 : 6.2) / mm.h)))
    : isMini ? 56 : 46
  const padH      = 14                  // bottom gold castellated pads
  const shieldL   = pcbBorder
  const shieldW   = W - pcbBorder * 2
  const shieldTop = antennaH
  const shieldBot = H - padH
  const shieldH   = shieldBot - shieldTop

  // PCB substrate palette
  const pcb = m.pcb === 'black'
    ? { a: '#1c1e24', b: '#0c0d11', edge: '#33363f', silk: '#44474f' }
    : { a: '#1b331b', b: '#0e1e0e', edge: '#2c5c2e', silk: '#3a6a3c' }

  // Antenna trace tint, lifted toward the family accent
  const traceMain = m.pcb === 'black' ? '#6a6e78' : '#3f7a36'
  const traceDim  = m.pcb === 'black' ? '#4a4e58' : '#2c5a28'

  // Branding band sits in the upper third so the metal reads as a real lid below it.
  const brandY = shieldTop + Math.min(shieldH * 0.34, 86)

  // Spot-weld dimple ring - the signature detail of a real RF shield can lid.
  const dimples: ReactNode[] = []
  {
    const inset = 6
    const x0 = shieldL + inset, x1 = shieldL + shieldW - inset
    const y0 = shieldTop + inset, y1 = shieldBot - inset
    const nx = Math.max(3, Math.round((x1 - x0) / 27))
    const ny = Math.max(3, Math.round((y1 - y0) / 27))
    const put = (x: number, y: number, k: string) =>
      dimples.push(
        <g key={k}>
          <circle cx={x} cy={y} r={1.7} fill="#39444f" />
          <circle cx={x} cy={y - 0.45} r={0.8} fill="#d4dee7" opacity="0.5" />
        </g>,
      )
    for (let i = 0; i <= nx; i++) { const x = x0 + ((x1 - x0) * i) / nx; put(x, y0, `t${i}`); put(x, y1, `b${i}`) }
    for (let j = 1; j < ny; j++) { const y = y0 + ((y1 - y0) * j) / ny; put(x0, y, `l${j}`); put(x1, y, `r${j}`) }
  }

  return (
    <svg width={W} height={H} style={{ flexShrink: 0, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Lit-from-upper-left brushed metal */}
        <radialGradient id={`metal-${uid}`} cx="0.4" cy="0.28" r="0.95">
          <stop offset="0%"   stopColor="#c3cfda" />
          <stop offset="40%"  stopColor="#96a5b3" />
          <stop offset="76%"  stopColor="#5f6d7a" />
          <stop offset="100%" stopColor="#39434e" />
        </radialGradient>
        <linearGradient id={`pcb-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={pcb.a} />
          <stop offset="100%" stopColor={pcb.b} />
        </linearGradient>
        <linearGradient id={`pad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e3bd49" />
          <stop offset="100%" stopColor="#9a6e18" />
        </linearGradient>
        {/* Fine brushed-metal grain */}
        <pattern id={`brush-${uid}`} x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0"   x2="2" y2="0"   stroke="#ffffff" strokeWidth="0.11" opacity="0.09" />
          <line x1="0" y1="1"   x2="2" y2="1"   stroke="#0a0f14" strokeWidth="0.11" opacity="0.07" />
        </pattern>
      </defs>

      {/* ── PCB substrate ── */}
      <rect width={W} height={H} fill={`url(#pcb-${uid})`} rx="3" />
      <rect x="1" y="1" width={W-2} height={H-2} fill="none" stroke={pcb.edge} strokeWidth="1.5" rx="3" />
      <rect x={pcbBorder-2} y={pcbBorder-2} width={W-pcbBorder*2+4} height={H-pcbBorder*2+4}
        fill="none" stroke={pcb.silk} strokeWidth="0.5" opacity="0.55" rx="2" />

      {/* ── Antenna zone (PCB meander on bare laminate above the shield) ── */}
      {isMini ? (
        <>
          <path d={meanderPath(shieldL+6, shieldL + shieldW*0.74, 12, antennaH-13)}
            fill="none" stroke={traceMain} strokeWidth="1.6" strokeLinecap="square" />
          <path d={meanderPath(shieldL+6, shieldL + shieldW*0.74, 16, antennaH-13)}
            fill="none" stroke={traceDim} strokeWidth="1" strokeLinecap="square" opacity="0.5" />
          <text x={shieldL + shieldW*0.74 + 7} y={antennaH/2 + 1} fontSize="6" fontFamily="monospace"
            fill={m.accent} letterSpacing="1" fontWeight="700" opacity="0.85">ANT</text>
        </>
      ) : (
        <>
          <path d={meanderPath(shieldL+10, shieldW+shieldL-10, 9, antennaH-11)}
            fill="none" stroke={traceMain} strokeWidth="1.6" strokeLinecap="square" />
          <path d={meanderPath(shieldL+10, shieldW+shieldL-10, 14, antennaH-11)}
            fill="none" stroke={traceDim} strokeWidth="1" strokeLinecap="square" opacity="0.55" />
          <text x={cx} y={antennaH-3} textAnchor="middle" fontSize="6" fontFamily="monospace"
            fill={pcb.silk} letterSpacing="1.5" fontWeight="600">PCB ANTENNA</text>
        </>
      )}

      {/* ── RF shield can ── */}
      {/* cast shadow */}
      <rect x={shieldL+2} y={shieldTop+3} width={shieldW} height={shieldH} fill="#000" rx="3" opacity="0.45" />
      {/* brushed metal lid */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill={`url(#metal-${uid})`} rx="3" />
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill={`url(#brush-${uid})`} rx="3" />
      {/* diagonal specular sweep */}
      <polygon
        points={`${shieldL},${shieldTop + shieldH*0.10} ${shieldL + shieldW*0.55},${shieldTop} ${shieldL + shieldW*0.72},${shieldTop} ${shieldL},${shieldTop + shieldH*0.40}`}
        fill="#f2f7fb" opacity="0.07" />
      {/* crimped lid edge: bright top/left, dark bottom/right */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={2.5} fill="#e6eef5" opacity="0.55" rx="1.5" />
      <rect x={shieldL} y={shieldTop+2.5} width={2} height={shieldH-3} fill="#d3dee7" opacity="0.28" />
      <rect x={shieldL+shieldW-2} y={shieldTop} width={2} height={shieldH} fill="#16222b" opacity="0.38" />
      <rect x={shieldL} y={shieldTop+shieldH-2.5} width={shieldW} height={2.5} fill="#16222b" opacity="0.38" />
      {/* inner crimp seam */}
      <rect x={shieldL+3.5} y={shieldTop+3.5} width={shieldW-7} height={shieldH-7}
        fill="none" stroke="#36424d" strokeWidth="0.6" opacity="0.5" rx="2" />
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill="none" stroke="#9fadb9" strokeWidth="1" rx="3" />
      {/* spot-weld dimple ring */}
      {dimples}

      {/* ── Laser-etched branding ── */}
      <text x={cx} y={brandY-16} textAnchor="middle" fontSize="7.5" fontFamily="'Arial Narrow',sans-serif"
        fontWeight="700" fill="#33424f" letterSpacing="3.5" opacity="0.9">ESPRESSIF</text>
      <text x={cx} y={brandY+1} textAnchor="middle"
        fontSize={m.name.length > 15 ? 11 : 13.5} fontFamily="'Arial Narrow','Courier New',monospace"
        fontWeight="800" fill="#1b2933" letterSpacing="0.5">{m.name}</text>
      <text x={cx} y={brandY+15} textAnchor="middle" fontSize="6.8" fontFamily="monospace"
        fill={m.accent} letterSpacing="0.6" fontWeight="700" opacity="0.95">{m.radios}</text>
      <text x={cx} y={brandY+27} textAnchor="middle" fontSize="6" fontFamily="monospace"
        fill="#4a5a6a" letterSpacing="0.3">{m.arch}</text>

      {/* ── QR/data-matrix + regulatory marks near the lid bottom ── */}
      {dataMatrix(uid, shieldL+9, shieldBot-25, 2.1)}
      <text x={shieldL+30} y={shieldBot-17} fontSize="8.5" fontFamily="serif" fontWeight="700" fill="#465564">CE</text>
      <text x={shieldL+46} y={shieldBot-17} fontSize="6.5" fontFamily="monospace" fontWeight="700" fill="#465564">FCC</text>
      <text x={shieldL+30} y={shieldBot-7} fontSize="5" fontFamily="monospace" fill="#3a4a59" letterSpacing="0.2">2AC7Z-{m.name.replace(/^ESP32-?/,'')}</text>

      {/* ── Gold castellated pad strip ── */}
      <rect x={shieldL} y={H-padH} width={shieldW} height={padH} fill={`url(#pad-${uid})`} />
      <rect x={shieldL} y={H-padH} width={shieldW} height={2.5} fill="#e6c659" />
      {Array.from({ length: bottomCount+1 }, (_, i) => {
        const colW = shieldW / bottomCount
        return <rect key={i} x={shieldL + i*colW - 0.6} y={H-padH} width={1.2} height={padH} fill={pcb.b} />
      })}
    </svg>
  )
}

// ─── Dev-board body (PCB with mounted module, USB, buttons, header rails) ───────

function BoardBody({ chip, sideHeight, width, selectedPin }: { chip: Chip; sideHeight: number; width: number; selectedPin: Pin | null }) {
  const m = resolveModule(chip)
  const uid = chip.id
  const W = width
  const H = sideHeight
  const cx = W / 2
  const rows = Math.max(1, Math.round(H / ROW_H))

  // Appearance hints from the board spec: DevKits have the USB at the bottom
  // and a shielded module; compact boards like the S3-Zero have the USB at the
  // top, a bare chip and a ceramic antenna at the far end.
  const usbTop = m.usbEdge === 'top'
  const bare = !!m.bare

  const usbW = 26, usbH = 13
  // On a real DevKit the module covers about two thirds of the board width and
  // half its length (18 of 27.9 mm across on a DevKitC), centered on the PCB.
  const modW = Math.min(W - 26, Math.round(W * 0.66))
  const modL = Math.round((W - modW) / 2)
  const modTop = usbTop ? 40 : 16
  const modH = Math.round(Math.min(H * 0.5, Math.max(70, modW / 0.71)))
  const modCx = cx
  const chipShort = m.name.replace(/^Dev board · /, '').replace(/^ESP32-?/, 'ESP32 ').replace(/^Waveshare /, '')

  // Anchors that flip with the USB edge
  const usbY = usbTop ? -4 : H - usbH
  const btnY = usbTop ? usbH + 6 : H - 52
  const btnLabelY = usbTop ? usbH + 28 : H - 30
  const ledCy = usbTop ? usbH + 12 : H - 46
  const chipCy = bare ? H * 0.42 : 0
  const nameY = bare ? chipCy + 42 : modTop + modH + 26

  return (
    <svg width={W} height={H} style={{ flexShrink: 0, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`board-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141a22" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
        <linearGradient id={`bshield-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#c2cdd8" /><stop offset="30%" stopColor="#97a6b5" />
          <stop offset="100%" stopColor="#5b6774" />
        </linearGradient>
        <linearGradient id={`usb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9d2db" /><stop offset="100%" stopColor="#7c8896" />
        </linearGradient>
      </defs>

      {/* PCB substrate */}
      <rect width={W} height={H} rx="7" fill={`url(#board-${uid})`} />
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="7" fill="none" stroke="#2b3543" strokeWidth="1.5" />
      <rect x="4.5" y="4.5" width={W - 9} height={H - 9} rx="5" fill="none" stroke={m.accent} strokeWidth="0.75" opacity="0.35" />

      {/* Mounting holes in the corners (compact bare boards have none) */}
      {!bare && ([[11, 11], [W - 11, 11], [11, H - 11], [W - 11, H - 11]] as [number, number][]).map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r={4} fill="#05080c" stroke="#39434f" strokeWidth="1" /><circle cx={x} cy={y} r={1.6} fill="#1a2230" /></g>
      ))}

      {/* Header rails + plated holes aligned to the pin rows */}
      {([6, W - 6] as number[]).map((x, si) => {
        const isLeft = si === 0
        const overrideCount = isLeft
          ? chip.packageLayout?.leftRailHoles
          : chip.packageLayout?.rightRailHoles
        const limitHoles = overrideCount !== undefined ? overrideCount : rows
        const railH = overrideCount !== undefined
          ? limitHoles * ROW_H + 4
          : H - modTop - 8
        return (
          <g key={si}>
            <rect x={x - 3.5} y={modTop} width={7} height={railH} rx="3" fill="#0c1119" stroke="#2a333f" strokeWidth="0.6" />
            {Array.from({ length: limitHoles }, (_, i) => (
              <circle key={i} cx={x} cy={i * ROW_H + ROW_H / 2} r={2.6} fill="#0a0d12" stroke="#caa83a" strokeWidth="1.1" />
            ))}
          </g>
        )
      })}

      {/* Mounted RF-shielded module (DevKit style) */}
      {!bare && (
        <g>
          <rect x={modL + 1.5} y={modTop + 2} width={modW} height={modH} rx="2.5" fill="#000" opacity="0.4" />
          <rect x={modL} y={modTop} width={modW} height={modH} rx="2.5" fill={`url(#bshield-${uid})`} stroke="#a6b4c0" strokeWidth="1" />
          <rect x={modL} y={modTop} width={modW} height={2.5} rx="1" fill="#dde7f0" opacity="0.5" />
          {/* meander antenna hint at the top of the module, about a fifth of its length */}
          {(() => {
            const antB = Math.min(30, Math.max(12, Math.round(modH * 0.18)))
            const teeth = Math.max(6, Math.round((modW - 16) / 16))
            return (
              <path d={`M ${modL + 8},${modTop + antB} ${Array.from({ length: teeth }, (_, i) => {
                const x0 = modL + 8 + i * ((modW - 16) / teeth)
                const y = i % 2 === 0 ? modTop + 5 : modTop + antB
                return `L ${x0.toFixed(1)},${y} L ${(x0 + (modW - 16) / (teeth * 2)).toFixed(1)},${y}`
              }).join(' ')}`} fill="none" stroke="#7c8896" strokeWidth="1.2" />
            )
          })()}
          <text x={modCx} y={modTop + modH / 2 + 1} textAnchor="middle" fontSize="7" fontFamily="monospace" fontWeight="700" fill="#243343" letterSpacing="0.4">ESPRESSIF</text>
          <text x={modCx} y={modTop + modH / 2 + 11} textAnchor="middle" fontSize="6.2" fontFamily="monospace" fill="#33465a">{chipShort}</text>
        </g>
      )}

      {/* Bare chip + ceramic antenna (S3-Zero style) */}
      {bare && (
        <g>
          {/* QFN package */}
          <rect x={cx - 21} y={chipCy - 21} width={42} height={42} rx="2" fill="#000" opacity="0.5" />
          <rect x={cx - 20} y={chipCy - 20} width={40} height={40} rx="2" fill="#1c232c" stroke="#39434f" strokeWidth="1" />
          <rect x={cx - 16} y={chipCy - 16} width={32} height={32} rx="1" fill="none" stroke="#2a333f" strokeWidth="0.6" />
          <circle cx={cx - 14} cy={chipCy - 14} r={1.6} fill="#39434f" />
          <text x={cx} y={chipCy - 2} textAnchor="middle" fontSize="5.6" fontFamily="monospace" fontWeight="700" fill="#5a6675" letterSpacing="0.4">ESPRESSIF</text>
          <text x={cx} y={chipCy + 7} textAnchor="middle" fontSize="5" fontFamily="monospace" fill="#495563">{chipShort}</text>
          {/* ceramic antenna block at the far end from the USB */}
          {(() => {
            const antY = usbTop ? H - 19 : 7
            return (
              <g>
                <rect x={cx - 30} y={antY} width={60} height={12} rx="1.5" fill="#d9d2c0" stroke="#8a8578" strokeWidth="0.8" />
                <path d={`M ${cx - 25},${antY + 6} h8 v-3 h8 v6 h8 v-6 h8 v6 h8 v-3 h8`} fill="none" stroke="#6b6455" strokeWidth="1.1" />
                <text x={cx + 36} y={antY + 9} fontSize="5.4" fontFamily="monospace" fill="#5a6675" letterSpacing="0.5">ANT</text>
              </g>
            )
          })()}
        </g>
      )}

      {/* BOOT + EN buttons near the USB end */}
      {([['BOOT', cx - 13], ['EN', cx + 13]] as [string, number][]).map(([label, x]) => (
        <g key={label}>
          <rect x={x - 9} y={btnY} width={18} height={12} rx="2" fill="#cdd5dd" stroke="#7c8896" strokeWidth="0.6" />
          <rect x={x - 5} y={btnY + 3} width={10} height={6} rx="1.5" fill="#9aa6b2" />
          <text x={x} y={btnLabelY} textAnchor="middle" fontSize="5.6" fontFamily="monospace" fill="#5a6675" letterSpacing="0.3">{label}</text>
        </g>
      ))}

      {/* power LED */}
      <circle cx={cx + 30 > W - 12 ? W - 14 : modL + 6} cy={ledCy} r={2.4} fill={m.accent} opacity="0.85" />

      {/* USB connector */}
      <rect x={cx - usbW / 2} y={usbY} width={usbW} height={usbH + 4} rx="3" fill={`url(#usb-${uid})`} stroke="#5b6774" strokeWidth="0.8" />
      <rect x={cx - usbW / 2 + 3} y={usbY + (usbTop ? 6 : 3)} width={usbW - 6} height={5} rx="2.5" fill="#3a4450" />
      <text x={cx} y={usbTop ? usbY + usbH + 14 : H - 20} textAnchor="middle" fontSize="5.4" fontFamily="monospace" fill="#5a6675" letterSpacing="1">USB</text>

      {/* board name silkscreen */}
      <text x={cx} y={nameY} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="800" fill="#e2e8f0" letterSpacing="0.5">{m.name.replace(/^Waveshare /, '').replace(/^ESP32-/, '')}</text>
      <text x={cx} y={nameY + 12} textAnchor="middle" fontSize="6" fontFamily="monospace" fill={m.accent} letterSpacing="0.4">{m.radios}</text>

      {/* Front-surface solder pads: castellated half-pads tucked into the
          board corner at tight pitch, exactly like the real PCB - they are
          not header rows and do not stretch the board. Selection is a ring,
          never a recolor. */}
      {(['left', 'right'] as const).map(side => {
        const pads = (side === 'left' ? chip.packageLayout?.left : chip.packageLayout?.right)
          ?.filter(lp => lp.isSurfacePad) ?? []
        if (pads.length === 0) return null
        // Inboard of the header rail so pads and rail holes never collide.
        const xPos = side === 'left' ? 18 : W - 18
        const labelX = side === 'left' ? 26 : W - 26
        const anchor = side === 'left' ? ('start' as const) : ('end' as const)
        // Stack upward from just above the antenna zone (USB-top boards) or
        // downward from below it, at half-header pitch.
        const baseY = usbTop ? H - 30 : 30
        const dir = usbTop ? -1 : 1
        return (
          <g key={side}>
            {pads.map((lp, k) => {
              const isSelected = selectedPin?.gpio === lp.gpio
              const y = baseY + dir * (pads.length - 1 - k) * 17
              return (
                <g key={lp.pinNumber}>
                  <rect x={xPos - 4.5} y={y - 6.5} width={9} height={13} rx="2"
                    fill="#caa83a" stroke={isSelected ? '#a78bfa' : '#1a2230'} strokeWidth={isSelected ? 2 : 0.8} />
                  <text x={labelX} y={y + 2.5} textAnchor={anchor} fontSize="6.5" fontFamily="monospace"
                    fontWeight="bold" fill="#e2e8f0" opacity="0.85">
                    {lp.gpio !== undefined ? `GP${lp.gpio}` : lp.label}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Underside pads (usually bottom boundary pads) */}
      {chip.packageLayout?.bottom?.map((lp, i) => {
        if (!lp.isBacksidePad) return null
        const isSelected = selectedPin?.gpio === lp.gpio
        const y = (i + 2) * ROW_H + ROW_H / 2
        return (
          <g key={lp.pinNumber}>
            <circle
              cx={34}
              cy={y}
              r={3.2}
              fill="none"
              stroke={isSelected ? m.accent : "#5a6b80"}
              strokeWidth={isSelected ? "1.6" : "1"}
              strokeDasharray={isSelected ? undefined : "1.5,1.5"}
            />
            <text
              x={42}
              y={y + 2}
              textAnchor="start"
              fontSize="6"
              fontFamily="monospace"
              fill={isSelected ? m.accent : "#5a6b80"}
              opacity={isSelected ? "1" : "0.7"}
            >
              {lp.gpio !== undefined ? `GP${lp.gpio}` : lp.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Module diagram (realistic top view) ──────────────────────────────────────

export function ModuleDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  // Compact rows on phones - see compactNames in ./shared for why.
  const compact = useMediaQuery('(max-width: 767px)')
  const filteredSet = new Set(filterPins(chip.pins, filter).map(p => p.gpio))
  const pinByGpio   = new Map(chip.pins.map(p => [p.gpio, p]))

  const toggle = (pin: Pin | undefined) => {
    if (!pin) return
    setSelectedPin(selectedPin?.gpio === pin.gpio ? null : pin)
  }

  // ── Resolve layout ──────────────────────────────────────────────────────────
  let leftLayout:   LayoutPin[]
  let rightLayout:  LayoutPin[]
  let bottomLayout: LayoutPin[]
  let topLayout:    LayoutPin[]

  if (chip.packageLayout) {
    leftLayout   = chip.packageLayout.left
    rightLayout  = chip.packageLayout.right
    bottomLayout = chip.packageLayout.bottom
    topLayout    = chip.packageLayout.top ?? []
  } else {
    const sorted = [...chip.pins].sort((a, b) => a.gpio - b.gpio)
    const mid = Math.ceil(sorted.length / 2)
    let n = 0
    leftLayout   = sorted.slice(0, mid).map(p => ({ pinNumber: ++n, gpio: p.gpio }))
    rightLayout  = sorted.slice(mid).map(p  => ({ pinNumber: ++n, gpio: p.gpio }))
    bottomLayout = []
    topLayout    = []
  }

  const isBoard    = chip.module?.form === 'board'

  // A "top" row that is entirely GND/NC isn't a real top edge of signals - these are
  // the module's underside ground lands (plus the separate thermal/EPAD), all GND.
  // Render them as one compact bar rather than a row of identical floating columns.
  const topIsThermal = topLayout.length > 0 &&
    topLayout.every(lp => { const l = (lp.label ?? '').toUpperCase(); return l === 'GND' || l === 'NC' })
  const thermalGnd = topIsThermal ? topLayout.filter(lp => (lp.label ?? '').toUpperCase() === 'GND').length : 0

  // Backside solder pads (e.g. Waveshare S3-Zero) are on the back of the PCB,
  // not a bottom edge - render them as a labeled chip strip instead of
  // floating edge columns.
  const bottomIsBackside = bottomLayout.length > 0 && bottomLayout.every(lp => lp.isBacksidePad)

  // Front-surface solder pads are not header pins either: they leave the side
  // banks entirely (so they do not stretch the board length) and get their own
  // strip, with the pads drawn tucked into the board corner like the real PCB.
  const surfacePads = [...leftLayout, ...rightLayout].filter(lp => lp.isSurfacePad)
  leftLayout  = leftLayout.filter(lp => !lp.isSurfacePad)
  rightLayout = rightLayout.filter(lp => !lp.isSurfacePad)

  const sideHeight = Math.max(leftLayout.length, rightLayout.length) * ROW_H
  const padCount   = Math.max(bottomLayout.length, topIsThermal ? 0 : topLayout.length, 1)
  // The pin-row grid fixes the rendered height, so the width follows from the
  // module's true outline (bodyMm, from the KiCad footprint courtyard) to keep
  // real proportions. Boards may declare an explicit aspect in their spec.
  const bodyMm = chip.packageLayout?.bodyMm
  const boardAspect = chip.module?.aspect ?? (bodyMm ? bodyMm.w / bodyMm.h : undefined)
  const rawChipWidth = isBoard
    ? (boardAspect ? Math.round(Math.min(340, Math.max(150, sideHeight * boardAspect))) : 150)
    : bodyMm
      ? Math.max(Math.round(sideHeight * bodyMm.w / bodyMm.h), padCount * 20, 190)
      : Math.max(240, padCount * 30)
  const chipWidth  = compact ? Math.min(rawChipWidth, 160) : rawChipWidth
  const colWidth   = bottomLayout.length > 0 ? chipWidth / bottomLayout.length : 30
  const topColWidth = topLayout.length > 0 ? chipWidth / topLayout.length : 30

  // On narrow screens, start the scroll centered on the module instead of
  // the left label bank.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
  }, [chip.id])

  return (
    <div ref={scrollRef} className={`${compact ? 'p-2' : 'p-4'} pb-2 overflow-x-auto`}>
      <div id="module-diagram-canvas" className={`flex flex-col items-center min-w-fit mx-auto ${compact ? 'p-0' : 'p-2'}`}>

        {/* The banks + body + edge rows live in one grid: the two 1fr bank
            tracks equalize, so the body column (and with it the thermal bar
            and the top/bottom pin rows) is always exactly centered - with a
            plain centered flex column, unequal bank widths shifted the bottom
            pins off the module's pads. */}
        <div className="grid" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

        {/* ── Exposed thermal pad (EPAD) - a ground paddle on the back, not an edge ── */}
        {topIsThermal && (
          <div className="flex justify-center" style={{ gridColumn: 2, gridRow: 1, width: chipWidth, marginBottom: 4, justifySelf: 'center' }}>
            <div className="flex items-center gap-2 rounded-md"
              style={{ padding: '4px 10px', background: 'var(--dg-chip-bg)', border: '1px solid var(--dg-chip-border)' }}>
              <span className="font-mono font-bold rounded-sm"
                style={{ background: '#111827', color: '#9ca3af', fontSize: 9, lineHeight: '15px', padding: '0 6px' }}>
                GND ×{thermalGnd}
              </span>
              <span className="font-mono" style={{ fontSize: 8.5, color: 'var(--dg-muted)', letterSpacing: 0.3 }}>
                underside ground + thermal pad
              </span>
            </div>
          </div>
        )}

        {/* ── Top pin row (only when the top edge carries real signals) ── */}
        {topLayout.length > 0 && !topIsThermal && (
          <div className="flex" style={{ gridColumn: 2, gridRow: 2, width: chipWidth, justifySelf: 'center' }}>
            {topLayout.map(lp => {
              const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
              return (
                <EdgePinCol
                  key={lp.pinNumber}
                  layoutPin={lp}
                  pin={pin}
                  colWidth={topColWidth}
                  edge="top"
                  isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                  isFiltered={!pin || filteredSet.has(pin.gpio)}
                  compact={compact}
                  onClick={() => toggle(pin)}
                />
              )
            })}
          </div>
        )}

        {/* ── Middle row: left pins + chip body + right pins ── */}

          {/* Left pin bank */}
          <div className="flex flex-col" style={{ gridColumn: 1, gridRow: 3 }}>
            {leftLayout.map(lp => {
              const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
              return (
                <PinRow
                  key={lp.pinNumber}
                  layoutPin={lp}
                  pin={pin}
                  side="left"
                  isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                  isFiltered={!pin || filteredSet.has(pin.gpio)}
                  mappingLabel={pin ? mapping.find(a => a.gpio === pin.gpio)?.label : undefined}
                  compact={compact}
                  onClick={() => toggle(pin)}
                />
              )
            })}
          </div>

          {/* IC body */}
          <div style={{ gridColumn: 2, gridRow: 3, justifySelf: 'center' }}>
            {isBoard
              ? <BoardBody chip={chip} sideHeight={sideHeight} width={chipWidth} selectedPin={selectedPin} />
              : <ChipBody chip={chip} sideHeight={sideHeight} bottomCount={bottomLayout.length || 10} width={chipWidth} />}
          </div>

          {/* Right pin bank */}
          <div className="flex flex-col" style={{ gridColumn: 3, gridRow: 3 }}>
            {rightLayout.map(lp => {
              const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
              return (
                <PinRow
                  key={lp.pinNumber}
                  layoutPin={lp}
                  pin={pin}
                  side="right"
                  isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                  isFiltered={!pin || filteredSet.has(pin.gpio)}
                  mappingLabel={pin ? mapping.find(a => a.gpio === pin.gpio)?.label : undefined}
                  compact={compact}
                  onClick={() => toggle(pin)}
                />
              )
            })}
          </div>

        {/* ── Bottom pin row (a real physical bottom edge) ── */}
        {bottomLayout.length > 0 && !bottomIsBackside && (
          <div className="flex" style={{ gridColumn: 2, gridRow: 4, width: chipWidth, justifySelf: 'center' }}>
            {bottomLayout.map(lp => {
              const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
              return (
                <EdgePinCol
                  key={lp.pinNumber}
                  layoutPin={lp}
                  pin={pin}
                  colWidth={colWidth}
                  edge="bottom"
                  isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                  isFiltered={!pin || filteredSet.has(pin.gpio)}
                  compact={compact}
                  onClick={() => toggle(pin)}
                />
              )
            })}
          </div>
        )}

        </div>

        {/* ── Front-surface solder pads (tucked into the board corner, not header rows) ── */}
        <SolderPadStrip
          pads={surfacePads}
          caption="solder pads on the front - no header pins, solder wires directly"
          borderColor="#8a6d1f"
          maxW={Math.max(chipWidth + 260, 400)}
          pinByGpio={pinByGpio}
          selectedPin={selectedPin}
          filteredSet={filteredSet}
          onToggle={toggle}
        />

        {/* ── Underside pads (back of the board, not a physical bottom edge) ── */}
        {bottomIsBackside && (
          <SolderPadStrip
            pads={bottomLayout}
            caption="solder pads on the underside - no header pins, solder wires directly"
            borderColor="var(--dg-underside-border)"
            maxW={Math.max(chipWidth + 260, 400)}
            pinByGpio={pinByGpio}
            selectedPin={selectedPin}
            filteredSet={filteredSet}
            onToggle={toggle}
          />
        )}

      </div>
    </div>
  )
}
