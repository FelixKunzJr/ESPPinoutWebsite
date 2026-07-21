import { useState } from 'react'
import { ChipSelector }    from './components/ChipSelector'
import { RoutingCard }     from './components/RoutingCard'
import { FilterBar }       from './components/FilterBar'
import { PinoutDiagram }   from './components/PinoutDiagram'
import { PinTable }        from './components/PinTable'
import { PinDetailPanel }  from './components/PinDetailPanel'
import { MappingBuilder }  from './components/MappingBuilder'
import { ExportPanel }     from './components/ExportPanel'
import { CommunitySubmit } from './components/CommunitySubmit'
import { ContributePage } from './components/ContributePage'
import { BoardBuilderPage } from './components/BoardBuilderPage'
import { CollapsibleCard } from './components/CollapsibleCard'
import { ExportActions }   from './components/ExportActions'
import { MobileActionBar } from './components/MobileActionBar'
import { useMediaQuery }   from './utils/useMediaQuery'
import { IconWarning, IconSun, IconMoon } from './components/icons'
import { useApp }          from './context/AppContext'
import { Logo }            from './components/Logo'
import { SpecsSection }    from './components/info/SpecsSection'
import { FlashingSection } from './components/info/FlashingSection'

export default function App() {
  const { chip, page, navigate, theme, toggleTheme } = useApp()

  // Phones get the diagram plus a bottom action bar; everything else moves
  // into sheets. Tablets and up keep the full page.
  const isPhone = useMediaQuery('(max-width: 767px)')
  // The right-hand column is collapsible so the diagram can have the full
  // width - it only exists at xl, where the two-column grid applies.
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try { return localStorage.getItem('sidebar-open') !== 'false' } catch { return true }
  })
  const toggleSidebar = () => setSidebarOpen(o => {
    try { localStorage.setItem('sidebar-open', String(!o)) } catch { /* private mode */ }
    return !o
  })

  if (page === 'contribute') return <ContributePage />
  if (page === 'build') return <BoardBuilderPage />

  return (
    <div className="app-shell min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950/95 backdrop-blur z-40">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="m-0"><Logo /></h1>
              <p className="text-xs text-gray-500 hidden sm:block border-l border-gray-800 pl-3">
                Free interactive pinout reference<br />for the maker community
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* PNG / PDF live here as well as in the export panel: the
                  header is sticky, so they are reachable from anywhere on
                  the page instead of only after scrolling to the sidebar. */}
              <ExportActions variant="header" />
              <button
                onClick={toggleSidebar}
                aria-pressed={!sidebarOpen}
                className="hidden xl:inline text-xs text-gray-400 hover:text-gray-100"
                title={sidebarOpen ? 'Hide the side panel' : 'Show the side panel'}
              >
                {sidebarOpen ? '⇥ Hide panel' : '⇤ Show panel'}
              </button>
              <button
                onClick={toggleTheme}
                className="text-xs text-gray-400 hover:text-gray-100"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {/* Icon-only on small screens: the header has no room for
                    the label there. */}
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
                  <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </span>
              </button>
              <button
                onClick={() => navigate('contribute')}
                className="hidden sm:inline text-xs text-gray-400 hover:text-gray-100"
              >
                Contribute
              </button>
              <a
                href="https://github.com/FelixKunzJr/ESPPinoutWebsite"
                target="_blank"
                rel="noopener noreferrer"
                className="link-plain hidden sm:inline text-xs text-gray-400 hover:text-gray-100 whitespace-nowrap"
              >
                GitHub ↗
              </a>
            </div>
          </div>
          <ChipSelector />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-8">
        <div className={`grid grid-cols-1 gap-8 ${sidebarOpen ? 'xl:grid-cols-[1fr_380px]' : ''}`}>
          {/* Left: diagram + filter + table */}
          <div className="space-y-6 min-w-0">
            {/* Chip notes. Collapsible, and closed by default on phones -
                the list runs long enough to push the diagram off screen. */}
            {chip.notes.length > 0 && (
              <CollapsibleCard
                tone="warning"
                defaultOpen={!isPhone}
                title={
                  <span className="inline-flex items-center gap-2">
                    <IconWarning size={16} />
                    {chip.name} - Known Gotchas ({chip.notes.length})
                  </span>
                }
              >
                <ul className="text-sm text-yellow-300/80 space-y-1 list-disc pl-4">
                  {chip.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </CollapsibleCard>
            )}

            <div id="pinout-diagram-export">
              <PinoutDiagram />
            </div>

            <RoutingCard />

            <SpecsSection />

            <FlashingSection />

            {/* On phones the filters and the pin table move into the bottom
                action bar's sheet instead of extending the scroll. */}
            {!isPhone && (
              <>
                <FilterBar />
                <PinTable />
              </>
            )}
          </div>

          {/* Right sidebar */}
          {sidebarOpen && !isPhone && (
            <div className="space-y-6 min-w-0">
              <div className="panel p-4">
                <MappingBuilder />
              </div>
              <div className="panel p-4">
                <ExportPanel />
              </div>
              <div className="panel p-4">
                <CommunitySubmit />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-4">
        <div className="max-w-screen-2xl mx-auto w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://kunzengineering.ch/en"
            target="_blank"
            rel="noopener noreferrer"
            className="link-plain group flex items-center gap-3"
            title="A free tool by Kunz Engineering"
          >
            <span className="flex items-center justify-center rounded-md bg-white px-2.5 py-1.5 shadow-sm">
              <img
                src="/kunz-engineering-mark.png"
                alt="Kunz Engineering"
                width={34}
                height={18}
                style={{ height: 18, width: 'auto', display: 'block' }}
              />
            </span>
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors leading-tight">
              A free tool by<br />
              <span className="font-semibold text-gray-300 group-hover:text-white">Kunz Engineering</span>
              <span className="text-gray-600"> · kunzengineering.ch ↗</span>
            </span>
          </a>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a
              href="https://github.com/FelixKunzJr/ESPPinoutWebsite"
              target="_blank"
              rel="noopener noreferrer"
              className="link-plain hover:text-gray-100 transition-colors"
            >
              Open source on GitHub ↗
            </a>
            <span className="text-gray-700">MIT licensed</span>
          </div>
        </div>
      </footer>

      {/* Pin detail popover (docks to the edge when there is no room to float) */}
      <PinDetailPanel />

      {isPhone && <MobileActionBar />}
    </div>
  )
}
