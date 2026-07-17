import { useApp } from '../context/AppContext'
import { ConstraintBadge } from './ConstraintBadge'
import { reportMistakeUrl } from '../utils/github'

const CAP_DETAILS: Record<string, { label: string; desc: string }> = {
  adc1:  { label: 'ADC1',  desc: 'Analog-to-digital converter, channel 1. Safe to use while WiFi is active.' },
  adc2:  { label: 'ADC2',  desc: 'Analog-to-digital converter, channel 2. Shared with WiFi driver - readings fail while WiFi is on.' },
  dac:   { label: 'DAC',   desc: 'Digital-to-analog converter. True analog output (not PWM).' },
  touch: { label: 'Touch', desc: 'Capacitive touch sensor input.' },
  pwm:   { label: 'PWM',   desc: 'Pulse-width modulation via LEDC or MCPWM. Can drive LEDs, servos, buzzers.' },
  i2c:   { label: 'I2C',   desc: 'I2C bus. Any GPIO can be I2C via Wire.begin(sda, scl).' },
  spi:   { label: 'SPI',   desc: 'SPI bus. Can be remapped to any GPIO.' },
  uart:  { label: 'UART',  desc: 'Serial/UART. Multiple UARTs available, pins can be remapped.' },
  i2s:   { label: 'I2S',   desc: 'I2S audio bus.' },
  rtc:   { label: 'RTC',   desc: 'RTC GPIO - usable during deep sleep for wakeup.' },
  usb:   { label: 'USB',   desc: 'Native USB data line. Tied to internal USB controller.' },
  jtag:  { label: 'JTAG',  desc: 'JTAG debug interface.' },
}

export function PinDetailPanel() {
  const { selectedPin, setSelectedPin, chip } = useApp()

  if (!selectedPin) return null

  const capEntries = selectedPin.capabilities
    .filter(c => c !== 'gpio')
    .map(c => ({ cap: c, detail: CAP_DETAILS[c] ?? { label: c.toUpperCase(), desc: '' } }))

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col z-50 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div>
          <span className="text-2xl font-bold font-mono text-green-400">GPIO{selectedPin.gpio}</span>
          <p className="text-xs text-gray-400 mt-0.5">{chip.name}</p>
        </div>
        <button onClick={() => setSelectedPin(null)} className="text-gray-500 hover:text-gray-200 text-xl">✕</button>
      </div>

      <div className="p-4 flex-1 space-y-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Pin Names</h3>
          <div className="flex flex-wrap gap-1">
            {selectedPin.names.map(n => (
              <span key={n} className="px-2 py-0.5 rounded bg-gray-800 font-mono text-xs text-gray-300">{n}</span>
            ))}
          </div>
        </div>

        {selectedPin.constraints.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              ⚠️ Constraints &amp; Gotchas
            </h3>
            <div className="space-y-2">
              {selectedPin.constraints.map(c => (
                <ConstraintBadge key={c.id} constraint={c} />
              ))}
            </div>
          </div>
        )}

        {capEntries.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Capabilities</h3>
            <div className="space-y-2">
              {capEntries.map(({ cap, detail }) => (
                <div key={cap} className="rounded-lg bg-gray-800/60 px-3 py-2">
                  <div className="text-sm font-semibold text-gray-200">{detail.label}</div>
                  {detail.desc && <div className="text-xs text-gray-400 mt-0.5">{detail.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPin.notes && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Notes</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{selectedPin.notes}</p>
          </div>
        )}

        {!selectedPin.isUsable && (
          <div className="rounded-lg bg-red-900/30 border border-red-600 p-3 text-center">
            <span className="text-red-300 font-semibold text-sm">⛔ Do not use this pin</span>
            <p className="text-xs text-red-400 mt-1">This GPIO is reserved by the chip and cannot be used for user code.</p>
          </div>
        )}

        <a
          href={reportMistakeUrl(chip, selectedPin)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs rounded-lg px-3 py-2 transition-colors"
          style={{ color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.2)' }}
        >
          ⚠ Report a mistake with this pin
        </a>
      </div>
    </div>
  )
}
