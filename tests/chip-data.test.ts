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
