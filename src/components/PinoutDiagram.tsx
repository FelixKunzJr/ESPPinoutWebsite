import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import type { Pin } from '../types/chip'

function pinColor(pin: Pin): string {
  if (!pin.isUsable) return '#7f1d1d'
  if (pin.constraints.some(c => c.severity === 'danger'))   return '#991b1b'
  if (pin.constraints.some(c => c.severity === 'warning'))  return '#78350f'
  if (pin.capabilities.includes('adc1'))  return '#14532d'
  if (pin.capabilities.includes('touch')) return '#1e3a5f'
  return '#1f2937'
}

function pinBorder(pin: Pin, isSelected: boolean, isFiltered: boolean): string {
  if (isSelected)  return '#4ade80'
  if (!isFiltered) return '#374151'
  if (pin.constraints.some(c => c.severity === 'danger'))  return '#ef4444'
  if (pin.constraints.some(c => c.severity === 'warning')) return '#f59e0b'
  return '#6b7280'
}

interface PinBoxProps {
  pin: Pin
  side: 'left' | 'right'
  isSelected: boolean
  isFiltered: boolean
  onClick: () => void
  label?: string
}

function PinBox({ pin, side, isSelected, isFiltered, onClick, label }: PinBoxProps) {
  const bg = pinColor(pin)
  const border = pinBorder(pin, isSelected, isFiltered)
  const opacity = isFiltered ? 1 : 0.3

  return (
    <div
      onClick={onClick}
      style={{ opacity, borderColor: border, backgroundColor: bg }}
      className="flex items-center gap-1.5 cursor-pointer border rounded px-2 py-1 transition-all hover:opacity-100 select-none"
      title={pin.names.join(' / ')}
    >
      {side === 'right' && (
        <span className="text-xs font-mono text-gray-400 w-16 text-right truncate">
          {pin.names[1] ?? pin.names[0]}
        </span>
      )}
      <span
        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
        style={{ color: border, backgroundColor: '#00000040' }}
      >
        {pin.gpio}
      </span>
      {side === 'left' && (
        <span className="text-xs font-mono text-gray-400 w-16 truncate">
          {pin.names[1] ?? pin.names[0]}
        </span>
      )}
      {label && (
        <span className="text-xs text-blue-300 ml-1 truncate max-w-16">{label}</span>
      )}
    </div>
  )
}

export function PinoutDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const filtered = new Set(filterPins(chip.pins, filter).map(p => p.gpio))

  // Split pins into left/right banks (first half / second half by GPIO number)
  const sorted = [...chip.pins].sort((a, b) => a.gpio - b.gpio)
  const mid = Math.ceil(sorted.length / 2)
  const left  = sorted.slice(0, mid)
  const right = sorted.slice(mid)
  const rows  = Math.max(left.length, right.length)

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/40 p-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="grid gap-y-0.5 px-2 py-4" style={{ gridTemplateColumns: '1fr 3rem 1fr' }}>
            {Array.from({ length: rows }, (_, i) => {
              const lPin = left[i]
              const rPin = right[i]

              return (
                <div key={i} className="contents">
                  {lPin ? (
                    <PinBox
                      pin={lPin}
                      side="left"
                      isSelected={selectedPin?.gpio === lPin.gpio}
                      isFiltered={filtered.has(lPin.gpio)}
                      onClick={() => setSelectedPin(selectedPin?.gpio === lPin.gpio ? null : lPin)}
                      label={mapping.find(a => a.gpio === lPin.gpio)?.label}
                    />
                  ) : <div />}

                  {i === 0 ? (
                    <div
                      className="flex items-center justify-center bg-gray-800 rounded-lg border border-gray-600 row-span-full"
                      style={{ gridRowEnd: `span ${rows}` }}
                    >
                      <span className="text-gray-500 text-xs font-mono rotate-90 whitespace-nowrap">
                        {chip.family}
                      </span>
                    </div>
                  ) : <div />}

                  {rPin ? (
                    <PinBox
                      pin={rPin}
                      side="right"
                      isSelected={selectedPin?.gpio === rPin.gpio}
                      isFiltered={filtered.has(rPin.gpio)}
                      onClick={() => setSelectedPin(selectedPin?.gpio === rPin.gpio ? null : rPin)}
                      label={mapping.find(a => a.gpio === rPin.gpio)?.label}
                    />
                  ) : <div />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-900 border border-green-500 inline-block" /> ADC1</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-900 border border-blue-500 inline-block" /> Touch</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-yellow-500 inline-block" /> Warning</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-red-500 inline-block" /> Danger</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-green-400 inline-block" /> Selected</span>
      </div>
    </div>
  )
}
