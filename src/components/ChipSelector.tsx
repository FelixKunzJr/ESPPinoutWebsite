import { useState, useEffect } from 'react'
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
const BOARDS = 'Boards'
const BOARD_ACCENT = '#94a3b8'

const isBoard = (c: Chip) => c.module?.form === 'board'
const tabOf = (c: Chip) => (isBoard(c) ? BOARDS : c.family)

export function ChipSelector() {
  const { chip, setChip } = useApp()

  // Tab order: families in catalog order, then Boards.
  const tabs: string[] = []
  for (const c of CHIPS) {
    const t = tabOf(c)
    if (!tabs.includes(t)) tabs.push(t)
  }

  const [tab, setTab] = useState<string>(tabOf(chip))
  // Follow external chip changes (e.g. shared URL) back to the right tab.
  useEffect(() => { setTab(tabOf(chip)) }, [chip.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const accentOf = (t: string) => (t === BOARDS ? BOARD_ACCENT : FAMILY_ACCENT[t] ?? '#64748b')
  const shown = CHIPS.filter(c => tabOf(c) === tab)

  // Switching family immediately loads that family's first module -
  // a tab that only changes the second row feels like a dead click.
  const selectTab = (t: string) => {
    setTab(t)
    if (tabOf(chip) !== t) {
      const first = CHIPS.find(c => tabOf(c) === t)
      if (first) setChip(first.id)
    }
  }

  const shortLabel = (c: Chip) => {
    if (isBoard(c)) return c.name.replace(/^ESP32-/, '')
    return (c.name.startsWith(c.family) ? c.name.slice(c.family.length).replace(/^-/, '') : c.name) || c.name
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Family tabs */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map(t => {
          const accent = accentOf(t)
          const active = tab === t
          const onChip = tabOf(chip) === t   // this tab holds the currently-selected chip
          return (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className="rounded-md font-bold tracking-wide transition-all duration-150 flex items-center gap-1.5 leading-none"
              style={{
                fontSize: 11.5, padding: '6px 10px',
                color: active ? '#fff' : accent,
                background: active ? accent : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? accent : 'rgba(255,255,255,0.10)'}`,
              }}
            >
              {t === BOARDS ? t.toUpperCase() : t}
              {onChip && !active && <span style={{ width: 5, height: 5, borderRadius: 99, background: accent }} />}
            </button>
          )
        })}
      </div>

      {/* Separator between family tabs and module pills */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

      {/* Modules within the selected tab */}
      <div className="flex flex-wrap gap-1.5">
        {shown.map(c => {
          const accent = accentOf(tab)
          const active = chip.id === c.id
          return (
            <button
              key={c.id}
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
              {shortLabel(c)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
