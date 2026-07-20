import { describe, it, expect } from 'vitest'
import { resolveInfo } from '../src/data/info/resolveInfo'
import { getChip } from '../src/data/chips'

describe('resolveInfo', () => {
  it('returns specs for every chip', () => {
    const esp32 = getChip('esp32')!
    const info = resolveInfo(esp32)
    expect(info.specs.cpuMaxMhz).toBe(240)
    expect(info.specs.cores).toBe(2)
  })

  it('applies SKU overrides for flash/psram', () => {
    const wrover = getChip('esp32wrover')!
    expect(resolveInfo(wrover).specs.psram).toMatch(/WROVER/)
  })

  it('leaves flashing and esphome undefined when no overlay exists', () => {
    // esp32h2 has no seeded overlay in Task 3
    const info = resolveInfo(getChip('esp32h2')!)
    expect(info.flashing).toBeUndefined()
    expect(info.esphome).toBeUndefined()
  })
})
