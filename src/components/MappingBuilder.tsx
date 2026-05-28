import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { detectConflicts } from '../utils/detectConflicts'
import type { PinAssignment } from '../types/chip'

const ROLES: PinAssignment['role'][] = [
  'LED','Button','I2C_SDA','I2C_SCL',
  'SPI_MOSI','SPI_MISO','SPI_SCK','SPI_CS',
  'UART_TX','UART_RX','PWM','ADC','DAC','Touch','Custom',
]

export function MappingBuilder() {
  const { chip, mapping, assignPin, unassignPin, clearMapping } = useApp()
  const [gpio, setGpio] = useState<number>(0)
  const [role, setRole] = useState<PinAssignment['role']>('LED')
  const [label, setLabel] = useState('')

  const conflicts = detectConflicts(chip, mapping)
  const usablePins = chip.pins.filter(p => p.isUsable).sort((a, b) => a.gpio - b.gpio)

  // Set initial gpio to first usable pin
  const firstUsable = usablePins[0]?.gpio ?? 0

  const handleAdd = () => {
    if (!label.trim()) return
    assignPin(gpio || firstUsable, role, label.trim())
    setLabel('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">Pin Mapping</h2>
        {mapping.length > 0 && (
          <button onClick={clearMapping} className="text-xs text-red-400 hover:text-red-300">Clear all</button>
        )}
      </div>

      {/* Add assignment form */}
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">GPIO</label>
          <select
            value={gpio || firstUsable}
            onChange={e => setGpio(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-green-500"
          >
            {usablePins.map(p => (
              <option key={p.gpio} value={p.gpio}>GPIO{p.gpio}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as PinAssignment['role'])}
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-green-500"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-32">
          <label className="text-xs text-gray-500 block mb-1">Label</label>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Status LED"
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!label.trim()}
          className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-40 rounded text-sm font-medium text-white transition-colors"
        >
          Add
        </button>
      </div>

      {/* Conflict warnings */}
      {conflicts.length > 0 && (
        <div className="space-y-1">
          {conflicts.map((c, i) => (
            <div
              key={i}
              className={`text-xs px-3 py-2 rounded border ${
                c.severity === 'danger'
                  ? 'bg-red-950/40 border-red-600 text-red-300'
                  : 'bg-yellow-950/40 border-yellow-600 text-yellow-300'
              }`}
            >
              {c.severity === 'danger' ? '⛔' : '⚠️'} {c.message}
            </div>
          ))}
        </div>
      )}

      {/* Current mapping */}
      {mapping.length > 0 && (
        <div className="space-y-1">
          {mapping.map(a => {
            const pin = chip.pins.find(p => p.gpio === a.gpio)
            const hasConflict = conflicts.some(c => c.gpio === a.gpio)
            return (
              <div
                key={a.gpio}
                className={`flex items-center justify-between px-3 py-2 rounded border text-xs ${
                  hasConflict ? 'border-yellow-700 bg-yellow-950/20' : 'border-gray-700 bg-gray-800/40'
                }`}
              >
                <span className="font-mono text-green-400 w-16">GPIO{a.gpio}</span>
                <span className="text-blue-300 w-24">{a.role}</span>
                <span className="text-gray-300 flex-1">{a.label}</span>
                {pin?.names[1] && <span className="text-gray-500 mr-2 font-mono">{pin.names[1]}</span>}
                <button onClick={() => unassignPin(a.gpio)} className="text-red-500 hover:text-red-300 ml-2">✕</button>
              </div>
            )
          })}
        </div>
      )}

      {mapping.length === 0 && (
        <p className="text-xs text-gray-600">No pins mapped yet. Add one above or click a pin in the table.</p>
      )}
    </div>
  )
}
