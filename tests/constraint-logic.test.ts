import { describe, it, expect } from 'vitest'
import { detectConflicts } from '../src/utils/detectConflicts'
import { esp32 } from '../src/data/chips/esp32'
import { CHIPS } from '../src/data/chips'

describe('detectConflicts', () => {
  it('flags flash-reserved GPIO as danger', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 6, role: 'LED', label: 'test' }])
    expect(conflicts.some(c => c.gpio === 6 && c.severity === 'danger')).toBe(true)
  })

  it('flags input-only pin used as LED output', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 34, role: 'LED', label: 'test' }])
    expect(conflicts.some(c => c.gpio === 34 && c.severity === 'danger')).toBe(true)
  })

  it('flags ADC2 pin used as ADC while chip has WiFi', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 4, role: 'ADC', label: 'soil sensor' }])
    expect(conflicts.some(c => c.gpio === 4 && c.severity === 'warning')).toBe(true)
  })

  it('says ADC2 always fails with Wi-Fi on the classic ESP32', () => {
    const [c] = detectConflicts(esp32, [{ gpio: 4, role: 'ADC', label: 'pot' }])
    expect(c.message).toContain('every read fails')
  })

  it('says ADC2 reads may fail with Wi-Fi on the ESP32-S3 (issue #19)', () => {
    const s3 = CHIPS.find(c => c.id === 'esp32s3')!
    const [c] = detectConflicts(s3, [{ gpio: 19, role: 'ADC', label: 'pot' }])
    expect(c.severity).toBe('warning')
    expect(c.message).toContain('may fail')
    const pin = s3.pins.find(p => p.gpio === 19)!
    expect(pin.constraints.map(k => k.title)).toContain('ADC2 unreliable with Wi-Fi')
  })

  it('flags ADC2 as unsupported on the ESP32-C3', () => {
    const c3 = CHIPS.find(c => c.id === 'esp32c3')!
    const [c] = detectConflicts(c3, [{ gpio: 5, role: 'ADC', label: 'pot' }])
    expect(c.message).toContain('does not support')
    expect(c3.pins.find(p => p.gpio === 5)!.constraints.map(k => k.id)).toContain('adc2_unsupported')
  })

  it('attaches the family ADC2 warning to every ADC2 pin in the catalog', () => {
    for (const chip of CHIPS) {
      for (const pin of chip.pins.filter(p => p.capabilities.includes('adc2'))) {
        expect(pin.constraints.some(k => k.id === 'adc2_no_wifi' || k.id === 'adc2_unsupported'), `${chip.id} GPIO${pin.gpio}`).toBe(true)
      }
    }
  })

  it('flags strapping pin used as button', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 0, role: 'Button', label: 'reset btn' }])
    expect(conflicts.some(c => c.gpio === 0 && c.severity === 'warning')).toBe(true)
  })

  it('returns empty for a safe assignment', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 21, role: 'I2C_SDA', label: 'SDA' }])
    expect(conflicts).toHaveLength(0)
  })
})
