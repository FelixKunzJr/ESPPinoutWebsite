import type { Chip, PinAssignment } from '../../types/chip'

// ESPHome `board:` keys, keyed by our board chip id. ESPHome targets a dev board
// (with USB + regulator), not a bare module, so only board entries appear here -
// a chip id absent from this map has no ESPHome config (generateEsphomeConfig
// returns null), which is how the Export panel hides it on modules.
// Only boards whose ESPHome board key we have VERIFIED belong here. A board that
// is `form: 'board'` but absent from this map (e.g. the Waveshare S3-Zero) has no
// trustworthy key, so the Export panel shows a contribute prompt rather than a
// guessed config - a wrong board key is worse than none.
export const ESPHOME_BOARD: Record<string, string> = {
  esp32devkitc: 'esp32dev',
  esp32devkit38: 'esp32dev',
  esp32s3devkitc: 'esp32-s3-devkitc-1',
  esp32c3devkitm: 'esp32-c3-devkitm-1',
  esp32c6devkitc: 'esp32-c6-devkitc-1',
}

// ESPHome chip variant per family. A board without a verified board: key falls
// back to `variant:` - the generic-but-correct config ESPHome itself uses for
// boards with no dedicated PlatformIO definition (e.g. the Waveshare S3-Zero).
export const FAMILY_VARIANT: Record<string, string> = {
  'ESP32': 'esp32',
  'ESP32-S2': 'esp32s2',
  'ESP32-S3': 'esp32s3',
  'ESP32-C3': 'esp32c3',
  'ESP32-C6': 'esp32c6',
  'ESP32-C5': 'esp32c5',
  'ESP32-H2': 'esp32h2',
}

// Produce a valid ESPHome/C++ identifier: must start with a letter or underscore,
// so a numeric or empty label ("4", "") cannot become an invalid id like `4`.
function slug(label: string, gpio: number): string {
  const s = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  if (!s) return `gpio${gpio}`
  return /^[0-9]/.test(s) ? `io_${s}` : s
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
  // ESPHome targets a dev board, not a bare module.
  if (chip.module?.form !== 'board') return null

  const boardKey = ESPHOME_BOARD[chip.id]
  const variant = FAMILY_VARIANT[chip.family]
  if (!boardKey && !variant) return null
  // Verified board key when we have one; otherwise the generic chip variant.
  const platformLine = boardKey ? `  board: ${boardKey}` : `  variant: ${variant}`

  const out: string[] = [
    'esphome:',
    '  name: my-device',
    '',
    'esp32:',
    platformLine,
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
