import { describe, it, expect } from 'vitest'
import { ESP12F_PINS, ESP12F_LAYOUT, ESP12F_SYMBOL } from '../src/data/chips/generated'
import { enrichPins } from '../src/data/chips/enrich'

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

  it('tags no pin with i2c, because ESP8266 I2C is bit-banged', () => {
    expect(ESP12F_PINS.some(p => p.capabilities.includes('i2c'))).toBe(false)
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
})
