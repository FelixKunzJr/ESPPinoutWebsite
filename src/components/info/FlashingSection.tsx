// src/components/info/FlashingSection.tsx
import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { CollapsibleCard } from '../CollapsibleCard'
import { EmptyInfoLine } from './EmptyInfoLine'

export function FlashingSection() {
  const { chip } = useApp()
  const { flashing } = resolveInfo(chip)
  const isBoard = chip.module?.form === 'board'

  // No content to show (not seeded, not an auto-flash dev board): render a slim
  // muted contribute line instead of an empty card.
  if (!flashing && !isBoard) {
    return <EmptyInfoLine chip={chip} section="flashing" label="🔗 Flashing / wiring" addText="Add flashing steps →" />
  }

  return (
    <CollapsibleCard title="🔗 Flashing / wiring" defaultOpen={false}>
      {flashing ? (
        <div className="space-y-2 text-xs text-gray-300">
          {flashing.autoFlash
            ? <p>USB auto-flash: connect USB and upload. If it will not enter download mode, hold BOOT, tap EN/RST, then release BOOT.</p>
            : flashing.wiring && <p className="text-gray-200">{flashing.wiring}</p>}
          {flashing.manualSteps && (
            <ol className="list-decimal pl-4 space-y-1 text-gray-400">
              {flashing.manualSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          {flashing.note && <p className="text-gray-500">{flashing.note}</p>}
        </div>
      ) : (
        <p className="text-xs text-gray-300">
          Most dev boards have an onboard USB-serial chip with auto-reset: just connect USB and upload. If it will not enter download mode, hold BOOT, tap EN/RST, then release BOOT.
        </p>
      )}
    </CollapsibleCard>
  )
}
