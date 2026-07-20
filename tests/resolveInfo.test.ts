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

  it('leaves flashing undefined when neither an overlay nor a family default applies', () => {
    // C5 has no verified boot-mode sequence, so no family flashing default.
    const info = resolveInfo(getChip('esp32c5wroom1')!)
    expect(info.flashing).toBeUndefined()
  })

  it('provides a verified family flashing default for a bare module', () => {
    const info = resolveInfo(getChip('esp32c3')!)
    expect(info.flashing?.autoFlash).toBe(false)
    // C3 download pin is GPIO9
    expect(JSON.stringify(info.flashing)).toMatch(/GPIO9/)
  })
})
