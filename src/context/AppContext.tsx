import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { CHIPS } from '../data/chips/index'
import type { Chip, Pin, PinAssignment, FilterKey } from '../types/chip'

export type DiagramView = 'schematic' | 'module'

interface AppState {
  chip: Chip
  setChip: (id: string) => void
  view: DiagramView
  setView: (v: DiagramView) => void
  selectedPin: Pin | null
  setSelectedPin: (pin: Pin | null) => void
  filter: FilterKey
  setFilter: (f: FilterKey) => void
  mapping: PinAssignment[]
  assignPin: (gpio: number, role: PinAssignment['role'], label: string) => void
  unassignPin: (gpio: number) => void
  clearMapping: () => void
  shareUrl: string
}

const AppContext = createContext<AppState | null>(null)

function encodeState(chipId: string, mapping: PinAssignment[]): string {
  const data = { c: chipId, m: mapping.map(a => ({ g: a.gpio, r: a.role, l: a.label })) }
  return btoa(JSON.stringify(data))
}

function decodeState(hash: string): { chipId: string; mapping: PinAssignment[] } | null {
  try {
    const data = JSON.parse(atob(hash))
    return {
      chipId: data.c,
      mapping: (data.m || []).map((a: { g: number; r: string; l: string }) => ({
        gpio: a.g, role: a.r as PinAssignment['role'], label: a.l,
      })),
    }
  } catch { return null }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [chip, setChipState] = useState<Chip>(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const decoded = decodeState(hash)
      if (decoded) {
        const found = CHIPS.find(c => c.id === decoded.chipId)
        if (found) return found
      }
    }
    return CHIPS[0]
  })

  const [view, setViewState] = useState<DiagramView>(() => {
    try {
      const stored = localStorage.getItem('diagram-view')
      if (stored === 'schematic' || stored === 'module') return stored
    } catch { /* private mode etc. */ }
    return 'schematic'
  })

  const setView = useCallback((v: DiagramView) => {
    setViewState(v)
    try { localStorage.setItem('diagram-view', v) } catch { /* ignore */ }
  }, [])

  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [mapping, setMapping] = useState<PinAssignment[]>(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const decoded = decodeState(hash)
      if (decoded) return decoded.mapping
    }
    return []
  })

  const shareUrl = `${window.location.origin}${window.location.pathname}#${encodeState(chip.id, mapping)}`

  // Sync URL hash whenever chip or mapping changes
  useEffect(() => {
    window.location.hash = encodeState(chip.id, mapping)
  }, [chip.id, mapping])

  const setChip = useCallback((id: string) => {
    const found = CHIPS.find(c => c.id === id)
    if (found) { setChipState(found); setSelectedPin(null); setMapping([]) }
  }, [])

  const assignPin = useCallback((gpio: number, role: PinAssignment['role'], label: string) => {
    setMapping(prev => {
      const without = prev.filter(a => a.gpio !== gpio)
      return [...without, { gpio, role, label }]
    })
  }, [])

  const unassignPin = useCallback((gpio: number) => {
    setMapping(prev => prev.filter(a => a.gpio !== gpio))
  }, [])

  const clearMapping = useCallback(() => setMapping([]), [])

  return (
    <AppContext.Provider value={{
      chip, setChip,
      view, setView,
      selectedPin, setSelectedPin,
      filter, setFilter,
      mapping, assignPin, unassignPin, clearMapping,
      shareUrl,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// Exported for tests
export { encodeState, decodeState }
