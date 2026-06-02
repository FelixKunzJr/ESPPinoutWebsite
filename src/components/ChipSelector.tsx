import { CHIPS } from '../data/chips/index'
import { useApp } from '../context/AppContext'

const FAMILY_COLORS: Record<string, string> = {
  'ESP32':    'border-blue-500 text-blue-400',
  'ESP32-S2': 'border-purple-500 text-purple-400',
  'ESP32-S3': 'border-green-500 text-green-400',
  'ESP32-C3': 'border-yellow-500 text-yellow-400',
  'ESP32-C6': 'border-orange-500 text-orange-400',
  'ESP32-C5': 'border-teal-500 text-teal-400',
  'ESP32-H2': 'border-pink-500 text-pink-400',
}

export function ChipSelector() {
  const { chip, setChip } = useApp()

  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map(c => {
        const colors = FAMILY_COLORS[c.family] ?? 'border-gray-500 text-gray-400'
        const isActive = chip.id === c.id
        return (
          <button
            key={c.id}
            onClick={() => setChip(c.id)}
            className={`
              px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
              ${colors}
              ${isActive
                ? 'bg-opacity-20 bg-white shadow-lg scale-105'
                : 'bg-gray-900 opacity-70 hover:opacity-100'}
            `}
          >
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
