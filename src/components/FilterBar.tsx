import { useApp } from '../context/AppContext'
import type { FilterKey } from '../types/chip'

const FILTERS: { key: FilterKey; label: string; title: string }[] = [
  { key: 'all',          label: 'All pins',         title: 'Show all pins' },
  { key: 'safe_output',  label: 'Safe output',    title: 'Input-only and flash-reserved pins hidden' },
  { key: 'adc_wifi_safe',label: 'ADC + WiFi',     title: 'ADC1 pins only - safe while WiFi is active' },
  { key: 'pwm',          label: 'PWM',             title: 'Pins capable of PWM output' },
  { key: 'touch',        label: 'Touch',           title: 'Capacitive touch pins' },
  { key: 'free',         label: 'No constraints',  title: 'Pins with zero restrictions' },
  { key: 'strapping',    label: 'Strapping',       title: 'Boot-strapping pins - handle with care' },
]

export function FilterBar() {
  const { filter, setFilter } = useApp()

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => (
        <button
          key={f.key}
          title={f.title}
          onClick={() => setFilter(f.key)}
          className={`
            px-3 py-1 rounded-full text-xs font-medium transition-all
            ${filter === f.key
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'}
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
