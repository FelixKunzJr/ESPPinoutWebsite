import { describe, it, expect } from 'vitest'
import { ESP12F_PINS, ESP12F_LAYOUT, ESP12F_SYMBOL } from '../src/data/chips/generated'
import { enrichPins } from '../src/data/chips/enrich'
import { getChip } from '../src/data/chips/catalog'
import { familyFlashing } from '../src/data/info/flashing'
import { FAMILY_SPECS } from '../src/data/chips/specs'

describe('ESP-12F generated data', () => {
  const byGpio = (n: number) => ESP12F_PINS.find(p => p.gpio === n)

  it('has every GPIO0-16 plus the synthetic analog pin', () => {
    const gpios = ESP12F_PINS.map(p => p.gpio).sort((a, b) => a - b)
    expect(gpios).toEqual([...Array(17).keys(), 17])
  })

  it('marks the flash bus correctly', () => {
    for (const n of [6, 7, 8, 11]) {
      const p = byGpio(n)!
      expect(p.isUsable, `GPIO${n}`).toBe(false)
      expect(p.constraints.some(c => c.id === 'flash_reserved' && c.severity === 'danger')).toBe(true)
    }
    for (const n of [9, 10]) {
      const p = byGpio(n)!
      expect(p.isUsable, `GPIO${n}`).toBe(true)
      expect(p.constraints.some(c => c.id === 'flash_reserved' && c.severity === 'warning')).toBe(true)
    }
  })

  it('flags the strapping pins', () => {
    for (const n of [0, 2, 15]) {
      expect(byGpio(n)!.constraints.some(c => c.id === 'strapping_pin'), `GPIO${n}`).toBe(true)
    }
  })

  it('models GPIO16 as no-interrupt, no-pullup, no-PWM', () => {
    const p = byGpio(16)!
    expect(p.constraints.map(c => c.id).sort()).toContain('no_interrupt')
    expect(p.constraints.map(c => c.id)).toContain('no_pullup')
    expect(p.capabilities).not.toContain('pwm')
  })

  it('models the analog input as A0 with an ADC range warning', () => {
    const p = byGpio(17)!
    expect(p.names).toEqual(['A0', 'TOUT'])
    expect(p.capabilities).toEqual(['adc1'])
    expect(p.constraints.some(c => c.id === 'adc_input_range')).toBe(true)
  })

  // Finding 1 (critical): TOUT has no output driver whatsoever. Without an
  // input_only constraint, filterPins('safe_output') - the site's direct
  // answer to "which pin can I drive?" - recommended it as a safe output.
  it('marks the analog input input_only, so it can never be recommended as a safe output', () => {
    const p = byGpio(17)!
    expect(p.constraints.some(c => c.id === 'input_only')).toBe(true)
  })

  it('tags no pin with i2c, because ESP8266 I2C is bit-banged', () => {
    expect(ESP12F_PINS.some(p => p.capabilities.includes('i2c'))).toBe(false)
  })

  // Regression: KiCad's ESP-12E symbol names the reset pad '~{RST}' (its
  // overbar notation for an active-low signal). specialLabel() used to match
  // only the bare 'RST' pattern, so this fell through to the raw name and
  // both the module and schematic views rendered the literal string
  // '~{RST}' instead of resolving to the EN/RST label every other module
  // uses. Pad 8 (named plain 'VCC' by KiCad) is covered in the same pass:
  // every other module in the catalog renders '3V3' for the supply pad.
  it('resolves the KiCad overbar reset pad to EN, and the VCC pad to 3V3, not the literal KiCad strings', () => {
    const resetPad = ESP12F_LAYOUT.left.find(p => p.pinNumber === 1)
    expect(resetPad?.label).toBe('EN')
    const supplyPad = ESP12F_LAYOUT.top?.find(p => p.pinNumber === 8) ?? ESP12F_LAYOUT.left.find(p => p.pinNumber === 8)
    expect(supplyPad?.label).toBe('3V3')

    const allLayoutLabels = [
      ...ESP12F_LAYOUT.left, ...ESP12F_LAYOUT.right,
      ...ESP12F_LAYOUT.bottom, ...(ESP12F_LAYOUT.top ?? []),
    ].map(p => p.label)
    expect(allLayoutLabels).not.toContain('~{RST}')
    expect(allLayoutLabels).not.toContain('VCC')

    const allSymbolLabels = [
      ...ESP12F_SYMBOL.left, ...ESP12F_SYMBOL.right,
      ...(ESP12F_SYMBOL.bottom ?? []), ...(ESP12F_SYMBOL.top ?? []),
    ].map(p => p.label).filter(Boolean)
    expect(allSymbolLabels).not.toContain('~{RST}')
    expect(allSymbolLabels).not.toContain('VCC')
  })

  it('lays out all 22 pads and carries the official symbol', () => {
    const pads = [
      ...ESP12F_LAYOUT.left, ...ESP12F_LAYOUT.right,
      ...ESP12F_LAYOUT.bottom, ...(ESP12F_LAYOUT.top ?? []),
    ]
    expect(pads).toHaveLength(22)
    expect(new Set(pads.map(p => p.pinNumber)).size).toBe(22)
    expect(ESP12F_SYMBOL.left.length + ESP12F_SYMBOL.right.length).toBeGreaterThan(10)
  })

  // Regression for the bare module's schematic view showing no danger badge at
  // all on the flash bus: KiCad names these symbol pins by SPI role (CS0,
  // MISO, MOSI, SCLK) with no GPIO token, so symbolGeometry() must resolve the
  // gpio field from the pad number (via the same padGpio/analog overrides
  // buildModule applies to the pin list), not from the symbol pin name.
  it('carries gpio numbers on the symbol pins KiCad names by SPI role, so the flash-bus badges have a pin to find', () => {
    const symPin = (pad: number) => [...ESP12F_SYMBOL.left, ...ESP12F_SYMBOL.right].find(p => p.pins.includes(pad))
    expect(symPin(9)?.gpio, 'pad 9 (CS0)').toBe(11)
    expect(symPin(10)?.gpio, 'pad 10 (MISO)').toBe(7)
    expect(symPin(13)?.gpio, 'pad 13 (MOSI)').toBe(8)
    expect(symPin(14)?.gpio, 'pad 14 (SCLK)').toBe(6)
    expect(symPin(2)?.gpio, 'pad 2 (ADC)').toBe(17)
  })
})

