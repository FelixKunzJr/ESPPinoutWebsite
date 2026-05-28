import type { PinAssignment, Chip } from '../types/chip'

export interface Conflict {
  gpio: number
  message: string
  severity: 'danger' | 'warning'
}

export function detectConflicts(chip: Chip, mapping: PinAssignment[]): Conflict[] {
  const conflicts: Conflict[] = []
  const chipHasWifi = chip.hasWifi

  mapping.forEach(assignment => {
    const pin = chip.pins.find(p => p.gpio === assignment.gpio)
    if (!pin) return

    // Unusable pin used
    if (!pin.isUsable) {
      conflicts.push({ gpio: pin.gpio, severity: 'danger', message: `GPIO${pin.gpio} is reserved (flash/system) — remove it.` })
    }

    // Input-only assigned as output role
    const outputRoles: PinAssignment['role'][] = ['LED','PWM','DAC','UART_TX','SPI_MOSI','SPI_SCK','SPI_CS']
    if (pin.constraints.some(c => c.id === 'input_only') && outputRoles.includes(assignment.role)) {
      conflicts.push({ gpio: pin.gpio, severity: 'danger', message: `GPIO${pin.gpio} is input-only but assigned as ${assignment.role}.` })
    }

    // ADC2 while WiFi in use
    if (chipHasWifi && pin.capabilities.includes('adc2') && assignment.role === 'ADC') {
      conflicts.push({ gpio: pin.gpio, severity: 'warning', message: `GPIO${pin.gpio} uses ADC2 — readings will fail while WiFi is active. Use an ADC1 pin instead.` })
    }

    // Strapping pin used as button (pulled to GND)
    if (pin.constraints.some(c => c.id === 'strapping_pin') && assignment.role === 'Button') {
      conflicts.push({ gpio: pin.gpio, severity: 'warning', message: `GPIO${pin.gpio} is a strapping pin. Pulling it LOW (button) can cause unexpected boot modes.` })
    }
  })

  // Duplicate role conflicts (same I2C bus only one SDA/SCL needed)
  const sdaPins = mapping.filter(a => a.role === 'I2C_SDA')
  if (sdaPins.length > 1) {
    conflicts.push({ gpio: sdaPins[1].gpio, severity: 'warning', message: 'Multiple I2C_SDA pins assigned — only one SDA is needed per bus.' })
  }

  return conflicts
}
