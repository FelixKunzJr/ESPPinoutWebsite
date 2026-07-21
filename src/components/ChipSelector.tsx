import { useState, useEffect } from 'react'
import { CHIPS } from '../data/chips/index'
import { useApp } from '../context/AppContext'
import { useMediaQuery } from '../utils/useMediaQuery'
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
// One shade darker per family for light mode - the dark-tuned accents (the
// C3 yellow especially) wash out as a filled tab with white text on white.
const LIGHT_ACCENT: Record<string, string> = {
  '#3b82f6': '#2563eb',
  '#a855f7': '#9333ea',
  '#22c55e': '#16a34a',
  '#eab308': '#ca8a04',
  '#f97316': '#ea580c',
  '#14b8a6': '#0d9488',
  '#ec4899': '#db2777',
  '#94a3b8': '#64748b',
}
const BOARDS = 'Boards'
const BOARD_ACCENT = '#94a3b8'

const isBoard = (c: Chip) => c.module?.form === 'board'
const tabOf = (c: Chip) => (isBoard(c) ? BOARDS : c.family)

export function ChipSelector() {
  const { chip, setChip, theme } = useApp()
  // Wrapping put the Boards list on four rows, pushing the diagram most of a
  // screen down. On phones each row scrolls sideways on one line instead.
  const isPhone = useMediaQuery('(max-width: 767px)')
  const rowClass = isPhone
    ? 'flex gap-1.5 flex-nowrap overflow-x-auto -mx-1 px-1 pb-0.5'
    : 'flex flex-wrap gap-1.5'

  // Tab order: families in catalog order, then Boards.
  const tabs: string[] = []
  for (const c of CHIPS) {
    const t = tabOf(c)
    if (!tabs.includes(t)) tabs.push(t)
  }

  const [tab, setTab] = useState<string>(tabOf(chip))
  // Follow external chip changes (e.g. shared URL) back to the right tab.
  useEffect(() => { setTab(tabOf(chip)) }, [chip.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const accentOf = (t: string) => {
    const a = t === BOARDS ? BOARD_ACCENT : FAMILY_ACCENT[t] ?? '#64748b'
    return theme === 'light' ? LIGHT_ACCENT[a] ?? a : a
  }
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
      <div className={rowClass}>
        {tabs.map(t => {
          const accent = accentOf(t)
          const active = tab === t
          const onChip = tabOf(chip) === t   // this tab holds the currently-selected chip
          return (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className="rounded-md font-bold tracking-wide transition-all duration-150 flex items-center gap-1.5 leading-none flex-shrink-0 whitespace-nowrap"
              style={{
                fontSize: 11.5, padding: '6px 10px',
                color: active ? '#fff' : accent,
                background: active ? accent : 'var(--pill-bg)',
                border: `1px solid ${active ? accent : 'var(--pill-border)'}`,
              }}
            >
              {t === BOARDS ? t.toUpperCase() : t}
              {onChip && !active && <span style={{ width: 5, height: 5, borderRadius: 99, background: accent }} />}
            </button>
          )
        })}
      </div>

      {/* Separator between family tabs and module pills */}
      <div style={{ height: 1, background: 'var(--selector-sep)' }} />

      {/* Modules within the selected tab */}
      <div className={rowClass}>
        {shown.map(c => {
          const accent = accentOf(tab)
          const active = chip.id === c.id
          return (
            <button
              key={c.id}
              onClick={() => setChip(c.id)}
              className="rounded-md text-[12.5px] font-semibold transition-all duration-150 leading-none flex-shrink-0 whitespace-nowrap"
              style={{
                padding: '6px 11px',
                color: active ? '#fff' : 'var(--pill-text)',
                background: active ? accent : 'var(--pill-bg)',
                border: `1px solid ${active ? accent : 'var(--pill-border-dim)'}`,
                boxShadow: active ? `0 2px 12px ${accent}55` : 'none',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = 'var(--pill-text-hover)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--pill-border-dim)'; e.currentTarget.style.color = 'var(--pill-text)' } }}
            >
              {shortLabel(c)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
