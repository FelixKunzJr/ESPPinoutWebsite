import { describe, it, expect } from 'vitest'
import { CHIPS, getChip } from '../src/data/chips'
import { FIXED_GROUPS, resolveGroups, specialInterfaces, usbPins } from '../src/data/routing'

describe('peripheral routing data', () => {
  it('every fixed-group gpio exists on at least one module of its family', () => {
    for (const g of FIXED_GROUPS) {
      for (const fam of g.families) {
        const famChips = CHIPS.filter(c => c.family === fam)
        expect(famChips.length).toBeGreaterThan(0)
        for (const p of g.pins) {
          const anywhere = famChips.some(c => c.pins.some(pin => pin.gpio === p.gpio))
          expect(anywhere, `${g.id} GPIO${p.gpio} missing from every ${fam} module`).toBe(true)
        }
      }
    }
  })

  it('resolveGroups on WROOM-32 includes SD/MMC, RMII, SPI and JTAG with all pins present', () => {
    const chip = getChip('esp32')!
    const ids = resolveGroups(chip).map(g => g.id)
    expect(ids).toEqual(expect.arrayContaining(['sdmmc', 'rmii', 'vspi', 'hspi', 'jtag']))
    for (const g of resolveGroups(chip)) {
      expect(g.missing, `${g.id} should be fully broken out on WROOM-32`).toHaveLength(0)
    }
  })

  it('resolveGroups reports missing pins on partial modules (WROOM-DA lacks GPIO25)', () => {
    const chip = getChip('esp32wroomda')!
    const rmii = resolveGroups(chip).find(g => g.id === 'rmii')!
    expect(rmii.missing.map(m => m.gpio)).toContain(25)
  })

  it('non-classic families get no classic fixed groups', () => {
    const s3 = getChip('esp32s3')!
    expect(resolveGroups(s3)).toHaveLength(0)
  })

  it('specialInterfaces maps GPIO14 on classic ESP32 to SD CLK, HSPI SCLK and JTAG MTMS', () => {
    const chip = getChip('esp32')!
    const groups = specialInterfaces(chip, 14).map(s => `${s.group}:${s.role}`)
    expect(groups).toEqual(expect.arrayContaining([
      'SD/MMC host (HS2):CLK',
      'HSPI on IO MUX:SCLK',
      'JTAG debug:MTMS',
    ]))
  })

  it('usbPins finds the fixed USB pair on S3 and C6', () => {
    expect(usbPins(getChip('esp32s3')!).map(p => p.gpio).sort()).toEqual([19, 20])
    expect(usbPins(getChip('esp32c6')!).map(p => p.gpio).sort((a, b) => a - b)).toEqual([12, 13])
  })
})
