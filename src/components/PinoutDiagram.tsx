import type { ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import type { Pin, Chip, LayoutPin, ModuleInfo } from '../types/chip'

const ROW_H = 30

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getBadge(name: string): { bg: string; text: string } {
  const u = name.toUpperCase()
  if (u === 'GND')                                                        return { bg: '#111827', text: '#9ca3af' }
  if (/^3V3$|^VCC$|^3\.3V$/.test(u))                                    return { bg: '#dc2626', text: '#fff' }
  if (/^VIN$|^VBUS$|^5V$/.test(u))                                       return { bg: '#b91c1c', text: '#fff' }
  if (/^EN$|^RST$|^RESET$|^ENABLE$/.test(u))                            return { bg: '#0f766e', text: '#fff' }
  if (/^NC$/.test(u))                                                      return { bg: '#1f2937', text: '#6b7280' }
  if (/^ADC1/.test(u))                                                    return { bg: '#ea580c', text: '#fff' }
  if (/^ADC2/.test(u))                                                    return { bg: '#d97706', text: '#fff' }
  if (/^DAC\d?$/.test(u))                                                 return { bg: '#ca8a04', text: '#fff' }
  if (/^TOUCH/.test(u))                                                   return { bg: '#16a34a', text: '#fff' }
  if (/^RTC/.test(u))                                                     return { bg: '#0f766e', text: '#fff' }
  if (/MOSI$|MISO$|^SCK$|VSPI|HSPI/.test(u))                            return { bg: '#2563eb', text: '#fff' }
  if (/SDA$|SCL$/.test(u))                                                return { bg: '#7c3aed', text: '#fff' }
  if (/^U[0-9]?(TXD?|RXD?|CTS|RTS)$|^TX\d?$|^RX\d?$/.test(u))        return { bg: '#0891b2', text: '#fff' }
  if (/^GPIO\d/.test(u))                                                  return { bg: '#6d28d9', text: '#fff' }
  if (/^SD_/.test(u))                                                     return { bg: '#4338ca', text: '#fff' }
  if (/USB|JTAG/.test(u))                                                 return { bg: '#be185d', text: '#fff' }
  if (/CLK|XTAL/.test(u))                                                 return { bg: '#0369a1', text: '#fff' }
  if (/^MT(DI|CK|MS|DO)$/.test(u))                                       return { bg: '#292524', text: '#a8a29e' }
  if (/^VP$|^VN$/.test(u))                                                return { bg: '#374151', text: '#d1d5db' }
  return                                                                          { bg: '#374151', text: '#9ca3af' }
}

function connectorColor(pin: Pin): string {
  if (!pin.isUsable || pin.constraints.some(c => c.severity === 'danger')) return '#374151'
  if (pin.capabilities.includes('adc1'))   return '#ea580c'
  if (pin.capabilities.includes('adc2'))   return '#d97706'
  if (pin.capabilities.includes('dac'))    return '#ca8a04'
  if (pin.capabilities.includes('touch'))  return '#16a34a'
  if (pin.capabilities.includes('i2c'))    return '#7c3aed'
  if (pin.capabilities.includes('spi'))    return '#2563eb'
  if (pin.capabilities.includes('uart'))   return '#0891b2'
  if (pin.constraints.some(c => c.id === 'strapping_pin')) return '#eab308'
  return '#6b7280'
}

function sortedNames(names: string[], side: 'left' | 'right'): string[] {
  const gpio = names.filter(n => /^GPIO\d/.test(n))
  const other = names.filter(n => !/^GPIO\d/.test(n))
  return side === 'left' ? [...other, ...gpio] : [...gpio, ...other]
}

// ─── Special-pin badge (GND / 3V3 / EN / NC) ─────────────────────────────────

function SpecialBadge({ label }: { label: string }) {
  const { bg, text } = getBadge(label)
  return (
    <span
      className="font-mono font-bold rounded-sm flex-shrink-0"
      style={{ background: bg, color: text, fontSize: 10, lineHeight: '17px', height: 17, padding: '0 6px' }}
    >
      {label}
    </span>
  )
}

// ─── Left / right pin row ─────────────────────────────────────────────────────

interface PinRowProps {
  layoutPin: LayoutPin
  pin: Pin | undefined
  side: 'left' | 'right'
  isSelected: boolean
  isFiltered: boolean
  mappingLabel?: string
  onClick: () => void
}

function PinRow({ layoutPin, pin, side, isSelected, isFiltered, mappingLabel, onClick }: PinRowProps) {
  const color = pin ? connectorColor(pin) : '#4b5563'
  const names  = pin ? sortedNames(pin.names, side) : []

  const hasDanger  = !!pin?.constraints.some(c => c.severity === 'danger')
  const hasWarning = !hasDanger && !!pin?.constraints.length

  // Large, prominent constraint badge
  const constraintBadge = hasDanger ? (
    <span
      className="font-mono font-bold rounded flex-shrink-0 flex items-center justify-center"
      style={{
        background: '#7f1d1d', color: '#fca5a5',
        fontSize: 14, width: 26, height: 26,
        border: '1px solid #ef4444',
      }}
    >✕</span>
  ) : hasWarning ? (
    <span
      className="font-mono font-bold rounded flex-shrink-0 flex items-center justify-center"
      style={{
        background: '#78350f', color: '#fde68a',
        fontSize: 14, width: 26, height: 26,
        border: '1px solid #f59e0b',
      }}
    >⚠</span>
  ) : null

  const functionBadges = pin ? (
    <>
      {mappingLabel && (
        <span className="font-mono font-bold rounded-sm flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 10, lineHeight: '17px', height: 17, padding: '0 5px' }}>
          {mappingLabel}
        </span>
      )}
      {names.map(name => {
        const { bg, text } = getBadge(name)
        return (
          <span key={name} className="font-mono font-bold rounded-sm flex-shrink-0"
            style={{ background: bg, color: text, fontSize: 10, lineHeight: '17px', height: 17, padding: '0 5px' }}>
            {name}
          </span>
        )
      })}
    </>
  ) : (
    <SpecialBadge label={layoutPin.label ?? 'NC'} />
  )

  const pinNumBox = (
    <div className="flex-shrink-0 flex items-center justify-center font-mono"
      style={{ width: 17, height: 17, background: '#0d1520', border: '1px solid #1e2d40', borderRadius: 2, fontSize: 7.5, fontWeight: 700, color: '#3d5068' }}>
      {layoutPin.pinNumber}
    </div>
  )

  const solderDot = (
    <div className="flex-shrink-0 rounded-full"
      style={{ width: 9, height: 9, background: color, boxShadow: `0 0 5px ${color}80` }} />
  )

  const connLine = (
    <div className="flex-shrink-0" style={{ width: 14, height: 1.5, background: color + '80' }} />
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
      onClick={onClick}
      className={`flex items-center cursor-pointer select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40' : 'hover:bg-white/[0.03]'}
      `}
      style={{
        height: ROW_H,
        borderBottom: '1px solid #050a10',
        background: isSelected ? undefined : rowBg,
      }}
    >
      {side === 'left' ? (
        <>
          <div className="flex-1 flex items-center justify-end gap-[3px] min-w-0 overflow-hidden pr-1.5">
            {constraintBadge}
            {functionBadges}
          </div>
          {connLine}
          {pinNumBox}
          <div style={{ width: 5, flexShrink: 0 }} />
          {solderDot}
        </>
      ) : (
        <>
          {solderDot}
          <div style={{ width: 5, flexShrink: 0 }} />
          {pinNumBox}
          {connLine}
          <div className="flex-1 flex items-center justify-start gap-[3px] min-w-0 overflow-hidden pl-1.5">
            {functionBadges}
            {constraintBadge}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Bottom pin column ────────────────────────────────────────────────────────

interface BottomPinColProps {
  layoutPin: LayoutPin
  pin: Pin | undefined
  colWidth: number
  isSelected: boolean
  isFiltered: boolean
  onClick: () => void
}

function BottomPinCol({ layoutPin, pin, colWidth, isSelected, isFiltered, onClick }: BottomPinColProps) {
  const color = pin ? connectorColor(pin) : '#4b5563'
  const shortLabel = pin
    ? (pin.names.find(n => /^GPIO\d/.test(n)) ?? pin.names[0] ?? `${pin.gpio}`)
    : (layoutPin.label ?? 'NC')

  const { bg, text } = getBadge(pin ? shortLabel : (layoutPin.label ?? 'NC'))

  const hasDanger  = !!pin?.constraints.some(c => c.severity === 'danger')
  const hasWarning = !hasDanger && !!pin?.constraints.length

  const isActive = isFiltered || !pin

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40 rounded' : 'hover:bg-white/[0.03] rounded'}
      `}
      style={{ width: colWidth, paddingBottom: 4 }}
    >
      <div style={{ width: 1.5, height: 14, background: color + '70' }} />
      <div className="rounded-full" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 4px ${color}60` }} />
      <div className="font-mono" style={{ fontSize: 7, fontWeight: 700, color: '#3d5068', marginTop: 2 }}>
        {layoutPin.pinNumber}
      </div>
      {/* Prominent constraint indicator */}
      {hasDanger && (
        <div className="font-mono font-bold rounded flex items-center justify-center flex-shrink-0"
          style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: 11, width: 18, height: 18, border: '1px solid #ef4444', marginTop: 2 }}>
          ✕
        </div>
      )}
      {hasWarning && (
        <div className="font-mono font-bold rounded flex items-center justify-center flex-shrink-0"
          style={{ background: '#78350f', color: '#fde68a', fontSize: 11, width: 18, height: 18, border: '1px solid #f59e0b', marginTop: 2 }}>
          ⚠
        </div>
      )}
      {!hasDanger && !hasWarning && <div style={{ height: 20 }} />}
      <span
        className="font-mono font-bold rounded-sm"
        style={{
          background: bg, color: text,
          fontSize: 8,
          padding: '2px 3px',
          marginTop: 2,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          maxHeight: 56,
          overflow: 'hidden',
          lineHeight: 1.1,
        }}
      >
        {shortLabel}
      </span>
    </div>
  )
}

