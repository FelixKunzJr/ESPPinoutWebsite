import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { CHIPS } from '../data/chips/index'
import type { Chip, Pin, PinAssignment, FilterKey } from '../types/chip'

export type DiagramView = 'schematic' | 'module'
export type Page = 'studio' | 'contribute'

interface AppState {
  chip: Chip
  setChip: (id: string) => void
  page: Page
  navigate: (to: Page) => void
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

// Chip encoded in the current URL: path (/esp32s3, canonical) with the
// legacy hash format (#base64{c,m}) as fallback for old shared links.
function chipFromLocation(): Chip | null {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  if (path) {
    const found = CHIPS.find(c => c.id === path)
    if (found) return found
  }
  const hash = window.location.hash.slice(1)
  if (hash) {
    const decoded = decodeState(hash)
    if (decoded) {
      const found = CHIPS.find(c => c.id === decoded.chipId)
      if (found) return found
    }
  }
  return null
}

// Non-chip pages live at their own path (e.g. /contribute); everything else
// is the studio (a chip page).
function pageFromLocation(): Page {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()
  return path === 'contribute' ? 'contribute' : 'studio'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [chip, setChipState] = useState<Chip>(() => chipFromLocation() ?? CHIPS[0])
  const [page, setPage] = useState<Page>(() => pageFromLocation())

  const navigate = useCallback((to: Page) => {
    const path = to === 'contribute' ? '/contribute' : `/${chip.id}`
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    setPage(to)
    window.scrollTo(0, 0)
  }, [chip.id])

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

  const shareUrl = `${window.location.origin}/${chip.id}${mapping.length ? `#${encodeState(chip.id, mapping)}` : ''}`

  // Keep the URL in sync: chip lives in the path (one history entry per chip),
  // the pin mapping lives in the hash (replaced in place, no history spam).
  useEffect(() => {
    if (page !== 'studio') return
    const path = `/${chip.id}`
    const hash = mapping.length ? `#${encodeState(chip.id, mapping)}` : ''
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path + hash)
    } else if ((window.location.hash || '') !== hash) {
      window.history.replaceState({}, '', path + hash)
    }
    document.title = `${chip.name} pinout | ESP32 Pinout Studio`
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = `https://esp32pin.com${path}`
  }, [chip.id, chip.name, mapping, page])

  // Browser back/forward between chips
  useEffect(() => {
    const onPop = () => {
      setPage(pageFromLocation())
      const found = chipFromLocation() ?? CHIPS[0]
      const decoded = decodeState(window.location.hash.slice(1))
      setChipState(prev => (prev.id === found.id ? prev : found))
      setSelectedPin(null)
      setMapping(decoded && decoded.chipId === found.id ? decoded.mapping : [])
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

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
      page, navigate,
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
