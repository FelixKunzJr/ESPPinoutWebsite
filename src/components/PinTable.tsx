import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import { useMediaQuery } from '../utils/useMediaQuery'
import { ConstraintBadge } from './ConstraintBadge'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { Pin, PinAssignment } from '../types/chip'

const CAP_LABELS: Record<string, string> = {
  adc1: 'ADC1', adc2: 'ADC2', dac: 'DAC', touch: 'TOUCH',
  pwm: 'PWM', i2c: 'I2C', spi: 'SPI', uart: 'UART',
  i2s: 'I2S', rtc: 'RTC', usb: 'USB', jtag: 'JTAG', gpio: 'GPIO',
}

// Row tint by worst severity, shared by both layouts.
function rowTint(pin: Pin): string {
  if (pin.constraints.some(c => c.severity === 'danger')) return 'bg-red-950/30'
  if (pin.constraints.some(c => c.severity === 'warning')) return 'bg-yellow-950/20'
  return ''
}

function Caps({ pin }: { pin: Pin }) {
  return (
    <div className="flex flex-wrap gap-1">
      {pin.capabilities.filter(c => c !== 'gpio').map(cap => (
        <span key={cap} className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 text-xs">
          {CAP_LABELS[cap] ?? cap}
        </span>
      ))}
    </div>
  )
}

function MappedChip({ assignment }: { assignment: PinAssignment | undefined }) {
  if (!assignment) return null
  return (
    <span className="px-2 py-0.5 rounded bg-blue-900/40 border border-blue-500 text-blue-300 text-xs">
      {assignment.role}: {assignment.label}
    </span>
  )
}

export function PinTable() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const pins = filterPins(chip.pins, filter)
  // Five columns cannot fit a phone: the table only ever scrolled sideways,
  // which cut the constraint column - the one that matters most - off the
  // right edge. On phones each pin becomes a stacked card instead.
  const isPhone = useMediaQuery('(max-width: 767px)')

  const empty = <div className="py-12 text-center text-gray-500">No pins match this filter.</div>

  // Focus + activation wiring shared by the card and the table row. No
  // role="button" on the <tr>: overriding the row role would drop the cells
  // out of the table for screen readers.
  const activate = (pin: Pin, isSelected: boolean) => ({
    onClick: () => setSelectedPin(isSelected ? null : pin),
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setSelectedPin(isSelected ? null : pin)
      }
    },
    tabIndex: 0,
    'data-pin-anchor': pin.gpio,
  })

  if (isPhone) {
    return (
      <div className="space-y-2">
        {pins.map(pin => {
          const isSelected = selectedPin?.gpio === pin.gpio
          const assignment = mapping.find(a => a.gpio === pin.gpio)
          return (
            <div
              key={pin.gpio}
              role="button"
              aria-label={`GPIO${pin.gpio}`}
              {...activate(pin, isSelected)}
              className={`pin-row rounded-xl border border-gray-800 p-3 space-y-2 ${rowTint(pin)}
                ${isSelected ? 'ring-1 ring-inset ring-green-500 bg-green-950/20 is-selected' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono font-bold text-green-400 text-base">GPIO{pin.gpio}</span>
                <MappedChip assignment={assignment} />
              </div>
              <p className="font-mono text-xs text-gray-400 break-words">
                {pin.names.filter(n => n !== `GPIO${pin.gpio}`).join(' / ') || 'GPIO only'}
              </p>
              <Caps pin={pin} />
              {pin.constraints.length > 0 && (
                <div className="flex flex-col items-start gap-1">
                  {pin.constraints.map(c => (
                    <ConstraintBadge key={c.id} constraint={c} compact />
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {pins.length === 0 && empty}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 bg-gray-900/60 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">GPIO</th>
            <th className="px-4 py-3">Names</th>
            <th className="px-4 py-3">Capabilities</th>
            <th className="px-4 py-3">Constraints</th>
            <th className="px-4 py-3">Mapped As</th>
          </tr>
        </thead>
        <tbody>
          {pins.map(pin => {
            const isSelected = selectedPin?.gpio === pin.gpio
            const assignment = mapping.find(a => a.gpio === pin.gpio)

            return (
              <tr
                key={pin.gpio}
                {...activate(pin, isSelected)}
                className={`
                  border-t border-gray-800/60 transition-colors pin-row
                  ${rowTint(pin)}
                  ${isSelected ? 'ring-1 ring-inset ring-green-500 bg-green-950/20 is-selected' : ''}
                `}
              >
                <td className="px-4 py-2.5 font-mono font-bold text-green-400">
                  {pin.gpio}
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-300 text-xs">
                  {pin.names.join(' / ')}
                </td>
                <td className="px-4 py-2.5"><Caps pin={pin} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {pin.constraints.map(c => (
                      <ConstraintBadge key={c.id} constraint={c} compact />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-400">
                  <MappedChip assignment={assignment} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {pins.length === 0 && empty}
    </div>
  )
}
