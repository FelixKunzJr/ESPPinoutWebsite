import { describe, it, expect } from 'vitest'
import { generateEsphomeConfig, ESPHOME_BOARD } from '../src/data/info/esphome'
import { getChip } from '../src/data/chips'
import type { PinAssignment } from '../src/types/chip'

describe('generateEsphomeConfig', () => {
  it('returns null for a bare module (no ESPHome board key)', () => {
    expect(generateEsphomeConfig(getChip('esp32')!, [])).toBeNull()
    expect(generateEsphomeConfig(getChip('esp32c6')!, [])).toBeNull()
  })

  it('emits the verified board key for an official dev board', () => {
    const yaml = generateEsphomeConfig(getChip('esp32devkitc')!, [])!
    expect(yaml).toMatch(/board: esp32dev/)
    expect(yaml).toMatch(/Assign pins in the mapping builder/)
  })

  it('falls back to variant for a board with no verified board key (S3-Zero)', () => {
    const yaml = generateEsphomeConfig(getChip('esp32-s3-zero')!, [])!
    expect(yaml).toMatch(/variant: esp32s3/)
    expect(yaml).not.toMatch(/board:/)
  })

  it('generates components from the pin mapping', () => {
    const mapping: PinAssignment[] = [
      { gpio: 13, role: 'Button', label: 'Boot btn' },
      { gpio: 2, role: 'LED', label: 'Status LED' },
      { gpio: 21, role: 'I2C_SDA', label: 'sda' },
      { gpio: 22, role: 'I2C_SCL', label: 'scl' },
    ]
    const yaml = generateEsphomeConfig(getChip('esp32devkitc')!, mapping)!
    expect(yaml).toMatch(/binary_sensor:/)
    expect(yaml).toMatch(/pin: GPIO13/)
    expect(yaml).toMatch(/name: "Boot btn"/)
    expect(yaml).toMatch(/light:/)
    expect(yaml).toMatch(/output: status_led/)
    expect(yaml).toMatch(/i2c:\n {2}sda: GPIO21\n {2}scl: GPIO22/)
  })

  it('produces a valid identifier id even for a numeric label', () => {
    const mapping: PinAssignment[] = [{ gpio: 8, role: 'LED', label: '4' }]
    const yaml = generateEsphomeConfig(getChip('esp32c3devkitm')!, mapping)!
    // id/output must be a valid C++/ESPHome identifier - never a bare digit.
    expect(yaml).not.toMatch(/id: \d/)
    expect(yaml).not.toMatch(/output: \d/)
    expect(yaml).toMatch(/id: io_4/)
    expect(yaml).toMatch(/output: io_4/)
  })

  it('surfaces a constraint warning when a component is mapped to a risky pin', () => {
    // GPIO2 on the C3 is a strapping pin.
    const mapping: PinAssignment[] = [{ gpio: 2, role: 'LED', label: 'Blinky' }]
    const yaml = generateEsphomeConfig(getChip('esp32c3devkitm')!, mapping)!
    expect(yaml).toMatch(/Heads-up/)
    expect(yaml).toMatch(/GPIO2 \(LED "Blinky"\).*[Ss]trapping/)
  })

  it('emits no warning block when all mapped pins are unconstrained', () => {
    const mapping: PinAssignment[] = [{ gpio: 0, role: 'LED', label: 'led' }]
    const yaml = generateEsphomeConfig(getChip('esp32c3devkitm')!, mapping)!
    expect(yaml).not.toMatch(/Heads-up/)
  })

  it('every board id in ESPHOME_BOARD resolves to a real board chip', () => {
    for (const id of Object.keys(ESPHOME_BOARD)) {
      const chip = getChip(id)
      expect(chip, `missing chip ${id}`).toBeDefined()
      expect(chip!.module?.form).toBe('board')
    }
  })
})
