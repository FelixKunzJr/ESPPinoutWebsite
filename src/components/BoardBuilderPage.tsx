import { useEffect, useMemo, useState } from 'react'
import { useApp, AppContext, type AppState, type DiagramView } from '../context/AppContext'
import { CHIPS } from '../data/chips/index'
import { resolveBoard } from '../data/boards/resolveBoard'
import type { BoardSpec, HeaderPad } from '../data/boards/types'
import { boardDataIssueUrl, CONTRIBUTING_URL } from '../utils/github'
import { PinoutDiagram } from './PinoutDiagram'

type PadDraft = { kind: 'gpio' | 'power'; gpio?: number; label?: string; note?: string }
type Side = 'left' | 'right'
interface Draft {
  name: string
  baseChip: string
  pcb: 'black' | 'green'
  notesText: string
  left: PadDraft[]
  right: PadDraft[]
}

const POWER_LABELS = ['GND', '3V3', '5V', 'VIN', 'EN', 'NC']
const DRAFT_KEY = 'board-builder-draft'
const BASES = CHIPS.filter(c => c.module?.form !== 'board')

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const EMPTY: Draft = {
  name: '',
  baseChip: 'esp32s3',
  pcb: 'black',
  notesText: '',
  left: [{ kind: 'power', label: '5V' }, { kind: 'power', label: 'GND' }, { kind: 'gpio', gpio: 1 }],
  right: [{ kind: 'gpio', gpio: 44 }, { kind: 'gpio', gpio: 43 }],
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return EMPTY
}

function toSpec(d: Draft): BoardSpec {
  const overrides: Record<string, { label?: string; note?: string }> = {}
  const pads = (drafts: PadDraft[]): HeaderPad[] =>
    drafts.map(p => {
      if (p.kind === 'power') return { label: p.label || 'NC' }
      if (p.gpio !== undefined && (p.label || p.note)) {
        overrides[String(p.gpio)] = { ...(p.label ? { label: p.label } : {}), ...(p.note ? { note: p.note } : {}) }
      }
      return { gpio: p.gpio }
    })
  const left = pads(d.left)
  const right = pads(d.right)
  return {
    id: slug(d.name) || 'untitled-board',
    name: d.name || 'Untitled board',
    baseChip: d.baseChip,
    pcb: d.pcb,
    notes: d.notesText.split('\n').map(s => s.trim()).filter(Boolean),
    headers: { left, right },
    ...(Object.keys(overrides).length ? { overrides } : {}),
  }
}

