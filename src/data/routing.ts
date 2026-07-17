import type { Chip } from '../types/chip'

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
]

// Groups derived from the pin names themselves (which come from Espressif's
// official symbols and carry the IO MUX function names). Deriving instead of
// hand-copying datasheet tables keeps every family and module accurate by
// construction: a module only shows the pins it actually breaks out.
interface NameGroupDef {
  id: string
  name: string
  desc: string
  match: RegExp
  role: (name: string) => string
  families?: string[]     // restrict to specific chip.family values
}

const NAME_GROUPS: NameGroupDef[] = [
  {
    id: 'jtag',
    name: 'JTAG debug',
    desc: 'Hardware debug interface on fixed IO MUX pins. Free to use as GPIOs when you are not debugging over JTAG.',
    match: /^MT(MS|DI|CK|DO)$/,
    role: n => n,
  },
  {
    id: 'fspi',
    name: 'FSPI on IO MUX',
    desc: 'Full-speed SPI must use these IO MUX pins; routed through the GPIO matrix, SPI tops out around 26 MHz on any pin.',
    match: /^FSPI(CLK|Q|D|CS0|HD|WP)$/,
    role: n => ({ FSPICLK: 'SCLK', FSPIQ: 'MISO', FSPID: 'MOSI', FSPICS0: 'CS0', FSPIHD: 'HD', FSPIWP: 'WP' }[n] ?? n),
  },
  {
    // SPIIO*/SPIDQS/SPICLK_* (no F prefix) is the internal memory bus;
    // FSPIIO*/FSPIDQS is SPI2's octal-mode extension and stays usable.
    id: 'octal',
    name: 'Octal flash/PSRAM bus',
    desc: 'On S3 modules with octal flash or PSRAM (WROOM-2, R8 variants) these pins carry the memory bus and must not be used. On quad modules they are regular GPIOs.',
    match: /^(SPIIO[4-7]|SPIDQS|SPICLK_[NP])$/,
    role: n => n,
    families: ['ESP32-S3'],
  },
  {
    id: 'xtal32k',
    name: '32 kHz crystal',
    desc: 'Optional external 32.768 kHz crystal for accurate RTC timekeeping in deep sleep. Plain GPIOs when no crystal is fitted.',
    match: /^(XTAL_32K_[PN]|32K_X?[PN])$/,
    role: n => (/P$/.test(n) ? 'XP' : 'XN'),
  },
  {
    id: 'uart0',
    name: 'UART0 (console)',
    desc: 'Default console UART used for flashing and the boot log. UART is matrix-routable to any pin, but the ROM bootloader always logs here.',
    match: /^U0(TXD|RXD)$/,
    role: n => n.replace('U0', ''),
  },
  {
    id: 'usb',
    name: 'Native USB',
    desc: 'USB D-/D+ cannot be moved. Avoid these pins if you flash or debug over native USB.',
    match: /^USB_D[+-]$/,
    role: n => n.replace('USB_', ''),
  },
]

// Peripherals the GPIO matrix can place on (almost) any free GPIO.
export const MATRIX_PERIPHERALS = [
  'I2C', 'UART', 'PWM (LEDC)', 'SPI (up to ~26 MHz)', 'I2S', 'RMT', 'Pulse counter',
] as const

// One-line family-specific footnote for the routing card. Sleep-domain and
// sigma-delta facts verified against each family's TRM (IO MUX chapter).
export const FAMILY_ROUTING_NOTE: Record<string, string> = {
  'ESP32':    'Analog (ADC/DAC/Touch) stays on its fixed pins; full-speed SPI, SD/MMC, Ethernet and JTAG are pin-bound (below). RTC-domain pins stay alive in deep sleep: outputs hold their level, inputs can wake the chip.',
  'ESP32-S2': 'Analog and touch stay on fixed pins; native USB is fixed on GPIO19/20. RTC-domain pins stay alive in deep sleep.',
  'ESP32-S3': 'Analog and touch stay on fixed pins; native USB is fixed on GPIO19/20. SD/MMC host on the S3 routes through the GPIO matrix, so any free pins work. RTC-domain pins stay alive in deep sleep.',
  'ESP32-C3': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO18/19. Only GPIO0-5 can wake the chip from deep sleep.',
  'ESP32-C5': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO13/14. LP-domain pins stay alive in deep sleep.',
  'ESP32-C6': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO12/13. GPIO0-7 are LP pins that stay alive in deep sleep.',
  'ESP32-H2': 'ADC stays on fixed pins; native USB Serial/JTAG is fixed on GPIO26/27.',
}

