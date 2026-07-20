import { describe, it, expect } from 'vitest'
import { familyFlashing } from '../src/data/info/flashing'
import { getChip } from '../src/data/chips'

describe('familyFlashing', () => {
  it('uses GPIO0 and adapter wiring for a classic ESP32 module (no native USB)', () => {
    const f = familyFlashing(getChip('esp32')!)!
    const text = JSON.stringify(f)
    expect(f.autoFlash).toBe(false)
    expect(text).toMatch(/GPIO0/)
    expect(text).toMatch(/USB-to-serial adapter/)
    expect(text).not.toMatch(/native/)
  })

  it('uses GPIO9 + the GPIO8 caveat and native USB for a C3 module', () => {
    const text = JSON.stringify(familyFlashing(getChip('esp32c3')!)!)
    expect(text).toMatch(/GPIO9/)
    expect(text).toMatch(/GPIO8/)
    expect(text).toMatch(/USB Serial\/JTAG/)
  })

  it('returns null for a dev board (boards auto-flash over USB)', () => {
    expect(familyFlashing(getChip('esp32devkitc')!)).toBeNull()
  })

  it('returns null for C5 (boot-mode sequence not verified)', () => {
    expect(familyFlashing(getChip('esp32c5wroom1')!)).toBeNull()
  })
})
