import type { Chip } from '../../types/chip'
import type { ChipSpecs } from '../chips/specs'
import { FAMILY_SPECS, SKU_OVERRIDES } from '../chips/specs'
import type { InfoOverlay } from './types'
import { familyFlashing } from './flashing'

export interface BoardInfo {
  specs: ChipSpecs
  flashing?: InfoOverlay['flashing']
}

// Community-contributable content: one JSON file per chip/board id under
// contrib/info/. Dropping in a file is enough - no code edit needed.
const modules = import.meta.glob<{ default: InfoOverlay }>(
  '../../../contrib/info/*.json',
  { eager: true },
)
const OVERLAY: Record<string, InfoOverlay> = {}
for (const [path, mod] of Object.entries(modules)) {
  const id = path.split('/').pop()!.replace(/\.json$/, '')
  OVERLAY[id] = mod.default
}

export function resolveInfo(chip: Chip): BoardInfo {
  const base = FAMILY_SPECS[chip.family]
  const sku = SKU_OVERRIDES[chip.id]
  const specs: ChipSpecs = { ...base, ...(sku ?? {}) }
  const overlay = OVERLAY[chip.id]
  // A per-id overlay wins; otherwise use the verified family default (bare
  // modules). Normalize the null from familyFlashing to undefined.
  return { specs, flashing: overlay?.flashing ?? familyFlashing(chip) ?? undefined }
}
