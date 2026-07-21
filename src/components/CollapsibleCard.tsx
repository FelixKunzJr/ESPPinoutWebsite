import { useId, useState, type ReactNode } from 'react'

export function CollapsibleCard({ title, defaultOpen = true, tone = 'default', children }: {
  title: ReactNode
  defaultOpen?: boolean
  /** 'warning' gives the amber gotchas treatment; 'default' is plain chrome. */
  tone?: 'default' | 'warning'
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  const shell = tone === 'warning'
    ? 'rounded-xl border border-yellow-700/50 bg-yellow-950/30'
    : 'rounded-xl border border-gray-800 bg-gray-900/40'
  const titleColor = tone === 'warning' ? 'text-yellow-400' : 'text-gray-300'

  return (
    <div className={shell}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className={`text-sm font-semibold ${titleColor}`}>{title}</span>
        {/* A bare chevron was too easy to miss on a card this wide, so the
            control says what it does. */}
        <span
          className={`text-xs whitespace-nowrap ${tone === 'warning' ? 'text-yellow-500/90' : 'text-gray-400'}`}
          aria-hidden="true"
        >
          {open ? '▾ Hide' : '▸ Show'}
        </span>
      </button>
      {/* `hidden` rather than unmounting: the collapsed content stays in the
          DOM for in-page search and for the prerendered HTML crawlers see. */}
      <div id={bodyId} hidden={!open} className="px-4 pb-3">{children}</div>
    </div>
  )
}
