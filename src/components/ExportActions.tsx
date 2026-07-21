import { useApp } from '../context/AppContext'
import { exportPng, openPrintSheet } from '../utils/exportDiagram'
import { IconDownload, IconPrinter } from './icons'

// The PNG and PDF actions used to live only at the bottom of the right-hand
// sidebar, so on a long page you had to scroll to reach them. They are now
// rendered in two places: compactly in the sticky header (always reachable)
// and full-width in the export panel.
export function ExportActions({ variant }: { variant: 'header' | 'panel' }) {
  const { chip, view, mapping } = useApp()

  const png = () => exportPng(chip, view)
  const pdf = () => openPrintSheet(chip, view, mapping)

  if (variant === 'header') {
    // Hidden on phones: they crowd the wordmark at 390px, and the bottom
    // action bar already carries Export there.
    return (
      <div className="hidden sm:flex items-center gap-1.5">
        <button
          onClick={png}
          title="Download the current diagram as a PNG"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <IconDownload size={14} /> PNG
        </button>
        <button
          onClick={pdf}
          title="Open an A4 cheat sheet to print or save as PDF"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <IconPrinter size={14} /> PDF
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={png}
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-800 hover:bg-blue-700 rounded text-sm text-white font-medium transition-colors"
      >
        <IconDownload size={15} /> Download Pinout PNG
      </button>
      <button
        onClick={pdf}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm text-gray-200 font-medium transition-colors"
      >
        <IconPrinter size={15} /> Print / Save as PDF
      </button>
      <p className="text-xs text-gray-500 mt-2">
        PNG captures the diagram; PDF makes an A4 cheat sheet with the gotcha list.
      </p>
    </div>
  )
}
