import { useEffect, useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { FilterBar } from './FilterBar'
import { PinTable } from './PinTable'
import { MappingBuilder } from './MappingBuilder'
import { ExportPanel } from './ExportPanel'
import { CommunitySubmit } from './CommunitySubmit'

// On a phone the studio was one long scroll: diagram, gotchas, specs,
// flashing, filters, a 40-row pin table, then the mapping builder and export
// panel stacked underneath. Everything below the diagram now lives behind
// this always-visible bar and opens as a bottom sheet, so the diagram stays
// on screen and nothing is more than one tap away.

type SheetId = 'pins' | 'map' | 'export' | 'more'

// Text labels, no icons: the emoji glyphs iOS substituted here read as
// clip-art next to the rest of the interface.
const SHEETS: { id: SheetId; label: string; title: string }[] = [
  { id: 'pins',   label: 'Pins',   title: 'Pin table' },
  { id: 'map',    label: 'Mapping', title: 'Pin mapping' },
  { id: 'export', label: 'Export', title: 'Export' },
  { id: 'more',   label: 'More',   title: 'Contribute' },
]

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  // Lock the page behind the sheet so a scroll gesture moves the sheet's own
  // content rather than the studio underneath it.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative rounded-t-2xl border-t border-gray-700 bg-gray-950 flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
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
        <div className="overflow-y-auto px-4 py-4 space-y-4">{children}</div>
      </div>
    </div>
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
      <div aria-hidden="true" style={{ height: 'calc(52px + env(safe-area-inset-bottom))' }} />

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
              className="flex items-center justify-center gap-1 py-3.5 text-sm font-medium text-gray-200 hover:text-white transition-colors"
            >
              {s.label}
              {s.id === 'map' && mapping.length > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 text-xs text-white">
                  {mapping.length}
                </span>
              )}
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
