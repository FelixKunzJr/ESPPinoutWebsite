import { describe, it, expect } from 'vitest'
import { getChip } from '../src/data/chips/catalog'
import type { Chip } from '../src/types/chip'

// The single most common ESP8266 mistake is assuming Dn is GPIOn. Asserted
// explicitly so no future edit can quietly move a label. Source: upstream
// arduino-esp8266 variants/nodemcu and variants/d1_mini pins_arduino.h.
const D_MAP: Record<string, number> = {
  D0: 16, D1: 5, D2: 4, D3: 0, D4: 2, D5: 14, D6: 12, D7: 13, D8: 15,
}

function labelOf(chip: Chip, gpio: number) {
  return chip.pins.find(p => p.gpio === gpio)?.boardLabel
}

describe('NodeMCU v1.0', () => {
  const chip = getChip('nodemcu-v1')!

  it('exists and inherits the ESP8266 family', () => {
    expect(chip).toBeDefined()
    expect(chip.family).toBe('ESP8266')
    expect(chip.module?.form).toBe('board')
  })

  it('maps every D label to the right GPIO', () => {
    for (const [label, gpio] of Object.entries(D_MAP)) {
      expect(labelOf(chip, gpio), `${label} should be GPIO${gpio}`).toBe(label)
    }
  })

  it('breaks out 15 pads per side', () => {
    expect(chip.packageLayout!.left).toHaveLength(15)
    expect(chip.packageLayout!.right).toHaveLength(15)
  })

  it('puts A0 on the first left pad and notes the divider', () => {
    expect(chip.packageLayout!.left[0].gpio).toBe(17)
    expect(labelOf(chip, 17)).toBe('A0')
    expect(chip.notes.join(' ')).toMatch(/0 to 3\.3 V/)
  })

  it('keeps the flash pins unusable even though they are broken out', () => {
    for (const n of [6, 7, 8, 11]) {
      expect(chip.pins.find(p => p.gpio === n)!.isUsable, `GPIO${n}`).toBe(false)
    }
  })
})

describe('LOLIN D1 Mini', () => {
  const chip = getChip('d1-mini')!

  it('exists and inherits the ESP8266 family', () => {
    expect(chip).toBeDefined()
    expect(chip.family).toBe('ESP8266')
    expect(chip.module?.form).toBe('board')
    expect(chip.module?.usbEdge).toBe('top')
  })

  it('maps every D label to the right GPIO', () => {
    for (const [label, gpio] of Object.entries(D_MAP)) {
      expect(labelOf(chip, gpio), `${label} should be GPIO${gpio}`).toBe(label)
    }
  })

  it('breaks out 8 pads per side, RST first on the left', () => {
    expect(chip.packageLayout!.left).toHaveLength(8)
    expect(chip.packageLayout!.right).toHaveLength(8)
    expect(chip.packageLayout!.left[0].label).toBe('RST')
    expect(chip.packageLayout!.left[1].gpio).toBe(17)
  })

  it('does not break out the flash bus', () => {
    const pads = [...chip.packageLayout!.left, ...chip.packageLayout!.right]
    const broken = pads.map(p => p.gpio).filter((g): g is number => g !== undefined)
    for (const n of [6, 7, 8, 9, 10, 11]) expect(broken, `GPIO${n}`).not.toContain(n)
  })
})