// Per-family Technical Reference Manual (the IO MUX / GPIO matrix chapter is
// the authoritative source for everything in this card).
export const TRM_URLS: Record<string, string> = {
  'ESP32':    'https://documentation.espressif.com/esp32_technical_reference_manual_en.pdf',
  'ESP32-S2': 'https://documentation.espressif.com/esp32-s2_technical_reference_manual_en.pdf',
  'ESP32-S3': 'https://documentation.espressif.com/esp32-s3_technical_reference_manual_en.pdf',
  'ESP32-C3': 'https://documentation.espressif.com/esp32-c3_technical_reference_manual_en.pdf',
  'ESP32-C5': 'https://documentation.espressif.com/esp32-c5_technical_reference_manual_en.pdf',
  'ESP32-C6': 'https://documentation.espressif.com/esp32-c6_technical_reference_manual_en.pdf',
  'ESP32-H2': 'https://documentation.espressif.com/esp32-h2_technical_reference_manual_en.pdf',
}

// Fixed groups relevant to this chip, with pins the module actually breaks
// out, plus the ones it does not (so partial modules stay honest).
export interface ResolvedGroup extends FixedGroup {
  present: FixedGroupPin[]
  missing: FixedGroupPin[]
}

// Pins wired to the flash/PSRAM die inside the module or SiP - the Reddit
// point about "internal connections on modules / PICO chips". Derived from
// the existing constraint data.
function internalConnectionsGroup(chip: Chip): ResolvedGroup | null {
  const present: FixedGroupPin[] = chip.pins
    .filter(p => p.constraints.some(c => c.id === 'flash_reserved' || c.id === 'psram_reserved'))
    .map(p => ({
      gpio: p.gpio,
      role: p.constraints.some(c => c.id === 'psram_reserved') ? 'PSRAM' : 'flash',
    }))
  if (present.length === 0) return null
  return {
    id: 'internal',
    name: 'Wired inside the module',
    desc: 'These GPIOs connect to the flash or PSRAM die inside the module/SiP. They are electrically in use even where the pad or header pin is broken out - never repurpose them.',
    families: [chip.family],
    pins: present,
    present,
    missing: [],
  }
}

function deriveNameGroups(chip: Chip): ResolvedGroup[] {
  return NAME_GROUPS
    .filter(g => !g.families || g.families.includes(chip.family))
    .map(g => {
      // One pin per role, first (lowest-GPIO) wins - on chips where a signal
      // has more than one IO MUX candidate (S3 FSPI) we show the primary set.
      const present: FixedGroupPin[] = []
      const seenRoles = new Set<string>()
      for (const pin of chip.pins) {
        const hit = pin.names.find(n => g.match.test(n))
        if (!hit) continue
        const role = g.role(hit)
        if (seenRoles.has(role)) continue
        seenRoles.add(role)
        present.push({ gpio: pin.gpio, role })
      }
      return {
        id: g.id, name: g.name, desc: g.desc,
        families: g.families ?? [chip.family],
        pins: present, present, missing: [],
      }
    })
    .filter(g => g.present.length > 0)
}

// All fixed-interface groups for a chip: internal module wiring first, then
// hand-authored datasheet groups (classic ESP32), then groups derived from
// the Espressif symbol pin names (every family).
export function resolveGroups(chip: Chip): ResolvedGroup[] {
  const have = new Set(chip.pins.map(p => p.gpio))
  const hand = FIXED_GROUPS
    .filter(g => g.families.includes(chip.family))
    .map(g => ({
      ...g,
      present: g.pins.filter(p => have.has(p.gpio)),
      missing: g.pins.filter(p => !have.has(p.gpio)),
    }))
    .filter(g => g.present.length > 0)
  const internal = internalConnectionsGroup(chip)
  return [...(internal ? [internal] : []), ...hand, ...deriveNameGroups(chip)]
}

// Special-interface roles for one pin (for the pin detail panel).
export function specialInterfaces(chip: Chip, gpio: number): { group: string; role: string }[] {
  const out: { group: string; role: string }[] = []
  for (const g of resolveGroups(chip)) {
    const hit = g.present.find(p => p.gpio === gpio)
    if (hit) out.push({ group: g.name, role: hit.role })
  }
  return out
}
