import { describe, it, expect } from 'vitest'
import { detectConflicts } from '../src/utils/detectConflicts'
import { esp32 } from '../src/data/chips/esp32'

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

  it('flags strapping pin used as button', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 0, role: 'Button', label: 'reset btn' }])
    expect(conflicts.some(c => c.gpio === 0 && c.severity === 'warning')).toBe(true)
  })

  it('returns empty for a safe assignment', () => {
    const conflicts = detectConflicts(esp32, [{ gpio: 21, role: 'I2C_SDA', label: 'SDA' }])
    expect(conflicts).toHaveLength(0)
  })
})
