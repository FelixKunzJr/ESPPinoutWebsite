import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { parse } from 'yaml'
import { CHIPS } from '../src/data/chips/index'
import type { Pin } from '../src/types/chip'

// Cross-validates every module-level chip in the catalog against Espressif's
// own esp-gpio-tool dataset (vendor/esp-gpio-tool, Apache-2.0). Boards inherit
// their pins from these chips, so this covers the whole catalog. Any
// disagreement with the upstream data must either be fixed or explicitly
// allowlisted below with a reason.

const here = dirname(fileURLToPath(import.meta.url))

interface TargetGpio {
  power_domain?: string
  rtc?: boolean
  lp?: boolean
  functions: string[]
  strapping?: string
  at_reset?: string
  is_output?: boolean
}
interface Target { gpio: Record<string, TargetGpio> }

const loadTarget = (name: string): Target =>
  parse(readFileSync(resolve(here, `../vendor/esp-gpio-tool/targets/${name}.yaml`), 'utf8')) as Target

const CHIP_TO_TARGET: Record<string, string> = {
  esp32: 'esp32', esp32wroomda: 'esp32', esp32mini1: 'esp32', esp32pico: 'esp32', esp32wrover: 'esp32',
  esp32s2: 'esp32s2', esp32s2mini1: 'esp32s2', esp32s2solo: 'esp32s2', esp32s2wrover: 'esp32s2',
  esp32s3: 'esp32s3', esp32s3wroom2: 'esp32s3', esp32s3mini1: 'esp32s3',
  esp32c3: 'esp32c3', esp32c3wroom02: 'esp32c3', esp8685wroom06: 'esp32c3',
  esp32c6: 'esp32c6', esp32c6wroom1: 'esp32c6',
  esp32h2: 'esp32h2',
  esp8684wroom02c: 'esp32c2',
}

// Our KiCad-derived spellings of the same function names.
const ALIASES: Record<string, string> = { '32KXP': 'XTAL32KP', '32KXN': 'XTAL32KN' }
const canon = (n: string) => {
  const x = n.toUpperCase().replace(/[^A-Z0-9+-]/g, '')
  return ALIASES[x] ?? x
}

// Accepted disagreements with the upstream dataset, each with a reason.
const ALLOW = new Set([
  // Upstream ships the H2 GPIO2/3 strapping roles commented out ("SPI Download
  // Boot mode"); the H2 datasheet lists them, so we keep our warning.
  'esp32h2/2/strapping', 'esp32h2/3/strapping',
  // Upstream is missing is_output: false on S2 GPIO46. The ESP32-S2 datasheet
  // and ESP-IDF GPIO docs both state GPIO46 is input-only with a fixed
  // pull-down (unlike the S3, where GPIO46 is bidirectional). Reported upstream.
  'esp32s2/46/input-only',
])

const FN_NAMES = /^(ADC\d_CH\d+|TOUCH\d+|DAC_\d|U0TXD|U0RXD|XTAL_32K_[PN]|MTCK|MTDI|MTMS|MTDO|USB_D[+-])$/

describe('catalog agrees with Espressif esp-gpio-tool data', () => {
  for (const [chipId, targetName] of Object.entries(CHIP_TO_TARGET)) {
    it(`${chipId} matches ${targetName}.yaml`, () => {
      const chip = CHIPS.find(c => c.id === chipId)
      expect(chip, chipId).toBeDefined()
      const target = loadTarget(targetName)
      const issues: string[] = []
      const report = (pin: Pin, msg: string) => issues.push(`GPIO${pin.gpio}: ${msg}`)
      const allowed = (pin: Pin, kind: string) => ALLOW.has(`${targetName}/${pin.gpio}/${kind}`)

      for (const pin of chip!.pins) {
        const up = target.gpio[String(pin.gpio)]
        if (!up) { report(pin, `not present in Espressif's GPIO map`); continue }
        const fns = up.functions ?? []
        const has = (c: string) => pin.capabilities.includes(c as Pin['capabilities'][number])
        const constraintIds = pin.constraints.map(c => c.id)

        const upInputOnly = up.is_output === false
        const ourInputOnly = constraintIds.includes('input_only') || has('input_only')
        if (upInputOnly !== ourInputOnly && !allowed(pin, 'input-only'))
          report(pin, `input-only mismatch: espressif=${upInputOnly} ours=${ourInputOnly}`)

        const upStrap = up.strapping !== undefined
        const ourStrap = constraintIds.includes('strapping_pin')
        if (upStrap !== ourStrap && !allowed(pin, 'strapping'))
          report(pin, `strapping mismatch: espressif=${upStrap} ours=${ourStrap}`)

        const upAdc1 = fns.some(f => f.startsWith('ADC1_'))
        const upAdc2 = fns.some(f => f.startsWith('ADC2_'))
        if (upAdc1 !== has('adc1')) report(pin, `adc1 mismatch: espressif=${upAdc1} ours=${has('adc1')}`)
        if (upAdc2 !== has('adc2')) report(pin, `adc2 mismatch: espressif=${upAdc2} ours=${has('adc2')}`)
        const upTouch = fns.some(f => f.startsWith('TOUCH'))
        if (upTouch !== has('touch')) report(pin, `touch mismatch: espressif=${upTouch} ours=${has('touch')}`)
        const upDac = fns.some(f => f.startsWith('DAC_'))
        if (upDac !== has('dac')) report(pin, `dac mismatch: espressif=${upDac} ours=${has('dac')}`)
        if (fns.some(f => f.startsWith('USB_D')) && !has('usb')) report(pin, `missing usb capability`)
        if (fns.some(f => ['MTCK', 'MTDI', 'MTMS', 'MTDO'].includes(f)) && !has('jtag')) report(pin, `missing jtag capability`)

        const ourNames = new Set(pin.names.map(canon))
        for (const f of fns) {
          if (FN_NAMES.test(f) && !ourNames.has(canon(f))) report(pin, `name "${f}" missing from [${pin.names.join(', ')}]`)
        }

        const upRtc = up.rtc === true || up.lp === true
        if (upRtc !== has('rtc')) report(pin, `rtc mismatch: espressif=${upRtc} ours=${has('rtc')}`)
      }

      expect(issues).toEqual([])
    })
  }
})