// ─── Top pin column (mirror of bottom — MINI modules have a top GND ring) ──────

function TopPinCol({ layoutPin, pin, colWidth, isSelected, isFiltered, onClick }: BottomPinColProps) {
  const color = pin ? connectorColor(pin) : '#4b5563'
  const shortLabel = pin
    ? (pin.names.find(n => /^GPIO\d/.test(n)) ?? pin.names[0] ?? `${pin.gpio}`)
    : (layoutPin.label ?? 'NC')

  const { bg, text } = getBadge(pin ? shortLabel : (layoutPin.label ?? 'NC'))

  const hasDanger  = !!pin?.constraints.some(c => c.severity === 'danger')
  const hasWarning = !hasDanger && !!pin?.constraints.length

  const isActive = isFiltered || !pin

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40 rounded' : 'hover:bg-white/[0.03] rounded'}
      `}
      style={{ width: colWidth, paddingTop: 4 }}
    >
      <span
        className="font-mono font-bold rounded-sm"
        style={{
          background: bg, color: text,
          fontSize: 8, padding: '2px 3px', marginBottom: 2,
          writingMode: 'vertical-rl', maxHeight: 56, overflow: 'hidden', lineHeight: 1.1,
        }}
      >
        {shortLabel}
      </span>
      {hasDanger && (
        <div className="font-mono font-bold rounded flex items-center justify-center flex-shrink-0"
          style={{ background: '#7f1d1d', color: '#fca5a5', fontSize: 11, width: 18, height: 18, border: '1px solid #ef4444', marginBottom: 2 }}>✕</div>
      )}
      {hasWarning && (
        <div className="font-mono font-bold rounded flex items-center justify-center flex-shrink-0"
          style={{ background: '#78350f', color: '#fde68a', fontSize: 11, width: 18, height: 18, border: '1px solid #f59e0b', marginBottom: 2 }}>⚠</div>
      )}
      {!hasDanger && !hasWarning && <div style={{ height: 20 }} />}
      <div className="font-mono" style={{ fontSize: 7, fontWeight: 700, color: '#3d5068', marginBottom: 2 }}>
        {layoutPin.pinNumber}
      </div>
      <div className="rounded-full" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 4px ${color}60` }} />
      <div style={{ width: 1.5, height: 14, background: color + '70' }} />
    </div>
  )
}

