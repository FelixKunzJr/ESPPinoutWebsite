import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import type { Pin, Chip } from '../types/chip'

const ROW_H = 26

function getBadge(name: string): { bg: string; text: string } {
  const u = name.toUpperCase()
  if (u === 'GND')                                                          return { bg: '#111827', text: '#9ca3af' }
  if (/^3V3$|^VCC$|^3\.3V$/.test(u))                                      return { bg: '#dc2626', text: '#fff' }
  if (/^VIN$|^VBUS$|^5V$|^POWER$/.test(u))                                return { bg: '#b91c1c', text: '#fff' }
  if (/^EN$|^RST$|^RESET$|^ENABLE$/.test(u))                              return { bg: '#374151', text: '#e5e7eb' }
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

function sortedNames(names: string[], side: 'left' | 'right'): string[] {
  const gpio = names.filter(n => /^GPIO\d/.test(n))
  const other = names.filter(n => !/^GPIO\d/.test(n))
  return side === 'left' ? [...other, ...gpio] : [...gpio, ...other]
}

interface PinRowProps {
  pin: Pin
  side: 'left' | 'right'
  pinIndex: number
  isSelected: boolean
  isFiltered: boolean
  mappingLabel?: string
  onClick: () => void
}

function PinRow({ pin, side, pinIndex, isSelected, isFiltered, mappingLabel, onClick }: PinRowProps) {
  const color = connectorColor(pin)
  const names = sortedNames(pin.names, side)

  const badgeList = (
    <>
      {mappingLabel && (
        <span
          className="font-mono font-bold rounded-sm flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 9, lineHeight: '15px', height: 15, padding: '0 5px' }}
        >
          {mappingLabel}
        </span>
      )}
      {names.map(name => {
        const { bg, text } = getBadge(name)
        return (
          <span
            key={name}
            className="font-mono font-bold rounded-sm flex-shrink-0"
            style={{ background: bg, color: text, fontSize: 9, lineHeight: '15px', height: 15, padding: '0 5px' }}
          >
            {name}
          </span>
        )
      })}
    </>
  )

  const pinNumBox = (
    <div
      className="flex-shrink-0 flex items-center justify-center font-mono"
      style={{ width: 16, height: 16, background: '#0d1520', border: '1px solid #1e2d40', borderRadius: 2, fontSize: 7, fontWeight: 700, color: '#3d5068' }}
    >
      {pinIndex}
    </div>
  )

  const solderDot = (
    <div
      className="flex-shrink-0 rounded-full"
      style={{ width: 8, height: 8, background: color, boxShadow: `0 0 4px ${color}80` }}
    />
  )

  const connLine = (
    <div className="flex-shrink-0" style={{ width: 12, height: 1.5, background: color + '80' }} />
  )

  return (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer select-none transition-colors
        ${isFiltered ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40' : 'hover:bg-white/[0.03]'}
      `}
      style={{ height: ROW_H, borderBottom: '1px solid #050a10' }}
    >
      {side === 'left' ? (
        <>
          <div className="flex-1 flex items-center justify-end gap-[3px] min-w-0 overflow-hidden pr-1.5">
            {badgeList}
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
            {badgeList}
          </div>
        </>
      )}
    </div>
  )
}

function ChipBody({ chip }: { chip: Chip }) {
  const combs = [5, 10, 5, 16, 5, 12, 5, 18, 5, 12, 5, 16, 5, 10, 5]
  const radioLabel = [chip.hasWifi && 'Wi-Fi', chip.hasBle && 'BLE', chip.hasBluetooth && 'BT'].filter(Boolean).join(' · ')

  return (
    <div
      className="flex-shrink-0 self-stretch flex flex-col"
      style={{ width: 172, background: '#0c1117', border: '1.5px solid #1e3050', borderRadius: 4 }}
    >
      {/* PCB antenna comb */}
      <div
        className="flex-shrink-0 flex justify-center items-end gap-[2px]"
        style={{ padding: '8px 14px 5px', background: '#0e1825', borderBottom: '1px solid #18283c' }}
      >
        {combs.map((h, i) => (
          <div
            key={i}
            style={{ width: 3.5, height: h, background: i % 2 === 0 ? '#1e3050' : '#263d60', borderRadius: '1px 1px 0 0' }}
          />
        ))}
      </div>

      {/* Module body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
        {/* Wi-Fi arcs */}
        <div className="relative flex items-end justify-center" style={{ width: 32, height: 22 }}>
          <div className="absolute rounded-full" style={{ width: 4, height: 4, background: '#1e3050', bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
          {[8, 16, 24].map((w, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: w, height: w / 2,
                border: `1.5px solid ${['#2d4a6e', '#1e3558', '#162845'][i]}`,
                borderBottom: 'none',
                borderRadius: `${w}px ${w}px 0 0`,
                bottom: 2, left: '50%', transform: 'translateX(-50%)',
              }}
            />
          ))}
        </div>

        {/* Branding */}
        <div className="text-center" style={{ lineHeight: 1.5 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#4a6580', letterSpacing: '0.2em', fontFamily: 'monospace' }}>
            ESPRESSIF
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#5a7a96', letterSpacing: '0.06em', fontFamily: 'monospace', marginTop: 4 }}>
            {chip.family}
          </div>
          {radioLabel && (
            <div style={{ fontSize: 7, color: '#1e3050', fontFamily: 'monospace', marginTop: 3, letterSpacing: '0.05em' }}>
              {radioLabel}
            </div>
          )}
        </div>

        <div style={{ fontSize: 7, color: '#18283c', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
          FCC ID: 2AC7Z
        </div>
      </div>

      {/* GND thermal pad */}
      <div className="flex-shrink-0 flex justify-center pb-2 pt-1" style={{ borderTop: '1px solid #18283c' }}>
        <div style={{ width: 64, height: 8, background: '#080e14', border: '1px solid #1e3050', borderRadius: 1 }} />
      </div>
    </div>
  )
}

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
  { bg: '#374151', text: '#e5e7eb', label: 'EN/RST' },
] as const

export function PinoutDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const filteredSet = new Set(filterPins(chip.pins, filter).map(p => p.gpio))

  const sorted = [...chip.pins].sort((a, b) => a.gpio - b.gpio)
  const mid = Math.ceil(sorted.length / 2)
  const leftPins = sorted.slice(0, mid)
  const rightPins = sorted.slice(mid)

  const toggle = (pin: Pin) =>
    setSelectedPin(selectedPin?.gpio === pin.gpio ? null : pin)

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#060b12', borderColor: '#1a2535' }}>
      <div className="p-4 pb-3 overflow-x-auto">
        <div className="flex items-stretch justify-center min-w-fit mx-auto">

          {/* Left pin bank */}
          <div className="flex flex-col">
            {leftPins.map((pin, i) => (
              <PinRow
                key={pin.gpio}
                pin={pin}
                side="left"
                pinIndex={i + 1}
                isSelected={selectedPin?.gpio === pin.gpio}
                isFiltered={filteredSet.has(pin.gpio)}
                mappingLabel={mapping.find(a => a.gpio === pin.gpio)?.label}
                onClick={() => toggle(pin)}
              />
            ))}
          </div>

          {/* IC module body */}
          <ChipBody chip={chip} />

          {/* Right pin bank */}
          <div className="flex flex-col">
            {rightPins.map((pin, i) => (
              <PinRow
                key={pin.gpio}
                pin={pin}
                side="right"
                pinIndex={leftPins.length + i + 1}
                isSelected={selectedPin?.gpio === pin.gpio}
                isFiltered={filteredSet.has(pin.gpio)}
                mappingLabel={mapping.find(a => a.gpio === pin.gpio)?.label}
                onClick={() => toggle(pin)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderTop: '1px solid #1a2535' }}>
        {LEGEND.map(({ bg, text, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 10 }}>
            <span
              className="font-mono font-bold rounded-sm flex-shrink-0"
              style={{ background: bg, color: text, fontSize: 8, lineHeight: '14px', height: 14, padding: '0 4px' }}
            >
              {label.split(' ')[0]}
            </span>
            <span style={{ color: '#6b7280' }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
