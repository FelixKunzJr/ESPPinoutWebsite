import { describe, it, expect } from 'vitest'
import { CHIPS, getChip } from '../src/data/chips'
import { FIXED_GROUPS, resolveGroups, specialInterfaces } from '../src/data/routing'

const ids = (chipId: string) => resolveGroups(getChip(chipId)!).map(g => g.id)
const group = (chipId: string, gid: string) => resolveGroups(getChip(chipId)!).find(g => g.id === gid)

describe('peripheral routing data', () => {
  it('every hand-authored group gpio exists on at least one module of its family', () => {
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

  it('WROOM-32 gets classic groups plus derived JTAG/32K/UART0 and internal flash wiring', () => {
    expect(ids('esp32')).toEqual(expect.arrayContaining([
      'internal', 'sdmmc', 'rmii', 'vspi', 'hspi', 'jtag', 'xtal32k', 'uart0',
    ]))
    const internal = group('esp32', 'internal')!
    expect(internal.present.map(p => p.gpio).sort((a, b) => a - b)).toEqual([6, 7, 8, 9, 10, 11])
    expect(internal.present.every(p => p.role === 'flash')).toBe(true)
  })

  it('WROVER marks PSRAM pins 16/17 as internal connections', () => {
    const internal = group('esp32wrover', 'internal')!
    const psram = internal.present.filter(p => p.role === 'PSRAM').map(p => p.gpio).sort((a, b) => a - b)
    expect(psram).toEqual([16, 17])
  })

  it('resolveGroups reports missing pins on partial modules (WROOM-DA lacks GPIO25)', () => {
    const rmii = group('esp32wroomda', 'rmii')!
    expect(rmii.missing.map(m => m.gpio)).toContain(25)
  })

  it('S3 derives JTAG (39-42), FSPI IO MUX, octal bus, USB, 32K and UART0; no classic groups', () => {
    const s3 = ids('esp32s3')
    expect(s3).toEqual(expect.arrayContaining(['jtag', 'fspi', 'octal', 'usb', 'xtal32k', 'uart0']))
    expect(s3).not.toContain('rmii')
    expect(s3).not.toContain('sdmmc')
    expect(group('esp32s3', 'jtag')!.present.map(p => p.gpio).sort((a, b) => a - b)).toEqual([39, 40, 41, 42])
    const fspi = group('esp32s3', 'fspi')!
    expect(fspi.present.map(p => p.role)).toEqual(expect.arrayContaining(['SCLK', 'MISO', 'MOSI', 'CS0']))
    // one pin per role (primary IO MUX set, GPIO9-14 on the S3)
    expect(new Set(fspi.present.map(p => p.role)).size).toBe(fspi.present.length)
    expect(Math.max(...fspi.present.map(p => p.gpio))).toBeLessThanOrEqual(14)
    // octal memory bus is the SPIIO*/SPIDQS set only - FSPI octal-extension
    // pins (GPIO10-14) must not be flagged as memory bus
    const octal = group('esp32s3', 'octal')!
    expect(Math.min(...octal.present.map(p => p.gpio))).toBeGreaterThanOrEqual(33)
  })

  it('derives fixed USB pairs across families', () => {
    expect(group('esp32s3', 'usb')!.present.map(p => p.gpio).sort((a, b) => a - b)).toEqual([19, 20])
    expect(group('esp32c6', 'usb')!.present.map(p => p.gpio).sort((a, b) => a - b)).toEqual([12, 13])
    expect(group('esp32h2', 'usb')!.present.length).toBe(2)
  })

  it('all JTAG-capable families expose it: C6/H2 from symbol MT* names, C5/C3 from the enrichment overlay', () => {
    expect(ids('esp32c6')).toContain('jtag')
    expect(ids('esp32h2')).toContain('jtag')
    // C5 and C3 KiCad symbols lacked MT* names, so their JTAG functions come from
    // the datasheet enrichment overlay (src/data/chips/enrich.ts) instead.
    expect(ids('esp32c5mini1')).toContain('jtag')
    expect(ids('esp32c3')).toContain('jtag')
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

  // Round 2 fix: the UART0 group desc claimed UART is "matrix-routable to
  // any pin" for every family, including the ESP8266, which has no matrix at
  // all - UART0 only moves via the fixed swap function (TX->GPIO15,
  // RX->GPIO13), not to an arbitrary pin.
  it('UART0 desc is family-aware: no matrix claim for the ESP8266, unchanged wording for ESP32', () => {
    const esp8266Desc = group('esp8266', 'uart0')!.desc
    expect(esp8266Desc).not.toMatch(/matrix-routable/)
    expect(esp8266Desc).not.toMatch(/GPIO matrix/)
    expect(esp8266Desc).toMatch(/GPIO15/)
    expect(esp8266Desc).toMatch(/GPIO13/)

    const esp32Desc = group('esp32', 'uart0')!.desc
    expect(esp32Desc).toBe(
      'Default console UART used for flashing and the boot log. UART is matrix-routable to any pin, but the ROM bootloader always logs here.',
    )
  })
})
