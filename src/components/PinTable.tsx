import { useApp } from '../context/AppContext'
import { filterPins } from '../utils/filterPins'
import { ConstraintBadge } from './ConstraintBadge'

const CAP_LABELS: Record<string, string> = {
  adc1: 'ADC1', adc2: 'ADC2', dac: 'DAC', touch: 'TOUCH',
  pwm: 'PWM', i2c: 'I2C', spi: 'SPI', uart: 'UART',
  i2s: 'I2S', rtc: 'RTC', usb: 'USB', jtag: 'JTAG', gpio: 'GPIO',
}

export function PinTable() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const pins = filterPins(chip.pins, filter)

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
            const hasDanger  = pin.constraints.some(c => c.severity === 'danger')
            const hasWarning = pin.constraints.some(c => c.severity === 'warning')
            const rowBg = hasDanger
              ? 'bg-red-950/30'
              : hasWarning
              ? 'bg-yellow-950/20'
              : ''

            return (
              <tr
                key={pin.gpio}
                // No role="button" here: overriding the row role would drop the
                // cells out of the table for screen readers. The row still
                // takes focus and activates from the keyboard.
                onClick={() => setSelectedPin(isSelected ? null : pin)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedPin(isSelected ? null : pin)
                  }
                }}
                tabIndex={0}
                data-pin-anchor={pin.gpio}
                className={`
                  border-t border-gray-800/60 transition-colors
                  ${rowBg}
                  ${isSelected ? 'ring-1 ring-inset ring-green-500 bg-green-950/20 is-selected' : ''}
                  pin-row
                `}
              >
                <td className="px-4 py-2.5 font-mono font-bold text-green-400">
                  {pin.gpio}
                </td>
                <td className="px-4 py-2.5 font-mono text-gray-300 text-xs">
                  {pin.names.join(' / ')}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {pin.capabilities.filter(c => c !== 'gpio').map(cap => (
                      <span key={cap} className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 text-xs">
                        {CAP_LABELS[cap] ?? cap}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {pin.constraints.map(c => (
                      <ConstraintBadge key={c.id} constraint={c} compact />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-400">
                  {assignment && (
                    <span className="px-2 py-0.5 rounded bg-blue-900/40 border border-blue-500 text-blue-300">
                      {assignment.role}: {assignment.label}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {pins.length === 0 && (
        <div className="py-12 text-center text-gray-500">No pins match this filter.</div>
      )}
    </div>
  )
}
