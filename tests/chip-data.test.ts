import { describe, it, expect } from 'vitest'
import { CHIPS } from '../src/data/chips/index'
import { filterPins } from '../src/utils/filterPins'
import { esp32 } from '../src/data/chips/esp32'

describe('chip data schema validation', () => {
  CHIPS.forEach(chip => {
    describe(`${chip.name}`, () => {
      it('has required top-level fields', () => {
        expect(chip.id).toBeTruthy()
        expect(chip.name).toBeTruthy()
        expect(chip.pins.length).toBeGreaterThan(0)
        expect(chip.datasheetUrl).toMatch(/^https:\/\//)
      })

      it('has no duplicate GPIOs', () => {
        const gpios = chip.pins.map(p => p.gpio)
        const unique = new Set(gpios)
        expect(unique.size).toBe(gpios.length)
      })

      it('every unusable pin has a danger constraint', () => {
        chip.pins.filter(p => !p.isUsable).forEach(pin => {
          const hasDanger = pin.constraints.some(c => c.severity === 'danger')
          expect(hasDanger, `GPIO${pin.gpio} isUsable=false but no danger constraint`).toBe(true)
        })
      })

      it('every constraint has all required fields', () => {
        chip.pins.forEach(pin => {
          pin.constraints.forEach(c => {
            expect(c.id).toBeTruthy()
            expect(c.severity).toMatch(/^(danger|warning|info)$/)
            expect(c.title).toBeTruthy()
            expect(c.description.length).toBeGreaterThan(20)
          })
        })
      })
    })
  })
})

// The antenna keep-out is derived from the KiCad footprint rather than assumed
// per form factor, so it is worth guarding: a bad measurement would silently
// push the pin banks down the module instead of failing loudly.
describe('antenna keep-out', () => {
  const modules = CHIPS.filter(c => c.module?.form !== 'board' && c.packageLayout?.bodyMm)

  it('covers every shielded module', () => {
    expect(modules.length).toBeGreaterThan(0)
    for (const chip of modules) {
      expect(chip.packageLayout?.antennaMm, `${chip.name} has no antennaMm`).toBeGreaterThan(2)
    }
  })

  it('never claims more than a third of the module body', () => {
    for (const chip of modules) {
      const { antennaMm, bodyMm } = chip.packageLayout!
      expect(antennaMm! / bodyMm!.h, `${chip.name} keep-out is implausibly large`).toBeLessThan(0.45)
    }
  })

  it('leaves the dev boards alone - their headers do start at the board edge', () => {
    for (const chip of CHIPS.filter(c => c.module?.form === 'board')) {
      expect(chip.packageLayout?.antennaMm, `${chip.name} should have no keep-out`).toBeUndefined()
    }
  })
})

// A bare module breaks out every GPIO the silicon has, so a GPIO in the pin
// list with no pad on the package means the layout lost one. That is what
// happened to the ESP8685-WROOM-06: its pad 20 is a right-edge castellation
// AND an underside land, and the generator's "one instance only" rule (there
// to drop the thermal EPAD) threw it out, taking GPIO9 with it.
//
// Dev boards are excluded: they genuinely leave GPIOs off the headers.
describe('package layout completeness', () => {
  const modules = CHIPS.filter(c => c.module?.form !== 'board' && c.packageLayout)

  it('gives every GPIO in the pin list a pad on the package', () => {
    for (const chip of modules) {
      const L = chip.packageLayout!
      const onPackage = new Set(
        [...L.left, ...L.right, ...L.bottom, ...(L.top ?? [])]
          .map(p => p.gpio)
          .filter((g): g is number => g !== undefined),
      )
      const missing = chip.pins.map(p => p.gpio).filter(g => !onPackage.has(g))
      expect(missing, `${chip.name} has no pad for GPIO ${missing.join(', ')}`).toEqual([])
    }
  })

  it('keeps GPIO9 on the ESP8685-WROOM-06 right bank', () => {
    const right = CHIPS.find(c => c.id === 'esp8685wroom06')!.packageLayout!.right
    expect(right.find(p => p.pinNumber === 20)?.gpio).toBe(9)
  })
})

describe('filterPins', () => {
  it('safe_output excludes input_only and flash_reserved pins', () => {
    const result = filterPins(esp32.pins, 'safe_output')
    result.forEach(p => {
      expect(p.constraints.some(c => c.id === 'input_only')).toBe(false)
      expect(p.isUsable).toBe(true)
    })
  })

  it('adc_wifi_safe returns only adc1 pins', () => {
    const result = filterPins(esp32.pins, 'adc_wifi_safe')
    result.forEach(p => expect(p.capabilities).toContain('adc1'))
  })

  it('free returns pins with zero constraints', () => {
    const result = filterPins(esp32.pins, 'free')
    result.forEach(p => expect(p.constraints).toHaveLength(0))
  })
})
