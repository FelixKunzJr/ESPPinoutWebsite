import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Logo } from './Logo'
import { REPO_URL, ISSUE_CHOOSE_URL, CONTRIBUTING_URL } from '../utils/github'

const TEMPLATE = (file: string) => `${REPO_URL}/issues/new?template=${file}`

interface Path {
  tag: string
  title: string
  body: string
  cta: string
  href: string
  accent: string
}

const PATHS: Path[] = [
  {
    tag: 'Anyone',
    title: 'Fix a pin or report a gotcha',
    body: 'A pin, constraint, or warning that is wrong, missing, or misleading. Takes a minute and it is the single most useful thing you can send.',
    cta: 'Report incorrect data',
    href: TEMPLATE('report-data-error.yml'),
    accent: 'text-amber-400',
  },
  {
    tag: 'Anyone',
    title: 'Request a board',
    body: 'Want a chip, module, or dev board added? Requests that come with a KiCad file or a datasheet link get added fastest.',
    cta: 'Request a board',
    href: TEMPLATE('request-board.yml'),
    accent: 'text-sky-400',
  },
  {
    tag: 'Power users',
    title: 'Submit board data or gotchas',
    body: 'You have pin data, KiCad files, or hard-won gotchas for one board or fifteen. Dump them all in a single issue and I will split it up from there.',
    cta: 'Submit board data',
    href: TEMPLATE('board-data-submission.yml'),
    accent: 'text-green-400',
  },
]

export function ContributePage() {
  const { navigate } = useApp()

  useEffect(() => {
    document.title = 'Contribute | ESP32 Pinout Studio'
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const prev = canonical?.href
    if (canonical) canonical.href = 'https://esp32pin.com/contribute'
    return () => { if (canonical && prev) canonical.href = prev }
  }, [])

  return (
    <div className="app-shell min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950/95 backdrop-blur z-40">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('studio')}
            className="text-left"
          >
            <h1 className="m-0"><Logo /></h1>
          </button>
          <button
            onClick={() => navigate('studio')}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            &larr; Back to pinouts
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-screen-lg mx-auto w-full px-6 py-10 space-y-10">
        <section className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Help build the most accurate ESP32 pin reference</h2>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            This is a community-maintained reference, and it is only as good as the data in it. If you have caught a
            mistake, want a board added, or learned a gotcha the hard way, here is how to get it in.
          </p>
        </section>

        <section className="rounded-xl border border-green-800/50 bg-green-950/20 px-5 py-4">
          <p className="text-sm font-semibold text-green-400 mb-1">The one rule: cite a source</p>
          <p className="text-sm text-green-100/70 leading-relaxed">
            Accuracy is the whole point. Every pin fact should point at a datasheet section, an errata note, or a
            KiCad library. Unsourced pin data is what every wrong pinout on the internet is made of, so we do not add
            to the pile. A gotcha you hit in real life counts as a source, just tell us what happened.
          </p>
        </section>

        <section className="rounded-xl border border-green-700/60 bg-green-950/25 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">The easiest way to add a board</h3>
            <p className="text-sm text-green-100/75 leading-relaxed max-w-xl">
              Use the Board Builder: pick the base chip, map the headers to GPIOs in your browser, watch the live
              preview, and export it. No KiCad, no code, no JSON by hand. Best for dev and combo boards.
            </p>
          </div>
          <button
            onClick={() => navigate('build')}
            className="shrink-0 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold text-white transition-colors"
          >
            Open the Board Builder &rarr;
          </button>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Other ways to help</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {PATHS.map(p => (
              <div key={p.title} className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${p.accent} mb-2`}>{p.tag}</span>
                <h4 className="text-sm font-semibold text-gray-100 mb-2">{p.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed flex-1">{p.body}</p>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-plain mt-4 inline-block text-center px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-100 transition-colors"
                >
                  {p.cta} &rarr;
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Not sure which one?{' '}
            <a href={ISSUE_CHOOSE_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 underline hover:text-gray-200">
              Pick a template on GitHub
            </a>
            . The hand-found gotchas are worth more than the pinouts, so never leave those out.
          </p>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 space-y-2">
          <h3 className="text-lg font-semibold">Make a board that ships KiCad files?</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            The entire dataset is generated straight from Espressif&apos;s official KiCad libraries, not hand-copied
            from datasheets. So if your board (Seeed, Waveshare, LILYGO, and friends) ships a KiCad symbol and
            footprint, that is the exact raw material the generator already consumes. Send a link in a{' '}
            <a href={TEMPLATE('board-data-submission.yml')} target="_blank" rel="noopener noreferrer" className="text-green-400 underline hover:text-green-300">
              board data issue
            </a>{' '}
            and adding it is mostly a formality.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Want to wire up a board yourself?</h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            Pull requests are welcome. It is not a plain edit-a-JSON-file repo, boards flow through a KiCad generator,
            so read the guide first so your PR does not fight the pipeline.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={CONTRIBUTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-plain px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-sm font-medium text-white transition-colors"
            >
              Read the contributor guide &rarr;
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-plain px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-100 transition-colors"
            >
              Browse the repo on GitHub &rarr;
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800">
        <div className="max-w-screen-lg mx-auto w-full px-6 py-6 text-xs text-gray-600">
          Thanks for making the reference better. Every correction and gotcha helps the next person not fry their project.
        </div>
      </footer>
    </div>
  )
}
