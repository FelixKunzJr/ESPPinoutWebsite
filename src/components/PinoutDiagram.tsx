import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import type { Pin, Chip, LayoutPin } from '../types/chip'

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

// ─── SVG Chip body ────────────────────────────────────────────────────────────

function ChipBody({ chip, sideHeight, bottomCount }: { chip: Chip; sideHeight: number; bottomCount: number }) {
  const W = Math.max(220, bottomCount * 26)
  const H = sideHeight
  const cx = W / 2
  const uid = chip.id

  // Layout zones
  const pcbBorder  = 8    // green PCB visible around edge
  const antennaH   = 48   // top zone = PCB antenna area (no RF shield)
  const padH       = 16   // bottom gold castellated pads
  const shieldL    = pcbBorder
  const shieldW    = W - pcbBorder * 2
  const shieldTop  = antennaH
  const shieldBot  = H - padH
  const shieldH    = shieldBot - shieldTop

  // Wi-Fi arc center
  const wcy = shieldTop + Math.round(shieldH * 0.27)

  const moduleName = chip.packageLayout ? chip.packageLayout.name : chip.family
  const radioLabel = [chip.hasWifi && 'Wi-Fi', chip.hasBle && 'BLE', chip.hasBluetooth && 'BT'].filter(Boolean).join(' · ')

  return (
    <svg width={W} height={H} style={{ flexShrink: 0, display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`shield-${uid}`} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%"   stopColor="#b0bcc8" />
          <stop offset="25%"  stopColor="#8a9aaa" />
          <stop offset="70%"  stopColor="#6a7a8a" />
          <stop offset="100%" stopColor="#546070" />
        </linearGradient>
        <linearGradient id={`pcb-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#183018" />
          <stop offset="100%" stopColor="#0e1e0e" />
        </linearGradient>
        <linearGradient id={`pad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d8a838" />
          <stop offset="100%" stopColor="#9a6e18" />
        </linearGradient>
        {/* Subtle brushed-metal texture on shield */}
        <pattern id={`brush-${uid}`} x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
          <rect width="1" height="4" fill="none" />
          <line x1="0" y1="0" x2="1" y2="0" stroke="#ffffff" strokeWidth="0.15" opacity="0.12" />
          <line x1="0" y1="2" x2="1" y2="2" stroke="#000000" strokeWidth="0.15" opacity="0.08" />
        </pattern>
      </defs>

      {/* ── Green PCB substrate ── */}
      <rect width={W} height={H} fill={`url(#pcb-${uid})`} />
      {/* PCB edge highlight */}
      <rect x="1" y="1" width={W-2} height={H-2} fill="none" stroke="#2a5a2c" strokeWidth="1.5" />
      {/* PCB inner silkscreen border */}
      <rect x={pcbBorder-2} y={pcbBorder-2} width={W-pcbBorder*2+4} height={H-pcbBorder*2+4}
        fill="none" stroke="#3a6a3c" strokeWidth="0.5" opacity="0.6" />

      {/* ── Antenna area (bare PCB, no shield) ── */}
      <rect x={shieldL} y={4} width={shieldW} height={antennaH-6} fill="#122012" rx="1" />
      {/* Antenna trace — U-shape loop typical of PCB trace antennas */}
      <path
        d={`M ${cx-24},${antennaH-8} L ${cx-24},${10} L ${cx+24},${10} L ${cx+24},${antennaH-8}`}
        fill="none" stroke="#3a6830" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d={`M ${cx-18},${antennaH-8} L ${cx-18},${16} L ${cx+18},${16} L ${cx+18},${antennaH-8}`}
        fill="none" stroke="#2a5828" strokeWidth="1" strokeLinecap="round" opacity="0.6"
      />
      <text x={cx} y={antennaH/2 + 4} textAnchor="middle" fontSize="6.5" fontFamily="monospace"
        fill="#4a7a4c" letterSpacing="1.5" fontWeight="600">
        PCB ANTENNA
      </text>

      {/* ── RF Shield shadow ── */}
      <rect x={shieldL+2} y={shieldTop+3} width={shieldW} height={shieldH}
        fill="#000" rx="2" opacity="0.35" />

      {/* ── RF Shield body ── */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH}
        fill={`url(#shield-${uid})`} rx="2" />
      {/* Brushed metal texture overlay */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH}
        fill={`url(#brush-${uid})`} rx="2" opacity="0.6" />

      {/* Shield top bevel (bright edge) */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={3}
        fill="#d0dde8" rx="1" opacity="0.45" />
      {/* Shield left edge highlight */}
      <rect x={shieldL} y={shieldTop+3} width={2} height={shieldH-3}
        fill="#c0d0da" opacity="0.2" />
      {/* Shield right/bottom edges (darker) */}
      <rect x={shieldL+shieldW-2} y={shieldTop} width={2} height={shieldH}
        fill="#20303a" opacity="0.3" rx="0" />
      <rect x={shieldL} y={shieldTop+shieldH-2} width={shieldW} height={2}
        fill="#20303a" opacity="0.3" />

      {/* Shield outer border */}
      <rect x={shieldL} y={shieldTop} width={shieldW} height={shieldH}
        fill="none" stroke="#9aaab8" strokeWidth="1" rx="2" />

      {/* Shield pressed-in detail frame */}
      <rect x={shieldL+5} y={shieldTop+5} width={shieldW-10} height={shieldH-10}
        fill="none" stroke="#6a7a88" strokeWidth="0.5" rx="1" opacity="0.5" />

      {/* ── Corner mounting screws (4 corners of shield) ── */}
      {([
        [shieldL+10, shieldTop+10],
        [shieldL+shieldW-10, shieldTop+10],
        [shieldL+10, shieldTop+shieldH-10],
        [shieldL+shieldW-10, shieldTop+shieldH-10],
      ] as [number,number][]).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} fill="#485868" stroke="#8a9aaa" strokeWidth="0.75" />
          <circle cx={x} cy={y} r={3.5} fill="none" stroke="#3a4858" strokeWidth="0.5" />
          <line x1={x-2.8} y1={y} x2={x+2.8} y2={y} stroke="#aabbc8" strokeWidth="1" />
          <line x1={x} y1={y-2.8} x2={x} y2={y+2.8} stroke="#aabbc8" strokeWidth="1" />
        </g>
      ))}

      {/* ── Wi-Fi signal arcs ── */}
      {[9, 16, 23].map((r, i) => (
        <path key={i}
          d={`M ${cx-r},${wcy} A ${r} ${r} 0 0 1 ${cx+r},${wcy}`}
          fill="none"
          stroke={['#78889a', '#607080', '#485868'][i]}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={wcy} r={2.5} fill="#586878" />

      {/* ── Branding text (dark ink on silver — realistic silkscreen look) ── */}
      <text x={cx} y={wcy+20} textAnchor="middle" fontSize="8" fontFamily="'Courier New',monospace"
        fontWeight="700" fill="#283848" letterSpacing="2.5">
        ESPRESSIF
      </text>
      <text x={cx} y={wcy+36} textAnchor="middle" fontSize="13" fontFamily="'Courier New',monospace"
        fontWeight="800" fill="#1c2c3c" letterSpacing="1">
        {moduleName}
      </text>
      {radioLabel && (
        <text x={cx} y={wcy+50} textAnchor="middle" fontSize="7" fontFamily="'Courier New',monospace"
          fill="#405060" letterSpacing="0.5">
          {radioLabel}
        </text>
      )}

      {/* CE / FCC marks */}
      <text x={cx-24} y={shieldTop+shieldH-14} textAnchor="middle" fontSize="9"
        fontFamily="serif" fontWeight="700" fill="#506070">CE</text>
      <text x={cx+24} y={shieldTop+shieldH-14} textAnchor="middle" fontSize="7"
        fontFamily="'Courier New',monospace" fontWeight="700" fill="#506070">FCC</text>
      <text x={cx} y={shieldTop+shieldH-5} textAnchor="middle" fontSize="5.5"
        fontFamily="'Courier New',monospace" fill="#3a4a5a" letterSpacing="0.3">
        ID: 2AC7Z-{moduleName.replace('ESP-','')}
      </text>

      {/* ── Gold castellated pads strip ── */}
      <rect x={shieldL} y={H-padH} width={shieldW} height={padH} fill={`url(#pad-${uid})`} />
      {/* Top highlight line on pads */}
      <rect x={shieldL} y={H-padH} width={shieldW} height={3} fill="#e0b840" />
      {/* Individual pad separators */}
      {Array.from({ length: bottomCount+1 }, (_, i) => {
        const colW = shieldW / bottomCount
        return (
          <rect key={i} x={shieldL + i*colW - 0.75} y={H-padH} width={1.5} height={padH}
            fill="#0e2010" />
        )
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

  if (chip.packageLayout) {
    leftLayout   = chip.packageLayout.left
    rightLayout  = chip.packageLayout.right
    bottomLayout = chip.packageLayout.bottom
  } else {
    const sorted = [...chip.pins].sort((a, b) => a.gpio - b.gpio)
    const mid = Math.ceil(sorted.length / 2)
    let n = 0
    leftLayout   = sorted.slice(0, mid).map(p => ({ pinNumber: ++n, gpio: p.gpio }))
    rightLayout  = sorted.slice(mid).map(p  => ({ pinNumber: ++n, gpio: p.gpio }))
    bottomLayout = []
  }

  const sideHeight = Math.max(leftLayout.length, rightLayout.length) * ROW_H
  const chipWidth  = Math.max(220, bottomLayout.length * 26)
  const colWidth   = bottomLayout.length > 0 ? chipWidth / bottomLayout.length : 26

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
