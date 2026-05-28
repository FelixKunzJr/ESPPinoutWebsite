import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import type { Pin, Chip, LayoutPin } from '../types/chip'

const ROW_H = 26

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getBadge(name: string): { bg: string; text: string } {
  const u = name.toUpperCase()
  if (u === 'GND')                                                          return { bg: '#111827', text: '#9ca3af' }
  if (/^3V3$|^VCC$|^3\.3V$/.test(u))                                      return { bg: '#dc2626', text: '#fff' }
  if (/^VIN$|^VBUS$|^5V$/.test(u))                                         return { bg: '#b91c1c', text: '#fff' }
  if (/^EN$|^RST$|^RESET$|^ENABLE$/.test(u))                              return { bg: '#0f766e', text: '#fff' }
  if (/^NC$/.test(u))                                                        return { bg: '#1f2937', text: '#6b7280' }
  if (/^ADC1/.test(u))                                                      return { bg: '#ea580c', text: '#fff' }
  if (/^ADC2/.test(u))                                                      return { bg: '#d97706', text: '#fff' }
  if (/^DAC\d?$/.test(u))                                                   return { bg: '#ca8a04', text: '#fff' }
  if (/^TOUCH/.test(u))                                                     return { bg: '#16a34a', text: '#fff' }
  if (/^RTC/.test(u))                                                       return { bg: '#0f766e', text: '#fff' }
  if (/MOSI$|MISO$|^SCK$|VSPI|HSPI/.test(u))                              return { bg: '#2563eb', text: '#fff' }
  if (/SDA$|SCL$/.test(u))                                                  return { bg: '#7c3aed', text: '#fff' }
  if (/^U[0-9]?(TXD?|RXD?|CTS|RTS)$|^TX\d?$|^RX\d?$/.test(u))          return { bg: '#0891b2', text: '#fff' }
  if (/^GPIO\d/.test(u))                                                    return { bg: '#6d28d9', text: '#fff' }
  if (/^SD_/.test(u))                                                       return { bg: '#4338ca', text: '#fff' }
  if (/USB|JTAG/.test(u))                                                   return { bg: '#be185d', text: '#fff' }
  if (/CLK|XTAL/.test(u))                                                   return { bg: '#0369a1', text: '#fff' }
  if (/^MT(DI|CK|MS|DO)$/.test(u))                                         return { bg: '#292524', text: '#a8a29e' }
  if (/^VP$|^VN$/.test(u))                                                  return { bg: '#374151', text: '#d1d5db' }
  return                                                                            { bg: '#374151', text: '#9ca3af' }
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

// GPIO closest to chip (rightmost on left side, leftmost on right side)
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
      style={{ background: bg, color: text, fontSize: 9, lineHeight: '15px', height: 15, padding: '0 5px' }}
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

  const constraintBadge = hasDanger ? (
    <span className="font-mono font-bold rounded-sm flex-shrink-0"
      style={{ background: '#3f0808', color: '#f87171', fontSize: 9, lineHeight: '15px', height: 15, padding: '0 4px' }}>✕</span>
  ) : hasWarning ? (
    <span className="font-mono font-bold rounded-sm flex-shrink-0"
      style={{ background: '#3a1a00', color: '#fbbf24', fontSize: 9, lineHeight: '15px', height: 15, padding: '0 4px' }}>⚠</span>
  ) : null

  const functionBadges = pin ? (
    <>
      {mappingLabel && (
        <span className="font-mono font-bold rounded-sm flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 9, lineHeight: '15px', height: 15, padding: '0 5px' }}>
          {mappingLabel}
        </span>
      )}
      {names.map(name => {
        const { bg, text } = getBadge(name)
        return (
          <span key={name} className="font-mono font-bold rounded-sm flex-shrink-0"
            style={{ background: bg, color: text, fontSize: 9, lineHeight: '15px', height: 15, padding: '0 5px' }}>
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
      style={{ width: 16, height: 16, background: '#0d1520', border: '1px solid #1e2d40', borderRadius: 2, fontSize: 7, fontWeight: 700, color: '#3d5068' }}>
      {layoutPin.pinNumber}
    </div>
  )

  const solderDot = (
    <div className="flex-shrink-0 rounded-full"
      style={{ width: 8, height: 8, background: color, boxShadow: `0 0 4px ${color}70` }} />
  )

  const connLine = (
    <div className="flex-shrink-0" style={{ width: 12, height: 1.5, background: color + '80' }} />
  )

  const isActive = isFiltered || !pin

  return (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer select-none transition-colors
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40' : 'hover:bg-white/[0.03]'}
      `}
      style={{ height: ROW_H, borderBottom: '1px solid #050a10' }}
    >
      {side === 'left' ? (
        <>
          <div className="flex-1 flex items-center justify-end gap-[3px] min-w-0 overflow-hidden pr-1.5">
            {constraintBadge}
            {functionBadges}
          </div>
          {connLine}
          {pinNumBox}
          <div style={{ width: 4, flexShrink: 0 }} />
          {solderDot}
        </>
      ) : (
        <>
          {solderDot}
          <div style={{ width: 4, flexShrink: 0 }} />
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
  // Show short label: GPIO number only, or special label
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
      {/* Connector line from chip */}
      <div style={{ width: 1.5, height: 14, background: color + '70' }} />
      {/* Solder dot */}
      <div className="rounded-full" style={{ width: 7, height: 7, background: color, boxShadow: `0 0 3px ${color}60` }} />
      {/* Pin number */}
      <div className="font-mono" style={{ fontSize: 6.5, fontWeight: 700, color: '#3d5068', marginTop: 2 }}>
        {layoutPin.pinNumber}
      </div>
      {/* Constraint indicator */}
      {hasDanger && (
        <div style={{ fontSize: 7, color: '#f87171', lineHeight: 1 }}>✕</div>
      )}
      {hasWarning && (
        <div style={{ fontSize: 7, color: '#fbbf24', lineHeight: 1 }}>⚠</div>
      )}
      {/* Badge — rotated so text reads upward (left side) */}
      <span
        className="font-mono font-bold rounded-sm"
        style={{
          background: bg, color: text,
          fontSize: 7.5,
          padding: '2px 3px',
          marginTop: 2,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          maxHeight: 52,
          overflow: 'hidden',
          lineHeight: 1.1,
        }}
      >
        {shortLabel}
      </span>
    </div>
  )
}

// ─── SVG Chip body ────────────────────────────────────────────────────────────

// Antenna comb: rectangular notches, characteristic of WROOM module
const NOTCH_COUNT = 8
const NOTCH_W     = 16
const NOTCH_H     = 34
const NOTCH_BRIDGE = 13  // bridge between notches

function ChipBody({ chip, sideHeight, bottomCount }: { chip: Chip; sideHeight: number; bottomCount: number }) {
  const W = Math.max(200, bottomCount * 24)
  const H = sideHeight
  const cx = W / 2

  const antennaH   = 46
  const padH       = 12
  const shieldM    = 10
  const shieldTop  = antennaH + 5
  const shieldBot  = H - padH - 2
  const shieldH    = shieldBot - shieldTop
  const shieldW    = W - shieldM * 2
  const uid        = chip.id

  // Center the notches
  const totalCombW = NOTCH_COUNT * NOTCH_W + (NOTCH_COUNT - 1) * NOTCH_BRIDGE
  const combStart  = (W - totalCombW) / 2

  const wcy = shieldTop + Math.round(shieldH * 0.3)
  const radioLabel = [chip.hasWifi && 'Wi-Fi', chip.hasBle && 'BLE', chip.hasBluetooth && 'BT'].filter(Boolean).join(' · ')

  return (
    <svg width={W} height={H} style={{ flexShrink: 0, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2e4055" />
          <stop offset="50%" stopColor="#243448" />
          <stop offset="100%" stopColor="#1c2b3c" />
        </linearGradient>
        <linearGradient id={`pcb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0e1a24" />
          <stop offset="100%" stopColor="#0a1318" />
        </linearGradient>
      </defs>

      {/* ── PCB base ── */}
      <rect width={W} height={H} fill={`url(#pcb-${uid})`} rx="3" />
      <rect x="0.75" y="0.75" width={W-1.5} height={H-1.5} fill="none" stroke="#1e3255" strokeWidth="1.5" rx="2.5" />

      {/* ── Antenna area background ── */}
      <rect width={W} height={antennaH} fill="#0c1720" rx="3" />
      <rect y={antennaH - 5} width={W} height={5} fill="#0c1720" />
      <line x1="0" y1={antennaH} x2={W} y2={antennaH} stroke="#18283c" strokeWidth="0.75" />

      {/* ── Antenna notches (the rectangular comb) ── */}
      {Array.from({ length: NOTCH_COUNT }, (_, i) => (
        <rect
          key={i}
          x={combStart + i * (NOTCH_W + NOTCH_BRIDGE)}
          y={0}
          width={NOTCH_W}
          height={NOTCH_H}
          fill="#060d14"
          rx="1"
        />
      ))}
      {/* Subtle highlight on comb bridges */}
      {Array.from({ length: NOTCH_COUNT - 1 }, (_, i) => (
        <rect
          key={i}
          x={combStart + i * (NOTCH_W + NOTCH_BRIDGE) + NOTCH_W}
          y={0}
          width={NOTCH_BRIDGE}
          height={NOTCH_H}
          fill="#131f2c"
        />
      ))}

      {/* ── RF shield shadow ── */}
      <rect x={shieldM+2} y={shieldTop+2} width={shieldW} height={shieldH} fill="#000" rx="2.5" opacity="0.4" />

      {/* ── RF shield body ── */}
      <rect x={shieldM} y={shieldTop} width={shieldW} height={shieldH} fill={`url(#sh-${uid})`} rx="2.5" />

      {/* Top bevel highlight */}
      <rect x={shieldM} y={shieldTop} width={shieldW} height={3} fill="#4a6475" rx="1" opacity="0.5" />
      {/* Right-edge subtle highlight */}
      <rect x={shieldM + shieldW - 2} y={shieldTop + 3} width={2} height={shieldH - 3} fill="#2a3e52" rx="0" opacity="0.3" />

      {/* Shield outer border */}
      <rect x={shieldM} y={shieldTop} width={shieldW} height={shieldH} fill="none" stroke="#2e4258" strokeWidth="0.75" rx="2.5" />

      {/* Inner inset frame */}
      <rect x={shieldM+5} y={shieldTop+5} width={shieldW-10} height={shieldH-10} fill="none" stroke="#1e3050" strokeWidth="0.5" rx="1.5" opacity="0.4" />

      {/* Corner screws */}
      {([
        [shieldM + 9,          shieldTop + 9],
        [shieldM + shieldW - 9, shieldTop + 9],
        [shieldM + 9,          shieldTop + shieldH - 9],
        [shieldM + shieldW - 9, shieldTop + shieldH - 9],
      ] as [number, number][]).map(([sx, sy], i) => (
        <g key={i}>
          <circle cx={sx} cy={sy} r={4} fill="#0e1e2e" stroke="#263a52" strokeWidth="0.75" />
          <line x1={sx-2.2} y1={sy} x2={sx+2.2} y2={sy} stroke="#1e3050" strokeWidth="0.9" />
          <line x1={sx} y1={sy-2.2} x2={sx} y2={sy+2.2} stroke="#1e3050" strokeWidth="0.9" />
        </g>
      ))}

      {/* ── Wi-Fi arcs ── */}
      {[10, 18, 26].map((r, i) => (
        <path key={i}
          d={`M ${cx-r},${wcy} A ${r} ${r} 0 0 1 ${cx+r},${wcy}`}
          fill="none"
          stroke={['#3a607e', '#284e6a', '#1c3c56'][i]}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={wcy} r={2.5} fill="#24384e" />

      {/* ── Branding ── */}
      <text x={cx} y={wcy + 18} textAnchor="middle" fontSize="7.5" fontFamily="'Courier New',monospace" fontWeight="700" fill="#4a6a8a" letterSpacing="2.5">
        ESPRESSIF
      </text>
      <text x={cx} y={wcy + 33} textAnchor="middle" fontSize="13" fontFamily="'Courier New',monospace" fontWeight="800" fill="#5e82a0" letterSpacing="1.2">
        {chip.packageLayout ? chip.packageLayout.name : chip.family}
      </text>
      {radioLabel && (
        <text x={cx} y={wcy + 46} textAnchor="middle" fontSize="6.5" fontFamily="'Courier New',monospace" fill="#1e3456" letterSpacing="0.5">
          {radioLabel}
        </text>
      )}

      {/* CE / FCC */}
      <text x={cx - 20} y={shieldTop + shieldH - 12} textAnchor="middle" fontSize="9" fontFamily="serif" fontWeight="700" fill="#1e3050">CE</text>
      <text x={cx + 20} y={shieldTop + shieldH - 12} textAnchor="middle" fontSize="7" fontFamily="'Courier New',monospace" fontWeight="700" fill="#1e3050">FCC</text>
      <text x={cx} y={shieldTop + shieldH - 3} textAnchor="middle" fontSize="5" fontFamily="'Courier New',monospace" fill="#12253a" letterSpacing="0.4">
        ID: 2AC7Z-ESPWROOM32
      </text>

      {/* ── Gold castellated pads strip at bottom ── */}
      <rect x={shieldM} y={H - padH} width={shieldW} height={padH} fill="#9a6e18" rx="0" />
      <rect x={shieldM} y={H - padH} width={shieldW} height={2} fill="#c49030" />
      {/* Individual pad gaps */}
      {Array.from({ length: bottomCount + 1 }, (_, i) => {
        const colW = shieldW / bottomCount
        return (
          <rect key={i} x={shieldM + i * colW - 0.5} y={H - padH} width={1.5} height={padH} fill="#060c14" />
        )
      })}
    </svg>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND = [
  { bg: '#dc2626', text: '#fff', label: 'Power' },
  { bg: '#111827', text: '#9ca3af', label: 'GND' },
  { bg: '#ea580c', text: '#fff', label: 'ADC1 (WiFi-safe)' },
  { bg: '#d97706', text: '#fff', label: 'ADC2 (WiFi conflict)' },
  { bg: '#ca8a04', text: '#fff', label: 'DAC' },
  { bg: '#16a34a', text: '#fff', label: 'Touch' },
  { bg: '#6d28d9', text: '#fff', label: 'GPIO' },
  { bg: '#2563eb', text: '#fff', label: 'SPI' },
  { bg: '#7c3aed', text: '#fff', label: 'I2C' },
  { bg: '#0891b2', text: '#fff', label: 'UART' },
  { bg: '#0369a1', text: '#fff', label: 'Clock' },
  { bg: '#0f766e', text: '#fff', label: 'EN' },
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

  if (chip.packageLayout) {
    leftLayout   = chip.packageLayout.left
    rightLayout  = chip.packageLayout.right
    bottomLayout = chip.packageLayout.bottom
  } else {
    // Fallback: split sorted GPIO pins 50/50, no bottom row
    const sorted = [...chip.pins].sort((a, b) => a.gpio - b.gpio)
    const mid = Math.ceil(sorted.length / 2)
    let n = 0
    leftLayout   = sorted.slice(0, mid).map(p => ({ pinNumber: ++n, gpio: p.gpio }))
    rightLayout  = sorted.slice(mid).map(p  => ({ pinNumber: ++n, gpio: p.gpio }))
    bottomLayout = []
  }

  const sideHeight = Math.max(leftLayout.length, rightLayout.length) * ROW_H
  const chipWidth  = Math.max(200, bottomLayout.length * 24)
  const colWidth   = bottomLayout.length > 0 ? chipWidth / bottomLayout.length : 24

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#060b12', borderColor: '#1a2535' }}>
      <div className="p-4 pb-2 overflow-x-auto">
        <div className="flex flex-col items-center min-w-fit mx-auto">

          {/* ── Top row: left pins + chip body + right pins ── */}
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
            <ChipBody chip={chip} sideHeight={sideHeight} bottomCount={bottomLayout.length || 10} />

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
            <div
              className="flex"
              style={{ width: chipWidth, marginLeft: 'auto', marginRight: 'auto' }}
            >
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
