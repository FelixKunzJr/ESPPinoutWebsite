import { useApp } from '../context/AppContext'
import { ConstraintBadge } from './ConstraintBadge'
import { reportMistakeUrl } from '../utils/github'
import { IconWarning } from './icons'
import { specialInterfaces, matrixPeripherals } from '../data/routing'
import type { Pin } from '../types/chip'

// The pin detail content, independent of how it is presented. Three shells
// use it: the desktop side panel, the phone sheet opened from a diagram pin,
// and the drill-down inside the phone pin-table sheet.

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

export function PinDetailHeader({ pin, onClose, onBack }: {
  pin: Pin
  onClose: () => void
  /** When set, the header offers a way back instead of a dismiss. */
  onBack?: () => void
}) {
  const { chip } = useApp()
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-gray-800">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back to the pin table"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-100 -ml-1 pr-1"
        >
          <span aria-hidden="true" className="text-lg leading-none">‹</span> Pins
        </button>
      )}
      <div className={onBack ? 'text-right flex-1 min-w-0' : ''}>
        <span className="text-2xl font-bold font-mono text-green-400">GPIO{pin.gpio}</span>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{chip.name}</p>
      </div>
      {!onBack && (
        <button
          onClick={onClose}
          aria-label="Close pin details"
          className="text-gray-400 hover:text-gray-100 text-xl leading-none px-2"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export function PinDetailBody({ pin }: { pin: Pin }) {
  const { chip } = useApp()

  // Is this pin a solder-only pad on the board (front surface or underside)?
  const layoutPin = [
    ...(chip.packageLayout?.left ?? []),
    ...(chip.packageLayout?.right ?? []),
    ...(chip.packageLayout?.bottom ?? []),
    ...(chip.packageLayout?.top ?? []),
  ].find(lp => lp.gpio === pin.gpio)
  const padLocation = layoutPin?.isBacksidePad ? 'underside' : layoutPin?.isSurfacePad ? 'front surface' : null

  const capEntries = pin.capabilities
    .filter(c => c !== 'gpio')
    .map(c => ({ cap: c, detail: CAP_DETAILS[c] ?? { label: c.toUpperCase(), desc: '' } }))

  return (
  <div className="p-4 space-y-5">
      {padLocation && (
        <div className="rounded-lg bg-amber-950/40 border border-amber-700 px-3 py-2">
          <p className="text-xs text-amber-300 leading-relaxed">
            <span className="font-semibold">Solder pad only</span> ({padLocation} of the board) - this
            signal is not on the headers. No breadboard or header pin access; you must solder a wire
            directly to the pad.
          </p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Pin Names</h3>
        <div className="flex flex-wrap gap-1">
          {pin.names.map(n => (
            <span key={n} className="px-2 py-0.5 rounded bg-gray-800 font-mono text-xs text-gray-300">{n}</span>
          ))}
        </div>
      </div>

      {pin.constraints.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            <IconWarning size={13} />Constraints &amp; Gotchas
          </h3>
          <div className="space-y-2">
            {pin.constraints.map(c => (
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

      {specialInterfaces(chip, pin.gpio).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Special Interfaces</h3>
          <div className="space-y-1.5">
            {specialInterfaces(chip, pin.gpio).map(s => (
              <div key={s.group + s.role} className="rounded-lg bg-gray-800/60 px-3 py-2 flex items-baseline justify-between gap-2">
                <span className="text-xs text-gray-300">{s.group}</span>
                <span className="font-mono text-xs text-cyan-300">{s.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pin.isUsable && (
        <div className="rounded-lg bg-gray-800/40 border border-gray-700/60 px-3 py-2">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {pin.constraints.some(c => c.id === 'input_only')
              ? 'Input-only, but the GPIO matrix can still route peripheral inputs here (UART RX, I2S data in, pulse counter and similar).'
              : `Via the GPIO matrix this pin can also host ${matrixPeripherals(chip.family).join(' · ')} - most peripherals are not tied to specific pins.`}
          </p>
        </div>
      )}

      {pin.notes && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Notes</h3>
          <p className="text-xs text-gray-300 leading-relaxed">{pin.notes}</p>
        </div>
      )}

      {!pin.isUsable && (
        <div className="rounded-lg bg-red-900/30 border border-red-600 p-3 text-center">
          <span className="text-red-300 font-semibold text-sm">Do not use this pin</span>
          <p className="text-xs text-red-400 mt-1">This GPIO is reserved by the chip and cannot be used for user code.</p>
        </div>
      )}

      <a
        href={reportMistakeUrl(chip, pin)}
        target="_blank"
        rel="noopener noreferrer"
        className="link-plain report-mistake block text-center text-xs rounded-lg px-3 py-2 transition-colors"
        style={{ color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.2)' }}
      >
        <span className="inline-flex items-center gap-1.5"><IconWarning size={12} />Report a mistake with this pin</span>
      </a>
</div>
  )
}
