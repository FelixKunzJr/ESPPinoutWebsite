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
import { useApp }          from './context/AppContext'
import { Logo }            from './components/Logo'
import { SpecsSection }    from './components/info/SpecsSection'
import { FlashingSection } from './components/info/FlashingSection'

export default function App() {
  const { chip, page, navigate, theme, toggleTheme } = useApp()

  if (page === 'contribute') return <ContributePage />
  if (page === 'build') return <BoardBuilderPage />

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950/95 backdrop-blur z-40">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="m-0"><Logo /></h1>
              <p className="text-xs text-gray-500 hidden sm:block border-l border-gray-800 pl-3">
                Free interactive pinout reference<br />for the maker community
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="text-xs text-gray-500 hover:text-gray-300"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {/* U+FE0E forces the monochrome text glyph - iOS otherwise
                    renders the sun as a full-color emoji. Icon-only on small
                    screens: the header has no room for the label there. */}
                <span className="whitespace-nowrap text-sm sm:text-xs">
                  {theme === 'dark' ? '☀︎' : '☾︎'}
                  <span className="hidden sm:inline">{theme === 'dark' ? ' Light' : ' Dark'}</span>
                </span>
              </button>
              <button
                onClick={() => navigate('contribute')}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Contribute
              </button>
              <a
                href="https://github.com/FelixKunzJr/ESPPinoutWebsite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-300 whitespace-nowrap"
              >
                GitHub ↗
              </a>
            </div>
          </div>
          <ChipSelector />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* Left: diagram + filter + table */}
          <div className="space-y-4">
            {/* Chip notes banner */}
            {chip.notes.length > 0 && (
              <div className="rounded-xl bg-yellow-950/30 border border-yellow-700/50 px-4 py-3">
                <p className="text-xs font-semibold text-yellow-400 mb-1">⚠️ {chip.name} - Known Gotchas</p>
                <ul className="text-xs text-yellow-300/80 space-y-0.5 list-disc pl-4">
                  {chip.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}

            <div id="pinout-diagram-export">
              <PinoutDiagram />
            </div>

            <RoutingCard />

            <SpecsSection />

            <FlashingSection />

            <FilterBar />

            <PinTable />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
              <MappingBuilder />
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
              <ExportPanel />
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
              <CommunitySubmit />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-4">
        <div className="max-w-screen-2xl mx-auto w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://kunzengineering.ch/en"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3"
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
              className="hover:text-gray-300 transition-colors"
            >
              Open source on GitHub ↗
            </a>
            <span className="text-gray-700">MIT licensed</span>
          </div>
        </div>
      </footer>

      {/* Pin detail slide-in panel */}
      <PinDetailPanel />
    </div>
  )
}
