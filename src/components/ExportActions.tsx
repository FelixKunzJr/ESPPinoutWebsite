import { useApp } from '../context/AppContext'
import { exportPng, openPrintSheet } from '../utils/exportDiagram'

// The PNG and PDF actions used to live only at the bottom of the right-hand
// sidebar, so on a long page you had to scroll to reach them. They are now
// rendered in two places: compactly in the sticky header (always reachable)
// and full-width in the export panel.
export function ExportActions({ variant }: { variant: 'header' | 'panel' }) {
  const { chip, view, mapping } = useApp()

  const png = () => exportPng(chip, view)
  const pdf = () => openPrintSheet(chip, view, mapping)

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={png}
          title="Download the current diagram as a PNG"
          className="rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          PNG
        </button>
        <button
          onClick={pdf}
          title="Open an A4 cheat sheet to print or save as PDF"
          className="rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          PDF
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={png}
        className="w-full px-3 py-2 bg-blue-800 hover:bg-blue-700 rounded text-sm text-white font-medium transition-colors"
      >
        Download Pinout PNG
      </button>
      <button
        onClick={pdf}
        className="w-full mt-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm text-gray-200 font-medium transition-colors"
      >
        Print / Save as PDF
      </button>
      <p className="text-xs text-gray-500 mt-2">
        PNG captures the diagram; PDF makes an A4 cheat sheet with the gotcha list.
      </p>
    </div>
  )
}
