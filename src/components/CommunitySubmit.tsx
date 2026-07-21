import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { newChipUrl } from '../utils/github'

export function CommunitySubmit() {
  const { chip } = useApp()
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(chip, null, 2)

  const copyJson = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-300">Contribute / Report an Error</h2>
      <p className="text-xs text-gray-400 leading-relaxed">
        Found a mistake? Know a chip we're missing? The data is open source. Copy the JSON below, edit it with the correct pin data, and submit a GitHub issue.
      </p>
      <div className="flex gap-2">
        <button
          onClick={copyJson}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors"
        >
          {copied ? '✓ Copied JSON' : 'Copy current chip JSON'}
        </button>
        <a
          href={newChipUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="link-plain px-3 py-1.5 bg-green-800 hover:bg-green-700 rounded text-xs text-white transition-colors"
        >
          Submit on GitHub →
        </a>
      </div>
    </div>
  )
}
