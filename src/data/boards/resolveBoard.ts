import type { Chip, Pin, LayoutPin, ModuleInfo, PackageLayout } from '../../types/chip'
import type { BoardSpec, HeaderPad, BoardResult } from './types'

// Turn a BoardSpec into a fully-formed Chip by inheriting everything electrical
// from the base chip and layering the board's header wiring on top. Returns any
// validation errors (which block acceptance) and warnings (worth a human look).
export function resolveBoard(spec: BoardSpec, base: Chip | undefined): BoardResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!spec.id) errors.push('Missing "id".')
  if (!spec.name) errors.push('Missing "name".')
  if (!base) {
    errors.push(`Unknown baseChip "${spec.baseChip}". It must be an existing chip id.`)
    return { chip: null, errors, warnings }
  }

  const pinByGpio = new Map(base.pins.map(p => [p.gpio, p]))
  const allPads: HeaderPad[] = [
    ...spec.headers.left,
    ...spec.headers.right,
    ...(spec.headers.top ?? []),
    ...(spec.headers.bottom ?? []),
  ]

  const seenGpio = new Set<number>()
  for (const pad of allPads) {
    if (pad.gpio === undefined) {
      if (!pad.label) errors.push('A header pad has neither a "gpio" nor a "label".')
      continue
    }
    if (!pinByGpio.has(pad.gpio)) {
      errors.push(`GPIO${pad.gpio} does not exist on ${base.name} (base chip ${base.id}).`)
      continue
    }
    if (seenGpio.has(pad.gpio)) errors.push(`GPIO${pad.gpio} is assigned to more than one pad.`)
    seenGpio.add(pad.gpio)

    const p = pinByGpio.get(pad.gpio)!
    if (!p.isUsable) warnings.push(`GPIO${pad.gpio} is broken out but is never safe to use (${p.names.join('/')}).`)
    else if (p.constraints.some(c => c.severity === 'danger')) {
      warnings.push(`GPIO${pad.gpio} is broken out but carries a danger constraint - make sure the board really exposes it.`)
    }
  }

  const overrides = spec.overrides ?? {}
  for (const key of Object.keys(overrides)) {
    if (!/^\d+$/.test(key)) errors.push(`Override key "${key}" is not a GPIO number.`)
    else if (!pinByGpio.has(Number(key))) errors.push(`Override references GPIO${key}, which is not on the base chip.`)
  }

  if (errors.length) return { chip: null, errors, warnings }

  // Board silk labels are prepended to the inherited pin names so they show first.
  const pins: Pin[] = base.pins.map(p => {
    const ov = overrides[String(p.gpio)]
    return ov?.label ? { ...p, names: [ov.label, ...p.names] } : p
  })

  const overrideNotes = Object.entries(overrides)
    .filter(([, ov]) => ov.note)
    .map(([gpio, ov]) => `GPIO${gpio}: ${ov.note}`)
  const notes = [...base.notes, ...(spec.notes ?? []), ...overrideNotes]

  let n = 0
  const toLayout = (pads: HeaderPad[]): LayoutPin[] =>
    pads.map(pad => ({
      pinNumber: ++n,
      gpio: pad.gpio,
      label: pad.gpio === undefined ? (pad.label ?? 'NC') : undefined,
      isSurfacePad: pad.isSurfacePad,
      isBacksidePad: pad.isBacksidePad,
    }))

  const packageLayout: PackageLayout = {
    name: spec.name,
    left: toLayout(spec.headers.left),
    right: toLayout(spec.headers.right),
    bottom: spec.headers.bottom ? toLayout(spec.headers.bottom) : [],
    top: spec.headers.top ? toLayout(spec.headers.top) : undefined,
    leftRailHoles: spec.headers.leftRailHoles,
    rightRailHoles: spec.headers.rightRailHoles,
  }

  const module: ModuleInfo = {
    name: spec.name,
    form: 'board',
    arch: base.module?.arch ?? base.family,
    pcb: spec.pcb ?? 'black',
    accent: base.module?.accent ?? '#22c55e',
    radios: base.module?.radios ?? '',
    usbEdge: spec.usbEdge,
    bare: spec.bare,
    antenna: spec.antenna,
    aspect: spec.aspect,
  }

  const chip: Chip = {
    ...base,
    id: spec.id,
    name: spec.name,
    notes,
    pins,
    packageLayout,
    symbolLayout: undefined, // no official symbol -> schematic uses the synthesized fallback
    module,
  }

  return { chip, errors, warnings }
}
