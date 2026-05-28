import type { Constraint } from '../types/chip'

const SEVERITY_STYLES = {
  danger:  'bg-red-900/40 border border-red-500 text-red-300',
  warning: 'bg-yellow-900/40 border border-yellow-500 text-yellow-300',
  info:    'bg-blue-900/40 border border-blue-400 text-blue-300',
}

const SEVERITY_ICON = { danger: '⛔', warning: '⚠️', info: 'ℹ️' }

interface Props {
  constraint: Constraint
  compact?: boolean
}

export function ConstraintBadge({ constraint, compact = false }: Props) {
  const style = SEVERITY_STYLES[constraint.severity]
  const icon  = SEVERITY_ICON[constraint.severity]

  if (compact) {
    return (
      <span title={constraint.description} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${style}`}>
        {icon} {constraint.title}
      </span>
    )
  }

  return (
    <div className={`rounded-lg p-3 ${style}`}>
      <div className="font-semibold text-sm mb-1">{icon} {constraint.title}</div>
      <div className="text-xs leading-relaxed opacity-90">{constraint.description}</div>
    </div>
  )
}
