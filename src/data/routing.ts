import type { Chip, Pin } from '../types/chip'

// Peripheral routing knowledge: what the GPIO matrix can put on any free pin,
// and which interfaces are bound to fixed pins or the IO MUX. This is the
// datasheet lore behind "can I use pin X for Y?" that the diagram alone
// cannot answer.

export interface FixedGroupPin {
  gpio: number
  role: string
}

export interface FixedGroup {
  id: string
  name: string
  desc: string
  pins: FixedGroupPin[]
  families: string[]     // chip.family values this group applies to
}

// Interfaces with fixed / IO MUX pin assignments. Classic ESP32 only for now;
// facts from the ESP32 datasheet and ESP-IDF docs.
export const FIXED_GROUPS: FixedGroup[] = [
  {
    id: 'sdmmc',
    name: 'SD/MMC host (HS2)',
    desc: 'Fixed slot 1 pins for SD cards or eMMC. 1-bit mode only needs CLK, CMD and DATA0.',
    families: ['ESP32'],
    pins: [
      { gpio: 14, role: 'CLK' },
      { gpio: 15, role: 'CMD' },
      { gpio: 2,  role: 'DATA0' },
      { gpio: 4,  role: 'DATA1' },
      { gpio: 12, role: 'DATA2' },
      { gpio: 13, role: 'DATA3' },
    ],
  },
  {
    id: 'rmii',
    name: 'Ethernet RMII',
    desc: 'Wired Ethernet with an external PHY (LAN8720 etc). Data pins are fixed; MDC/MDIO can be any GPIO (commonly 23/18). REF_CLK is a 50 MHz clock on GPIO0.',
    families: ['ESP32'],
    pins: [
      { gpio: 19, role: 'TXD0' },
      { gpio: 22, role: 'TXD1' },
      { gpio: 21, role: 'TX_EN' },
      { gpio: 25, role: 'RXD0' },
      { gpio: 26, role: 'RXD1' },
      { gpio: 27, role: 'CRS_DV' },
      { gpio: 0,  role: 'REF_CLK' },
    ],
  },
  {
    id: 'vspi',
    name: 'VSPI on IO MUX',
    desc: 'Full-speed SPI (up to 80 MHz) must use these IO MUX pins. Routed through the GPIO matrix, SPI tops out around 26 MHz on any pin.',
    families: ['ESP32'],
    pins: [
      { gpio: 18, role: 'SCLK' },
      { gpio: 19, role: 'MISO' },
      { gpio: 23, role: 'MOSI' },
      { gpio: 5,  role: 'CS0' },
    ],
  },
  {
    id: 'hspi',
    name: 'HSPI on IO MUX',
    desc: 'Second full-speed SPI bus on IO MUX pins. Same rule: GPIO matrix routing limits SPI to about 26 MHz.',
    families: ['ESP32'],
    pins: [
      { gpio: 14, role: 'SCLK' },
      { gpio: 12, role: 'MISO' },
      { gpio: 13, role: 'MOSI' },
      { gpio: 15, role: 'CS0' },
    ],
  },
  {
    id: 'jtag',
    name: 'JTAG debug',
    desc: 'Hardware debug interface on fixed pins. Free to use as GPIOs when you are not debugging over JTAG.',
    families: ['ESP32'],
    pins: [
      { gpio: 12, role: 'MTDI' },
      { gpio: 13, role: 'MTCK' },
      { gpio: 14, role: 'MTMS' },
      { gpio: 15, role: 'MTDO' },
    ],
  },
]

// Peripherals the GPIO matrix can place on (almost) any free GPIO.
export const MATRIX_PERIPHERALS = [
  'I2C', 'UART', 'PWM (LEDC)', 'SPI (up to ~26 MHz)', 'I2S', 'RMT', 'Pulse counter',
] as const

// One-line family-specific footnote for the routing card.
export const FAMILY_ROUTING_NOTE: Record<string, string> = {
  'ESP32':    'Analog (ADC/DAC/Touch) stays on its fixed pins; full-speed SPI, SD/MMC, Ethernet and JTAG are pin-bound (below).',
  'ESP32-S2': 'Analog and touch stay on fixed pins; native USB is fixed on GPIO19/20.',
  'ESP32-S3': 'Analog and touch stay on fixed pins; native USB is fixed on GPIO19/20. SD/MMC host on the S3 routes through the GPIO matrix, so any free pins work.',
  'ESP32-C3': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO18/19.',
  'ESP32-C5': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO13/14.',
  'ESP32-C6': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO12/13.',
  'ESP32-H2': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO26/27.',
}

// Fixed groups relevant to this chip, with pins the module actually breaks
// out, plus the ones it does not (so partial modules stay honest).
export interface ResolvedGroup extends FixedGroup {
  present: FixedGroupPin[]
  missing: FixedGroupPin[]
}

export function resolveGroups(chip: Chip): ResolvedGroup[] {
  const have = new Set(chip.pins.map(p => p.gpio))
  return FIXED_GROUPS
    .filter(g => g.families.includes(chip.family))
    .map(g => ({
      ...g,
      present: g.pins.filter(p => have.has(p.gpio)),
      missing: g.pins.filter(p => !have.has(p.gpio)),
    }))
    .filter(g => g.present.length > 0)
}

// USB pins are already flagged in the pin data; derive the fixed-USB group
// from there instead of duplicating per-family tables.
export function usbPins(chip: Chip): Pin[] {
  return chip.pins.filter(p => p.capabilities.includes('usb'))
}

// Special-interface roles for one pin (for the pin detail panel).
export function specialInterfaces(chip: Chip, gpio: number): { group: string; role: string }[] {
  const out: { group: string; role: string }[] = []
  for (const g of FIXED_GROUPS) {
    if (!g.families.includes(chip.family)) continue
    const hit = g.pins.find(p => p.gpio === gpio)
    if (hit) out.push({ group: g.name, role: hit.role })
  }
  return out
}
