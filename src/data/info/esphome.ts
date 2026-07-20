import type { Chip, PinAssignment } from '../../types/chip'

// ESPHome `board:` keys, keyed by our board chip id. ESPHome targets a dev board
// (with USB + regulator), not a bare module, so only board entries appear here -
// a chip id absent from this map has no ESPHome config (generateEsphomeConfig
// returns null), which is how the Export panel hides it on modules.
export const ESPHOME_BOARD: Record<string, string> = {
  esp32devkitc: 'esp32dev',
  esp32devkit38: 'esp32dev',
  esp32s3devkitc: 'esp32-s3-devkitc-1',
  esp32c3devkitm: 'esp32-c3-devkitm-1',
  esp32c6devkitc: 'esp32-c6-devkitc-1',
  'esp32-s3-zero': 'esp32-s3-devkitc-1',
}

function slug(label: string, gpio: number): string {
  const s = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return s || `gpio${gpio}`
}

function pick(mapping: PinAssignment[], role: PinAssignment['role']): PinAssignment[] {
  return mapping.filter(a => a.role === role)
}
function first(mapping: PinAssignment[], role: PinAssignment['role']): PinAssignment | undefined {
  return mapping.find(a => a.role === role)
}

// Build a minimal, valid ESPHome starting config for a board: the esp32 platform
// block plus components derived from the assigned pins. Returns null for anything
// that is not a known board (modules have no ESPHome board key).
export function generateEsphomeConfig(chip: Chip, mapping: PinAssignment[]): string | null {
  const board = ESPHOME_BOARD[chip.id]
  if (!board) return null

  const out: string[] = [
    'esphome:',
    '  name: my-device',
    '',
    'esp32:',
    `  board: ${board}`,
    '  framework:',
    '    type: esp-idf',
  ]

  if (mapping.length === 0) {
    out.push('', '# Assign pins in the mapping builder to generate components here.')
    return out.join('\n')
  }

  out.push('', '# Generated from your pin mapping - rename entities and verify before use.')

  const sda = first(mapping, 'I2C_SDA'), scl = first(mapping, 'I2C_SCL')
  if (sda && scl) out.push('', 'i2c:', `  sda: GPIO${sda.gpio}`, `  scl: GPIO${scl.gpio}`, '  scan: true')

  const mosi = first(mapping, 'SPI_MOSI'), miso = first(mapping, 'SPI_MISO'), sck = first(mapping, 'SPI_SCK')
  if (mosi || miso || sck) {
    out.push('', 'spi:')
    if (sck) out.push(`  clk_pin: GPIO${sck.gpio}`)
    if (mosi) out.push(`  mosi_pin: GPIO${mosi.gpio}`)
    if (miso) out.push(`  miso_pin: GPIO${miso.gpio}`)
  }

  const tx = first(mapping, 'UART_TX'), rx = first(mapping, 'UART_RX')
  if (tx || rx) {
    out.push('', 'uart:', '  baud_rate: 115200')
    if (tx) out.push(`  tx_pin: GPIO${tx.gpio}`)
    if (rx) out.push(`  rx_pin: GPIO${rx.gpio}`)
  }

  const buttons = pick(mapping, 'Button')
  if (buttons.length) {
    out.push('', 'binary_sensor:')
    for (const b of buttons) out.push('  - platform: gpio', `    pin: GPIO${b.gpio}`, `    name: "${b.label}"`)
  }

  const leds = pick(mapping, 'LED')
  const pwms = pick(mapping, 'PWM')
  if (leds.length || pwms.length) {
    out.push('', 'output:')
    for (const l of leds) out.push('  - platform: gpio', `    pin: GPIO${l.gpio}`, `    id: ${slug(l.label, l.gpio)}`)
    for (const p of pwms) out.push('  - platform: ledc', `    pin: GPIO${p.gpio}`, `    id: ${slug(p.label, p.gpio)}`)
  }
  if (leds.length) {
    out.push('', 'light:')
    for (const l of leds) out.push('  - platform: binary', `    name: "${l.label}"`, `    output: ${slug(l.label, l.gpio)}`)
  }

  const adcs = pick(mapping, 'ADC')
  if (adcs.length) {
    out.push('', 'sensor:')
    for (const a of adcs) out.push('  - platform: adc', `    pin: GPIO${a.gpio}`, `    name: "${a.label}"`)
  }

  // Roles without a first-class ESPHome mapping here are listed as a hint so the
  // pin is not silently dropped.
  const other = mapping.filter(a => ['DAC', 'Touch', 'Custom'].includes(a.role))
  if (other.length) {
    out.push('', '# Also mapped (add the matching ESPHome component yourself):')
    for (const o of other) out.push(`#   GPIO${o.gpio}: ${o.role} (${o.label})`)
  }

  return out.join('\n')
}