// ─── SVG Chip body ────────────────────────────────────────────────────────────

// Default module identity for chips that don't declare one yet.
function resolveModule(chip: Chip): ModuleInfo {
  if (chip.module) return chip.module
  return {
    name: chip.packageLayout?.name ?? chip.family,
    form: 'wroom',
    arch: `${chip.cores}-core`,
    pcb: 'green',
    accent: '#3b82f6',
    radios: [chip.hasWifi && 'Wi-Fi', chip.hasBluetooth && 'BT', chip.hasBle && 'BLE'].filter(Boolean).join(' · '),
  }
}

// Square-wave serpentine — reads as an etched meander PCB antenna trace.
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
  const antennaH  = isMini ? 56 : 46   // top RF / antenna keep-out zone
  const padH      = 14                  // bottom gold castellated pads
  const shieldL   = pcbBorder
  const shieldW   = W - pcbBorder * 2
  const shieldTop = antennaH
  const shieldBot = H - padH
  const shieldH   = shieldBot - shieldTop
  const my        = shieldTop + shieldH / 2   // shield vertical centre for branding

  // PCB substrate palette
  const pcb = m.pcb === 'black'
    ? { a: '#1c1e24', b: '#0c0d11', edge: '#33363f', silk: '#44474f' }
    : { a: '#1b331b', b: '#0e1e0e', edge: '#2c5c2e', silk: '#3a6a3c' }

  // Antenna trace tint, lifted toward the family accent
  const traceMain = m.pcb === 'black' ? '#6a6e78' : '#3f7a36'
  const traceDim  = m.pcb === 'black' ? '#4a4e58' : '#2c5a28'

  return (
    <svg width={W} height={H} style={{ flexShrink: 0, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`shield-${uid}`} x1="0" y1="0" x2="0.18" y2="1">
          <stop offset="0%"   stopColor="#c2cdd8" />
          <stop offset="22%"  stopColor="#9aa9b8" />
          <stop offset="68%"  stopColor="#71808f" />
          <stop offset="100%" stopColor="#586572" />
        </linearGradient>
        <linearGradient id={`pcb-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={pcb.a} />
          <stop offset="100%" stopColor={pcb.b} />
        </linearGradient>
        <linearGradient id={`pad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e3bd49" />
          <stop offset="100%" stopColor="#9a6e18" />
        </linearGradient>
        {/* Subtle brushed-metal texture on the shield */}
        <pattern id={`brush-${uid}`} x="0" y="0" width="1" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="1" y2="0" stroke="#ffffff" strokeWidth="0.13" opacity="0.10" />
          <line x1="0" y1="1.5" x2="1" y2="1.5" stroke="#000000" strokeWidth="0.13" opacity="0.07" />
        </pattern>
      </defs>

      {/* ── PCB substrate ── */}
      <rect width={W} height={H} fill={`url(#pcb-${uid})`} rx="3" />
      <rect x="1" y="1" width={W-2} height={H-2} fill="none" stroke={pcb.edge} strokeWidth="1.5" rx="3" />
      <rect x={pcbBorder-2} y={pcbBorder-2} width={W-pcbBorder*2+4} height={H-pcbBorder*2+4}
        fill="none" stroke={pcb.silk} strokeWidth="0.5" opacity="0.55" rx="2" />

      {/* ── Antenna zone ── */}
      {isMini ? (
        // MINI: antenna lives in a dashed keep-out tab offset to one corner
        <>
          <rect x={shieldL} y={5} width={shieldW * 0.6} height={antennaH-9}
            fill="none" stroke={m.accent} strokeWidth="0.9" strokeDasharray="3 2" opacity="0.65" rx="2" />
          <path d={meanderPath(shieldL+7, shieldL + shieldW*0.6 - 7, 11, antennaH-12)}
            fill="none" stroke={traceMain} strokeWidth="1.4" strokeLinecap="square" />
          <text x={shieldL + shieldW*0.6 + 6} y={antennaH/2 - 2} fontSize="6" fontFamily="monospace"
            fill={m.accent} letterSpacing="0.5" fontWeight="700" opacity="0.85">ANT</text>
          <text x={shieldL + shieldW*0.6 + 6} y={antennaH/2 + 7} fontSize="4.6" fontFamily="monospace"
            fill={pcb.silk} letterSpacing="0.3">KEEP-OUT</text>
        </>
      ) : (
        // WROOM / WROVER: full-width meander trace etched on bare PCB
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
      <rect x={shieldL+1.5} y={shieldTop+2.5} width={shieldW} height={shieldH} fill="#000" rx="2.5" opacity="0.4" />
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill={`url(#shield-${uid})`} rx="2.5" />
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill={`url(#brush-${uid})`} rx="2.5" />
      {/* bevels */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={2.5} fill="#dde7f0" opacity="0.5" rx="1" />
      <rect x={shieldL} y={shieldTop+2.5} width={1.8} height={shieldH-2.5} fill="#cdd9e2" opacity="0.22" />
      <rect x={shieldL+shieldW-1.8} y={shieldTop} width={1.8} height={shieldH} fill="#1d2b34" opacity="0.32" />
      <rect x={shieldL} y={shieldTop+shieldH-2} width={shieldW} height={2} fill="#1d2b34" opacity="0.32" />
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH} fill="none" stroke="#a6b4c0" strokeWidth="1" rx="2.5" />
      {/* family accent hairline just inside the top edge */}
      <rect x={shieldL+5} y={shieldTop+6} width={shieldW-10} height={1.4} fill={m.accent} opacity="0.5" rx="0.7" />

      {/* ── Stamped branding ── */}
      <text x={cx} y={my-26} textAnchor="middle" fontSize="7.5" fontFamily="'Arial Narrow',sans-serif"
        fontWeight="700" fill="#2a3a4a" letterSpacing="3">ESPRESSIF</text>
      <text x={cx} y={my-8} textAnchor="middle"
        fontSize={m.name.length > 15 ? 11 : 13} fontFamily="'Arial Narrow','Courier New',monospace"
        fontWeight="800" fill="#1a2a3a" letterSpacing="0.5">{m.name}</text>
      <text x={cx} y={my+8} textAnchor="middle" fontSize="6.8" fontFamily="monospace"
        fill={m.accent} letterSpacing="0.4" fontWeight="700" opacity="0.92">{m.radios}</text>
      <text x={cx} y={my+21} textAnchor="middle" fontSize="6" fontFamily="monospace"
        fill="#46566a" letterSpacing="0.3">{m.arch}</text>

      {/* data-matrix code + regulatory marks near the bottom of the can */}
      {dataMatrix(uid, shieldL+8, shieldBot-26, 2.1)}
      <text x={cx+6} y={shieldBot-15} textAnchor="middle" fontSize="8.5" fontFamily="serif"
        fontWeight="700" fill="#516070">CE</text>
      <text x={cx+26} y={shieldBot-15} textAnchor="middle" fontSize="6.5" fontFamily="monospace"
        fontWeight="700" fill="#516070">FCC</text>
      <text x={cx+10} y={shieldBot-6} textAnchor="middle" fontSize="5" fontFamily="monospace"
        fill="#3c4c5c" letterSpacing="0.2">2AC7Z-{m.name.replace(/^ESP32-?/,'')}</text>

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

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND = [
  { bg: '#dc2626', text: '#fff',     label: 'Power' },
  { bg: '#111827', text: '#9ca3af',  label: 'GND' },
  { bg: '#ea580c', text: '#fff',     label: 'ADC1 (WiFi-safe)' },
  { bg: '#d97706', text: '#fff',     label: 'ADC2 (WiFi conflict)' },
  { bg: '#ca8a04', text: '#fff',     label: 'DAC' },
  { bg: '#16a34a', text: '#fff',     label: 'Touch' },
  { bg: '#6d28d9', text: '#fff',     label: 'GPIO' },
  { bg: '#2563eb', text: '#fff',     label: 'SPI' },
  { bg: '#7c3aed', text: '#fff',     label: 'I2C' },
  { bg: '#0891b2', text: '#fff',     label: 'UART' },
  { bg: '#0369a1', text: '#fff',     label: 'Clock' },
  { bg: '#0f766e', text: '#fff',     label: 'EN / RTC' },
  { bg: '#7f1d1d', text: '#fca5a5',  label: '✕ Danger' },
  { bg: '#78350f', text: '#fde68a',  label: '⚠ Warning' },
] as const

// ─── Main diagram ─────────────────────────────────────────────────────────────

export function PinoutDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
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

  const sideHeight = Math.max(leftLayout.length, rightLayout.length) * ROW_H
  const padCount   = Math.max(bottomLayout.length, topLayout.length, 1)
  const chipWidth  = Math.max(220, padCount * 26)
  const colWidth   = bottomLayout.length > 0 ? chipWidth / bottomLayout.length : 26
  const topColWidth = topLayout.length > 0 ? chipWidth / topLayout.length : 26

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#060b12', borderColor: '#1a2535' }}>
      <div className="p-4 pb-2 overflow-x-auto">
        <div className="flex flex-col items-center min-w-fit mx-auto">

          {/* ── Top pin row (MINI modules: GND ring along the top edge) ── */}
          {topLayout.length > 0 && (
            <div className="flex" style={{ width: chipWidth }}>
              {topLayout.map(lp => {
                const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
                return (
                  <TopPinCol
                    key={lp.pinNumber}
                    layoutPin={lp}
                    pin={pin}
                    colWidth={topColWidth}
                    isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                    isFiltered={!pin || filteredSet.has(pin.gpio)}
                    onClick={() => toggle(pin)}
                  />
                )
              })}
            </div>
          )}

          {/* ── Middle row: left pins + chip body + right pins ── */}
          <div className="flex items-start">

            {/* Left pin bank */}
            <div className="flex flex-col">
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
                    onClick={() => toggle(pin)}
                  />
                )
              })}
            </div>

            {/* IC body */}
            <ChipBody chip={chip} sideHeight={sideHeight} bottomCount={bottomLayout.length || 10} width={chipWidth} />

            {/* Right pin bank */}
            <div className="flex flex-col">
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
                    onClick={() => toggle(pin)}
                  />
                )
              })}
            </div>

          </div>

          {/* ── Bottom pin row ── */}
          {bottomLayout.length > 0 && (
            <div className="flex" style={{ width: chipWidth }}>
              {bottomLayout.map(lp => {
                const pin = lp.gpio !== undefined ? pinByGpio.get(lp.gpio) : undefined
                return (
                  <BottomPinCol
                    key={lp.pinNumber}
                    layoutPin={lp}
                    pin={pin}
                    colWidth={colWidth}
                    isSelected={!!pin && selectedPin?.gpio === pin.gpio}
                    isFiltered={!pin || filteredSet.has(pin.gpio)}
                    onClick={() => toggle(pin)}
                  />
                )
              })}
            </div>
          )}

        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderTop: '1px solid #1a2535' }}>
        {LEGEND.map(({ bg, text, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 10 }}>
            <span className="font-mono font-bold rounded-sm flex-shrink-0"
              style={{ background: bg, color: text, fontSize: 8, lineHeight: '14px', height: 14, padding: '0 4px' }}>
              {label.split(' ')[0]}
            </span>
            <span style={{ color: '#6b7280' }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
