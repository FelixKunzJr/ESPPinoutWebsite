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

  it('resolves the waveshare s3 zero board with no errors', () => {
    const spec = JSON.parse(
      readFileSync(resolve(here, '../contrib/boards/esp32-s3-zero.board.json'), 'utf8'),
    ) as BoardSpec
    const { chip, errors } = resolveBoard(spec, findChip(spec.baseChip))
    expect(errors).toEqual([])
    expect(chip).not.toBeNull()
    // Verify specific overrides
    expect(chip!.pins.find(p => p.gpio === 43)!.names[0]).toBe('TX')
    expect(chip!.pins.find(p => p.gpio === 21)!.names[0]).toBe('GP21')
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

describe('Seeed XIAO boards', () => {
  // Each XIAO shares the D0-D10 silkscreen but maps to a different GPIO per chip.
  // Values are from the Seeed wiki / mischianti pinout references.
  const xiaoMap: Record<string, Record<string, number>> = {
    'xiao-esp32c3': { D0: 2, D1: 3, D2: 4, D3: 5, D4: 6, D5: 7, D6: 21, D7: 20, D8: 8, D9: 9, D10: 10 },
    'xiao-esp32s3': { D0: 1, D1: 2, D2: 3, D3: 4, D4: 5, D5: 6, D6: 43, D7: 44, D8: 7, D9: 8, D10: 9 },
    'xiao-esp32c6': { D0: 0, D1: 1, D2: 2, D3: 21, D4: 22, D5: 23, D6: 16, D7: 17, D8: 19, D9: 20, D10: 18 },
  }

  for (const [id, map] of Object.entries(xiaoMap)) {
    it(`${id} is in the catalog with all 11 D-pins mapped to the right GPIO`, () => {
      const chip = findChip(id)
      expect(chip).toBeDefined()
      expect(chip!.module?.form).toBe('board')
      // 7 castellated pads per side (11 GPIO + 3V3 + 5V + GND).
      expect(chip!.packageLayout!.left.length).toBe(7)
      expect(chip!.packageLayout!.right.length).toBe(7)
      for (const [silk, gpio] of Object.entries(map)) {
        const pin = chip!.pins.find(p => p.gpio === gpio)
        expect(pin, `${id} ${silk} -> GPIO${gpio}`).toBeDefined()
        expect(pin!.names[0], `${id} ${silk} label`).toBe(silk)
      }
    })
  }
})
