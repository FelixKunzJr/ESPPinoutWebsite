import { useApp } from '../context/AppContext'
import { ModuleDiagram } from './pinout/ModuleDiagram'
import { SchematicDiagram } from './pinout/SchematicDiagram'
import { legendFor } from './pinout/shared'
import { reportMistakeUrl } from '../utils/github'

const VIEWS = [
  { id: 'schematic', label: 'Schematic' },
  { id: 'module',    label: 'Module' },
] as const

export function PinoutDiagram() {
  const { chip, view, setView, selectedPin } = useApp()

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--dg-bg)', borderColor: 'var(--dg-border)' }}>
      {/* Header: chip context + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3">
        <span className="font-mono truncate" style={{ fontSize: 11, color: 'var(--dg-muted)' }}>
          {chip.name} · {view === 'schematic' ? 'logical pinout' : 'physical module, top view'}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={reportMistakeUrl(chip, selectedPin)}
          target="_blank"
          rel="noopener noreferrer"
          className="link-plain report-mistake font-semibold rounded-md transition-colors"
          title="Something wrong on this diagram? Open a prefilled GitHub issue."
          style={{
            fontSize: 11, padding: '4px 10px', lineHeight: '16px',
            color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.25)',
          }}
        >
          ⚠ Report mistake
        </a>
        <div className="flex rounded-md overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--dg-toggle-border)' }}>
          {VIEWS.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className="font-semibold transition-colors"
              style={{
                fontSize: 11, padding: '4px 13px', lineHeight: '16px',
                color: view === v.id ? '#fff' : 'var(--dg-muted)',
                background: view === v.id ? '#2f4368' : 'transparent',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        </div>
      </div>

      {view === 'schematic' ? <SchematicDiagram /> : <ModuleDiagram />}

      {/* Legend */}
      <div className="px-4 py-2.5 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderTop: '1px solid var(--dg-border)' }}>
        {legendFor(view).map(({ bg, text, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 10 }}>
            <span className="font-mono font-bold rounded-sm flex-shrink-0"
              style={{ background: bg, color: text, fontSize: 8, lineHeight: '14px', height: 14, padding: '0 4px' }}>
              {label.split(' ')[0]}
            </span>
            <span style={{ color: 'var(--dg-muted)' }}>{label}</span>
          </span>
        ))}
      </div>

      <p className="px-4 pb-2.5" style={{ fontSize: 9.5, color: 'var(--dg-muted2)' }}>
        Community-maintained reference. Always verify against the{' '}
        <a href={chip.datasheetUrl} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--dg-link)', textDecoration: 'underline' }}>official datasheet</a>{' '}
        before committing hardware.
      </p>
    </div>
  )
}
