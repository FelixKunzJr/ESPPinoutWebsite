import { CHIPS } from '../data/chips/index'
import { useApp } from '../context/AppContext'
import type { Chip } from '../types/chip'

const FAMILY_ACCENT: Record<string, string> = {
  'ESP32':    '#3b82f6',
  'ESP32-S2': '#a855f7',
  'ESP32-S3': '#22c55e',
  'ESP32-C3': '#eab308',
  'ESP32-C6': '#f97316',
  'ESP32-C5': '#14b8a6',
  'ESP32-H2': '#ec4899',
}

const isBoard = (c: Chip) => c.module?.form === 'board'

export function ChipSelector() {
  const { chip, setChip } = useApp()

  const modules = CHIPS.filter(c => !isBoard(c))
  const boards  = CHIPS.filter(isBoard)

  // Group modules by family, preserving catalog order.
  const families: { name: string; chips: Chip[] }[] = []
  for (const c of modules) {
    let g = families.find(f => f.name === c.family)
    if (!g) { g = { name: c.family, chips: [] }; families.push(g) }
    g.chips.push(c)
  }

  function Pill({ c, full = false }: { c: Chip; full?: boolean }) {
    const accent = FAMILY_ACCENT[c.family] ?? '#64748b'
    const active = chip.id === c.id
    // In family rows we strip the family prefix; in the boards row we keep more context.
    const short = full
      ? c.name.replace(/^ESP32-/, '')
      : (c.name.startsWith(c.family) ? c.name.slice(c.family.length).replace(/^-/, '') : c.name) || c.name
    return (
      <button
        onClick={() => setChip(c.id)}
        className="rounded-md text-[12.5px] font-semibold transition-all duration-150 leading-none"
        style={{
          padding: '6px 11px',
          color: active ? '#fff' : '#cbd5e1',
          background: active ? accent : 'rgba(255,255,255,0.03)',
          border: `1px solid ${active ? accent : 'rgba(255,255,255,0.09)'}`,
          boxShadow: active ? `0 2px 12px ${accent}55` : 'none',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = '#fff' } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#cbd5e1' } }}
      >
        {short}
      </button>
    )
  }

  function GroupLabel({ name, color }: { name: string; color: string }) {
    return (
      <span className="flex items-center gap-1.5 flex-shrink-0" style={{ width: 92 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: color, boxShadow: `0 0 6px ${color}` }} />
        <span className="font-bold tracking-wide" style={{ fontSize: 11, color }}>{name}</span>
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {families.map(f => (
        <div key={f.name} className="flex items-center gap-2 flex-wrap">
          <GroupLabel name={f.name} color={FAMILY_ACCENT[f.name] ?? '#64748b'} />
          {f.chips.map(c => <Pill key={c.id} c={c} />)}
        </div>
      ))}

      {boards.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-1.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <GroupLabel name="BOARDS" color="#94a3b8" />
          {boards.map(c => <Pill key={c.id} c={c} full />)}
        </div>
      )}
    </div>
  )
}