describe('ESP8266 enrichment overlay', () => {
  const enriched = enrichPins('esp8266', ESP12F_PINS)
  const byGpio = (n: number) => enriched.find(p => p.gpio === n)!

  it('names the HSPI pins', () => {
    expect(byGpio(14).names).toContain('HSPICLK')
    expect(byGpio(12).names).toContain('HSPIQ')
    expect(byGpio(13).names).toContain('HSPID')
    expect(byGpio(15).names).toContain('HSPICS')
    for (const n of [12, 13, 14, 15]) expect(byGpio(n).capabilities).toContain('spi')
  })

  it('names UART0 and the UART1 debug TX', () => {
    expect(byGpio(1).names).toContain('U0TXD')
    expect(byGpio(3).names).toContain('U0RXD')
    expect(byGpio(2).names).toContain('U1TXD')
  })

  it('names the deep-sleep wake pin', () => {
    expect(byGpio(16).names).toContain('WAKE')
  })

  it('never adds an i2c capability', () => {
    expect(enriched.some(p => p.capabilities.includes('i2c'))).toBe(false)
  })

  // Regression coverage for four functions the brief's draft table claimed that the
  // ESP8266EX datasheet does not support: CLK_XTAL/CLK_RTC do not exist anywhere in
  // the datasheet (GPIO4/GPIO5 only ever appear as plain GPIO4/GPIO5 in Table 2-1 -
  // the crystal pins are the dedicated XTAL_IN/XTAL_OUT pins, not GPIO4/GPIO5), and
  // U1TXD/U1RTS are not on GPIO7/GPIO11 (Table 4-6 places UART1's only two signals,
  // U1TXD and U1RXD, on GPIO2 and GPIO8 respectively - UART1 has no RTS/CTS at all).
  it('does not claim functions the ESP8266EX datasheet does not support', () => {
    expect(byGpio(4).names).not.toContain('CLK_XTAL')
    expect(byGpio(5).names).not.toContain('CLK_RTC')
    expect(byGpio(7).names).not.toContain('U1TXD')
    expect(byGpio(7).capabilities).not.toContain('uart')
    expect(byGpio(11).names).not.toContain('U1RTS')
    expect(byGpio(11).capabilities).not.toContain('uart')
  })
})

describe('ESP8266 catalog entry', () => {
  it('is registered under the searchable id', () => {
    const chip = getChip('esp8266')!
    expect(chip).toBeDefined()
    expect(chip.name).toBe('ESP8266 (ESP-12F)')
    expect(chip.family).toBe('ESP8266')
    expect(chip.hasBle).toBe(false)
    expect(chip.hasBluetooth).toBe(false)
    expect(chip.cores).toBe(1)
    expect(chip.symbolLayout).toBeDefined()
  })

  it('carries the boot-level rules in its notes', () => {
    const notes = getChip('esp8266')!.notes.join(' ')
    expect(notes).toMatch(/GPIO15 must be LOW at boot/)
    expect(notes).toMatch(/GPIO2 must be HIGH at boot/)
  })
})

describe('ESP8266 specs and flashing', () => {
  it('has a specs entry', () => {
    const s = FAMILY_SPECS['ESP8266']
    expect(s).toBeDefined()
    expect(s.cores).toBe(1)
    expect(s.psram).toBe('None')
  })

  it('describes a UART-only flashing procedure for the bare module', () => {
    const info = familyFlashing(getChip('esp8266')!)
    expect(info).not.toBeNull()
    const text = JSON.stringify(info)
    expect(text).toMatch(/GPIO0/)
    expect(text).not.toMatch(/USB Serial\/JTAG|USB-OTG/)
  })

  it('returns no bare-module procedure for the boards', () => {
    expect(familyFlashing(getChip('nodemcu-v1')!)).toBeNull()
    expect(familyFlashing(getChip('d1-mini')!)).toBeNull()
  })
})
