import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { boardInfoIssueUrl } from '../../utils/github'
import { CollapsibleCard } from '../CollapsibleCard'

export function EsphomeSection() {
  const { chip } = useApp()
  const { esphome } = resolveInfo(chip)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!esphome) return
    await navigator.clipboard.writeText(esphome.yaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <CollapsibleCard title="⚙ ESPHome config" defaultOpen={false}>
      {esphome ? (
        <div className="space-y-2">
          <pre className="bg-gray-800 border border-gray-700 rounded p-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre">{esphome.yaml}</pre>
          <button onClick={copy} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors">
            {copied ? '✓ Copied' : 'Copy config'}
          </button>
          {esphome.notes && esphome.notes.map((n, i) => (
            <p key={i} className="text-xs text-gray-500 whitespace-pre-line">{n}</p>
          ))}
        </div>
      ) : (
        <a
          href={boardInfoIssueUrl(chip, 'esphome')}
          target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs font-semibold rounded-md px-3 py-1.5"
          style={{ color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.25)' }}
        >
          Add ESPHome config for this board →
        </a>
      )}
    </CollapsibleCard>
  )
}
