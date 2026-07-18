import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { CHIPS } from '../src/data/chips/index'
import { resolveBoard } from '../src/data/boards/resolveBoard'
import type { BoardSpec } from '../src/data/boards/types'

const here = dirname(fileURLToPath(import.meta.url))
const findChip = (id: string) => CHIPS.find(c => c.id === id)

describe('board spec pipeline', () => {
  it('resolves the example board with no errors', () => {
    const spec = JSON.parse(
      readFileSync(resolve(here, '../contrib/boards/example.board.json'), 'utf8'),
    ) as BoardSpec
    const { chip, errors } = resolveBoard(spec, findChip(spec.baseChip))
    expect(errors).toEqual([])
    expect(chip).not.toBeNull()
    expect(chip!.module?.form).toBe('board')
    expect(chip!.packageLayout?.left.length).toBeGreaterThan(0)
    // Board silk label from an override shows first on the inherited pin.
    expect(chip!.pins.find(p => p.gpio === 1)!.names[0]).toBe('TFT_CS')
  })

  it('flags an unknown base chip', () => {
    const spec: BoardSpec = { id: 'x', name: 'X', baseChip: 'nope', headers: { left: [], right: [] } }
    const { chip, errors } = resolveBoard(spec, findChip(spec.baseChip))
    expect(chip).toBeNull()
    expect(errors.join(' ')).toMatch(/Unknown baseChip/)
  })

  it('flags a GPIO that does not exist on the base chip', () => {
    const base = findChip('esp32s3')!
    const spec: BoardSpec = { id: 'x', name: 'X', baseChip: 'esp32s3', headers: { left: [{ gpio: 9999 }], right: [] } }
    const { errors } = resolveBoard(spec, base)
    expect(errors.join(' ')).toMatch(/9999 does not exist/)
  })

  it('flags the same GPIO assigned to two pads', () => {
    const base = findChip('esp32s3')!
    const g = base.pins[0].gpio
    const spec: BoardSpec = { id: 'x', name: 'X', baseChip: 'esp32s3', headers: { left: [{ gpio: g }], right: [{ gpio: g }] } }
    const { errors } = resolveBoard(spec, base)
    expect(errors.join(' ')).toMatch(/more than one pad/)
  })

  it('inherits pin data unchanged when there are no overrides', () => {
    const base = findChip('esp32s3')!
    const spec: BoardSpec = { id: 'x', name: 'X', baseChip: 'esp32s3', headers: { left: [{ gpio: base.pins[0].gpio }], right: [] } }
    const { chip } = resolveBoard(spec, base)
    expect(chip!.pins).toEqual(base.pins)
  })
})
