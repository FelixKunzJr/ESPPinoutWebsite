import type { Chip } from '../../types/chip'
import { boardInfoIssueUrl } from '../../utils/github'

// Empty-state for a board-info section that has no content yet: a thin, muted
// line (not a heavy card) with a subtle contribute link - so undocumented
// sections stay out of the way instead of looking like broken empty boxes.
export function EmptyInfoLine({ chip, section, label, addText }: {
  chip: Chip
  section: 'flashing' | 'esphome'
  label: string
  addText: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-700">not documented yet</span>
      <a
        href={boardInfoIssueUrl(chip, section)}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
      >
        {addText}
      </a>
    </div>
  )
}
