import { useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { FilterBar } from './FilterBar'
import { PinTable } from './PinTable'
import { MappingBuilder } from './MappingBuilder'
import { ExportPanel } from './ExportPanel'
import { CommunitySubmit } from './CommunitySubmit'
import { IconList, IconSliders, IconDownload, IconMore } from './icons'
import { BottomSheet } from './BottomSheet'

// On a phone the studio was one long scroll: diagram, gotchas, specs,
// flashing, filters, a 40-row pin table, then the mapping builder and export
// panel stacked underneath. Everything below the diagram now lives behind
// this always-visible bar and opens as a bottom sheet, so the diagram stays
// on screen and nothing is more than one tap away.

type SheetId = 'pins' | 'map' | 'export' | 'more'

// Stroke icons rather than emoji: iOS substituted full-color glyphs for the
// emoji, which read as clip-art and could not follow the label's color.
const SHEETS: { id: SheetId; Icon: typeof IconList; label: string; title: string }[] = [
  { id: 'pins',   Icon: IconList,     label: 'Pins',    title: 'Pin table' },
  { id: 'map',    Icon: IconSliders,  label: 'Mapping', title: 'Pin mapping' },
  { id: 'export', Icon: IconDownload, label: 'Export',  title: 'Export' },
  { id: 'more',   Icon: IconMore,     label: 'More',    title: 'Contribute' },
]

// The sheet shell itself lives in BottomSheet - the pin detail panel uses
// the same one, so every sheet in the app dismisses identically.
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <BottomSheet
      ariaLabel={title}
      onClose={onClose}
      header={
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-200">{title}</h2>
          <button
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="text-gray-400 hover:text-gray-100 text-xl leading-none px-2"
          >
            ✕
          </button>
        </div>
      }
    >
      <div className="px-4 py-4 space-y-4">{children}</div>
    </BottomSheet>
  )
}

export function MobileActionBar() {
  const { mapping } = useApp()
  const [open, setOpen] = useState<SheetId | null>(null)
  const close = () => setOpen(null)
  const sheet = SHEETS.find(s => s.id === open)

  return (
    <>
      {/* Reserve the bar's height so the footer can still be scrolled clear. */}
      <div aria-hidden="true" style={{ height: 'calc(60px + env(safe-area-inset-bottom))' }} />

      <nav
        aria-label="Sections"
        className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-800 bg-gray-950/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4">
          {SHEETS.map(s => (
            <button
              key={s.id}
              onClick={() => setOpen(s.id)}
              className="flex flex-col items-center justify-center gap-1 py-2 text-gray-200 hover:text-white transition-colors"
            >
              <span className="relative">
                <s.Icon size={20} />
                {s.id === 'map' && mapping.length > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 rounded-full bg-indigo-600 px-1.5 text-[11px] font-semibold text-white">
                    {mapping.length}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{s.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {sheet && (
        <Sheet title={sheet.title} onClose={close}>
          {sheet.id === 'pins' && <><FilterBar /><PinTable /></>}
          {sheet.id === 'map' && <MappingBuilder />}
          {sheet.id === 'export' && <ExportPanel />}
          {sheet.id === 'more' && <CommunitySubmit />}
        </Sheet>
      )}
    </>
  )
}