export function BoardBuilderPage() {
  const { navigate } = useApp()
  const [draft, setDraft] = useState<Draft>(loadDraft)
  const [pview, setPview] = useState<DiagramView>('module')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Board Builder | ESP32 Pinout Studio'
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch { /* ignore */ }
  }, [draft])

  const base = useMemo(() => CHIPS.find(c => c.id === draft.baseChip), [draft.baseChip])
  const spec = useMemo(() => toSpec(draft), [draft])
  const json = useMemo(() => JSON.stringify(spec, null, 2), [spec])
  const result = useMemo(() => resolveBoard(spec, base), [spec, base])

  const gpioOptions = useMemo(
    () => (base ? [...base.pins].sort((a, b) => a.gpio - b.gpio) : []),
    [base],
  )

  const previewValue: AppState | null = useMemo(() => {
    if (!result.chip) return null
    return {
      chip: result.chip,
      setChip: () => {},
      page: 'build', navigate: () => {},
      view: pview, setView: setPview,
      theme: 'dark', toggleTheme: () => {},
      selectedPin: null, setSelectedPin: () => {},
      filter: 'all', setFilter: () => {},
      mapping: [], assignPin: () => {}, unassignPin: () => {}, clearMapping: () => {},
      shareUrl: '',
    }
  }, [result.chip, pview])

  const patch = (p: Partial<Draft>) => setDraft(d => ({ ...d, ...p }))
  const setPads = (side: Side, pads: PadDraft[]) => patch({ [side]: pads } as Partial<Draft>)
  const updatePad = (side: Side, i: number, p: Partial<PadDraft>) =>
    setPads(side, draft[side].map((pad, j) => (j === i ? { ...pad, ...p } : pad)))
  const addPad = (side: Side) => {
    const used = new Set(
      [...draft.left, ...draft.right]
        .filter(p => p.kind === 'gpio' && p.gpio !== undefined)
        .map(p => p.gpio),
    )
    const next = (gpioOptions.find(p => !used.has(p.gpio)) ?? gpioOptions[0])?.gpio
    setPads(side, [...draft[side], { kind: 'gpio', gpio: next }])
  }
  const removePad = (side: Side, i: number) => setPads(side, draft[side].filter((_, j) => j !== i))
  const movePad = (side: Side, i: number, dir: -1 | 1) => {
    const next = [...draft[side]]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setPads(side, next)
  }

  const copyJson = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }
  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${spec.id}.board.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const fieldCls = 'bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-100'

  return (
    <div className="app-shell min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950/95 backdrop-blur z-40">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('studio')} className="text-left">
            <h1 className="text-lg font-bold text-green-400">Board Builder</h1>
            <p className="text-xs text-gray-500">Add a dev board with no KiCad and no code.</p>
          </button>
          <button onClick={() => navigate('contribute')} className="text-xs text-gray-500 hover:text-gray-300">
            &larr; Back to contribute
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,460px)_1fr] gap-6">
        {/* Editor */}
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-gray-400 space-y-1">
                <span>Board name</span>
                <input className={`${fieldCls} w-full`} value={draft.name}
                  onChange={e => patch({ name: e.target.value })} placeholder="LILYGO T-Display-S3" />
              </label>
              <label className="text-xs text-gray-400 space-y-1">
                <span>Base chip</span>
                <select className={`${fieldCls} w-full`} value={draft.baseChip}
                  onChange={e => patch({ baseChip: e.target.value })}>
                  {BASES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-gray-400 space-y-1">
                <span>PCB color</span>
                <select className={`${fieldCls} w-full`} value={draft.pcb}
                  onChange={e => patch({ pcb: e.target.value as 'black' | 'green' })}>
                  <option value="black">black</option>
                  <option value="green">green</option>
                </select>
              </label>
              <div className="text-xs text-gray-500 space-y-1">
                <span>id</span>
                <div className="px-2 py-1 font-mono text-gray-400">{spec.id}</div>
              </div>
            </div>
          </div>

          {(['left', 'right'] as Side[]).map(side => (
            <div key={side} className="rounded-xl border border-gray-800 bg-gray-900/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-300 capitalize">{side} header</h3>
                <button onClick={() => addPad(side)} className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">+ pad</button>
              </div>
              <div className="space-y-1.5">
                {draft[side].map((pad, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="font-mono text-[10px] text-gray-600 w-5 pt-1.5 text-right">{i + 1}</span>
                    <select className={fieldCls} value={pad.kind}
                      onChange={e => updatePad(side, i, e.target.value === 'power'
                        ? { kind: 'power', label: 'GND', gpio: undefined, note: undefined }
                        : { kind: 'gpio', gpio: gpioOptions[0]?.gpio, label: undefined })}>
                      <option value="gpio">GPIO</option>
                      <option value="power">Power/GND</option>
                    </select>
                    {pad.kind === 'gpio' ? (
                      <div className="flex-1 space-y-1">
                        <div className="flex gap-1.5">
                          <select className={`${fieldCls} flex-1`} value={pad.gpio ?? ''}
                            onChange={e => updatePad(side, i, { gpio: Number(e.target.value) })}>
                            {gpioOptions.map(p => <option key={p.gpio} value={p.gpio}>GPIO{p.gpio}</option>)}
                          </select>
                          <input className={`${fieldCls} w-24`} value={pad.label ?? ''} placeholder="silk label"
                            onChange={e => updatePad(side, i, { label: e.target.value })} />
                        </div>
                        <input className={`${fieldCls} w-full`} value={pad.note ?? ''} placeholder="gotcha (optional)"
                          onChange={e => updatePad(side, i, { note: e.target.value })} />
                      </div>
                    ) : (
                      <select className={`${fieldCls} flex-1`} value={pad.label ?? 'GND'}
                        onChange={e => updatePad(side, i, { label: e.target.value })}>
                        {POWER_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    )}
                    <div className="flex flex-col">
                      <button onClick={() => movePad(side, i, -1)} className="text-[10px] text-gray-600 hover:text-gray-300 leading-none">▲</button>
                      <button onClick={() => movePad(side, i, 1)} className="text-[10px] text-gray-600 hover:text-gray-300 leading-none">▼</button>
                    </div>
                    <button onClick={() => removePad(side, i)} className="text-xs text-gray-600 hover:text-red-400 pt-0.5">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">Board gotchas</h3>
            <textarea className={`${fieldCls} w-full h-20`} value={draft.notesText}
              onChange={e => patch({ notesText: e.target.value })}
              placeholder="One per line, e.g. On-board 3.3V regulator is only good for ~500mA." />
          </div>
        </div>

        {/* Preview + validation + export */}
        <div className="space-y-4">
          {result.errors.length > 0 && (
            <div className="rounded-xl border border-red-800/60 bg-red-950/30 p-4">
              <p className="text-xs font-semibold text-red-400 mb-1">Fix these before exporting</p>
              <ul className="text-xs text-red-300/80 list-disc pl-4 space-y-0.5">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          {result.warnings.length > 0 && (
            <div className="rounded-xl border border-yellow-800/50 bg-yellow-950/20 p-4">
              <p className="text-xs font-semibold text-yellow-400 mb-1">Worth a look</p>
              <ul className="text-xs text-yellow-300/80 list-disc pl-4 space-y-0.5">
                {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {previewValue
            ? (
              <div id="pinout-diagram-export">
                <AppContext.Provider value={previewValue}>
                  <PinoutDiagram />
                </AppContext.Provider>
              </div>
            )
            : <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-8 text-center text-sm text-gray-500">Add valid pads to see the live preview.</div>}

          <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button onClick={copyJson} disabled={!result.chip}
                className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs disabled:opacity-40">
                {copied ? '✓ Copied' : 'Copy JSON'}
              </button>
              <button onClick={downloadJson} disabled={!result.chip}
                className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs disabled:opacity-40">
                Download .board.json
              </button>
              <a href={result.chip ? boardDataIssueUrl(spec.name, json) : undefined}
                target="_blank" rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded text-xs text-white ${result.chip ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-800 opacity-40 pointer-events-none'}`}>
                Open GitHub issue &rarr;
              </a>
              <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer"
                className="link-plain px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs">
                Guide
              </a>
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-300">Show BoardSpec JSON</summary>
              <pre className="mt-2 max-h-72 overflow-auto rounded bg-gray-950 border border-gray-800 p-3 text-[11px] text-gray-300">{json}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
