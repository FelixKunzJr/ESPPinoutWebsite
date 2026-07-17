import { useApp } from '../context/AppContext'
import { MATRIX_PERIPHERALS, FAMILY_ROUTING_NOTE, resolveGroups } from '../data/routing'

// "Can I put I2C on pin X?" - the GPIO matrix / IO MUX explainer the diagram
// alone cannot answer. Fixed-interface pin chips are clickable and open the
// pin detail panel.
export function RoutingCard() {
  const { chip, setSelectedPin } = useApp()
  const groups = resolveGroups(chip)
  const note = FAMILY_ROUTING_NOTE[chip.family]

  const select = (gpio: number) => {
    const pin = chip.pins.find(p => p.gpio === gpio)
    if (pin) setSelectedPin(pin)
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-300 mb-1">
          🔀 Peripheral routing - GPIO matrix &amp; IO MUX
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          The {chip.family} routes most peripherals through its GPIO matrix, so these can use{' '}
          <span className="text-gray-200 font-medium">almost any free GPIO</span>:{' '}
          {MATRIX_PERIPHERALS.map((p, i) => (
            <span key={p}>
              {i > 0 && <span className="text-gray-600"> · </span>}
              <span className="text-emerald-300/90 font-mono text-[11px]">{p}</span>
            </span>
          ))}
          . Pin choice for those is mostly about avoiding the constraints shown above.
        </p>
        {note && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{note}</p>}
      </div>

      {groups.length > 0 && (
        <div className="space-y-2">
          {groups.map(g => (
            <div key={g.id} className="rounded-lg bg-gray-800/50 px-3 py-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-xs font-semibold text-gray-200">{g.name}</span>
                <span className="flex flex-wrap gap-1">
                  {g.present.map(p => (
                    <button
                      key={p.gpio}
                      onClick={() => select(p.gpio)}
                      title={`GPIO${p.gpio} - ${p.role}. Click for details.`}
                      className="font-mono text-[10px] leading-none rounded-sm px-1.5 py-1 bg-gray-700/80 text-gray-200 hover:bg-violet-800 transition-colors"
                    >
                      {p.role}:{p.gpio}
                    </button>
                  ))}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                {g.desc}
                {g.missing.length > 0 && (
                  <span className="text-gray-600">
                    {' '}Not broken out on this module: {g.missing.map(m => `${m.role} (GPIO${m.gpio})`).join(', ')}.
                  </span>
                )}
              </p>
            </div>
          ))}

        </div>
      )}

      <p className="text-[10px] text-gray-600 leading-relaxed">
        Advanced: the GPIO matrix can even loop a peripheral output back into another peripheral's
        input on-chip, without using any pin at all - see the Technical Reference Manual.
      </p>
    </div>
  )
}
