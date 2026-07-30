import type { Capability, Pin } from '../../types/chip'
import { ESPRESSIF_GPIO } from './espressifGpio'

// Supplemental pin functions for chips whose Espressif KiCad symbol shipped with
// sparse pin names, so the generator could not extract the analog / JTAG / crystal
// alternate functions (e.g. ESP32-C5, whose symbol only named power, UART0 and USB).
//
// Values are transcribed from the official Espressif datasheet IO MUX table, not
// guessed. This overlay is applied on top of the generated pins in catalog.ts, so
// generated.ts stays untouched and fully regenerable - the enrichment is additive
// (names + capabilities only; it never changes the authoritative constraint set).

interface Enrich {
  names?: string[]      // alternate function names to append (after the GPIO name)
  caps?: Capability[]   // capabilities to add
}

// Canonical capability order, matching the generator, so the merged list is stable.
const CAP_ORDER: Capability[] = [
  'gpio', 'adc1', 'adc2', 'dac', 'touch', 'pwm', 'i2c', 'spi', 'uart', 'i2s', 'rtc', 'usb', 'jtag',
]

// ESP32-C5 (ESP32-C5 Series Datasheet, IO MUX and GPIO Matrix):
// ADC1 has 6 channels on GPIO1-6; GPIO0/1 carry the 32 kHz crystal; GPIO2-5 are
// the JTAG pins (MTMS/MTDI/MTCK/MTDO); GPIO0-6 are the LP (RTC-domain) GPIOs.
const C5: Record<number, Enrich> = {
  0: { names: ['XTAL_32K_P'], caps: ['rtc'] },
  1: { names: ['ADC1_CH0', 'XTAL_32K_N'], caps: ['adc1', 'rtc'] },
  2: { names: ['ADC1_CH1', 'MTMS'], caps: ['adc1', 'rtc', 'jtag'] },
  3: { names: ['ADC1_CH2', 'MTDI'], caps: ['adc1', 'rtc', 'jtag'] },
  4: { names: ['ADC1_CH3', 'MTCK'], caps: ['adc1', 'rtc', 'jtag'] },
  5: { names: ['ADC1_CH4', 'MTDO'], caps: ['adc1', 'rtc', 'jtag'] },
  6: { names: ['ADC1_CH5'], caps: ['adc1', 'rtc'] },
}

// ESP32-C3 (ESP32-C3 Series Datasheet, IO MUX table): ADC1/ADC2 and the 32 kHz
// crystal are already in the generated symbol; only the JTAG pins were missing.
// External JTAG: GPIO4-7 = MTMS/MTDI/MTCK/MTDO.
const C3: Record<number, Enrich> = {
  4: { names: ['MTMS'], caps: ['jtag'] },
  5: { names: ['MTDI'], caps: ['jtag'] },
  6: { names: ['MTCK'], caps: ['jtag'] },
  7: { names: ['MTDO'], caps: ['jtag'] },
}

const TABLE: Record<string, Record<number, Enrich>> = {
  esp32c5wroom1: C5,
  esp32c5mini1: C5,
  esp32c3: C3,
  esp32c3wroom02: C3,
  esp32c3devkitm: C3,
}

export function enrichPins(chipId: string, pins: Pin[]): Pin[] {
  const table = TABLE[chipId]
  if (!table) return pins
  return pins.map(p => {
    const e = table[p.gpio]
    if (!e) return p
    const names = [...p.names, ...(e.names ?? []).filter(n => !p.names.includes(n))]
    const capSet = new Set<Capability>([...p.capabilities, ...(e.caps ?? [])])
    const capabilities = CAP_ORDER.filter(c => capSet.has(c))
    return { ...p, names, capabilities }
  })
}

// ---------------------------------------------------------------------------
// Espressif esp-gpio-tool overlay: per-GPIO ground truth from Espressif's own
// dataset (espressifGpio.ts, generated from vendor/esp-gpio-tool). Fills in
// alternate-function names, capabilities and strapping roles the KiCad symbols
// don't carry. tests/espressif-crosscheck.test.ts enforces that the merged
// catalog never contradicts the upstream data.

// Which esp-gpio-tool target covers each catalog family key.
// C5 has no upstream target yet - it is covered by the manual table above.
export const FAM_TO_TARGET: Record<string, string> = {
  esp32: 'esp32', s2: 'esp32s2', s3: 'esp32s3', c3: 'esp32c3',
  c6: 'esp32c6', h2: 'esp32h2', c2: 'esp32c2',
}

// Only surface the function names users actually look for. The other
// alternates (EMAC_*, SDHOST_*, FSPI*, LP_*) would bloat the names column.
const FN_WHITELIST = /^(ADC\d_CH\d+|TOUCH\d+|DAC_\d|U0TXD|U0RXD|XTAL_32K_[PN]|MTCK|MTDI|MTMS|MTDO|USB_D[+-])$/

// Match our historical spellings (from the KiCad symbols) against Espressif's,
// so the merge doesn't list e.g. both DAC1 and DAC_1 on the same pin.
const ALIASES: Record<string, string> = { '32KXP': 'XTAL32KP', '32KXN': 'XTAL32KN' }
const canon = (n: string) => {
  const x = n.toUpperCase().replace(/[^A-Z0-9+-]/g, '')
  return ALIASES[x] ?? x
}

const fnCap = (f: string): Capability | null => {
  if (f.startsWith('ADC1_')) return 'adc1'
  if (f.startsWith('ADC2_')) return 'adc2'
  if (/^TOUCH\d/.test(f)) return 'touch'
  if (/^DAC_\d$/.test(f)) return 'dac'
  if (/^(MTCK|MTDI|MTMS|MTDO)$/.test(f)) return 'jtag'
  if (/^USB_D[+-]$/.test(f)) return 'usb'
  if (/^U0[TR]XD$/.test(f)) return 'uart'
  return null
}

export function applyEspressif(target: string | undefined, pins: Pin[]): Pin[] {
  const data = target ? ESPRESSIF_GPIO[target] : undefined
  if (!data) return pins
  return pins.map(p => {
    const up = data[p.gpio]
    if (!up) return p
    const have = new Set(p.names.map(canon))
    const names = [...p.names]
    const capSet = new Set<Capability>(p.capabilities)
    for (const f of up.fns) {
      const cap = fnCap(f)
      if (cap) capSet.add(cap)
      if (FN_WHITELIST.test(f) && !have.has(canon(f))) {
        names.push(f)
        have.add(canon(f))
      }
    }
    if (up.rtc) capSet.add('rtc')
    let constraints = p.constraints
    if (up.strap && !constraints.some(c => c.id === 'strapping_pin')) {
      constraints = [...constraints, {
        id: 'strapping_pin' as const,
        severity: 'warning' as const,
        title: 'Strapping pin',
        description: `Sampled at reset: ${up.strap.toLowerCase().startsWith('has') ? up.strap.charAt(0).toLowerCase() + up.strap.slice(1) : up.strap}. Avoid external loads that change its level at boot.`,
      }]
    }
    const ordered = CAP_ORDER.filter(c => capSet.has(c))
    const extra = [...capSet].filter(c => !CAP_ORDER.includes(c))
    return { ...p, names, capabilities: [...ordered, ...extra], constraints }
  })
}
