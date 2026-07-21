import { useApp } from '../context/AppContext'
import { matrixPeripherals, FAMILY_ROUTING_NOTE, TRM_URLS, resolveGroups } from '../data/routing'

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
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <p className="text-xs font-semibold text-gray-300">
            Peripheral routing - GPIO matrix &amp; IO MUX
          </p>
          {TRM_URLS[chip.family] && (
            <a
              href={TRM_URLS[chip.family]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
              title={`${chip.family} Technical Reference Manual (see the IO MUX and GPIO Matrix chapter)`}
            >
              {chip.family} TRM ↗
            </a>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          The {chip.family} routes most peripherals through its GPIO matrix, so these can use{' '}
          <span className="text-gray-200 font-medium">almost any free GPIO</span>:{' '}
          {matrixPeripherals(chip.family).map((p, i) => (
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
        Advanced (TRM): the matrix can invert any routed signal, feed a peripheral input a constant
        0/1 without using a pin, and loop a peripheral output back into another peripheral on-chip.
        Every pad has configurable drive strength and a hold latch that freezes its state through
        resets and deep sleep.
      </p>
    </div>
  )
}
