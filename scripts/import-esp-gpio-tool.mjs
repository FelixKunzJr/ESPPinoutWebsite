// Regenerates src/data/chips/espressifGpio.ts from the vendored esp-gpio-tool
// dataset (vendor/esp-gpio-tool/targets/*.yaml, Espressif Systems, Apache-2.0).
// Run: node scripts/import-esp-gpio-tool.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, basename } from 'node:path'
import { parse } from 'yaml'

const here = dirname(fileURLToPath(import.meta.url))
const targetsDir = resolve(here, '../vendor/esp-gpio-tool/targets')
const outFile = resolve(here, '../src/data/chips/espressifGpio.ts')

const vendorReadme = readFileSync(resolve(here, '../vendor/esp-gpio-tool/README.md'), 'utf8')
const commit = vendorReadme.match(/commit: `([0-9a-f]+)`/)?.[1] ?? 'unknown'

const out = {}
for (const file of readdirSync(targetsDir).filter(f => f.endsWith('.yaml')).sort()) {
  const doc = parse(readFileSync(resolve(targetsDir, file), 'utf8'))
  const target = basename(file, '.yaml')
  const gpios = {}
  for (const [num, g] of Object.entries(doc.gpio ?? {})) {
    const entry = { fns: g.functions ?? [] }
    // The C6 dataset calls its always-on domain "lp" instead of "rtc"; both mean
    // the pin lives in the low-power domain and works during deep sleep.
    if (g.rtc || g.lp) entry.rtc = true
    if (g.strapping) entry.strap = String(g.strapping)
    if (g.at_reset) entry.atReset = g.at_reset
    if (g.power_domain) entry.domain = g.power_domain
    if (g.is_output === false) entry.inputOnly = true
    gpios[num] = entry
  }
  out[target] = gpios
}

const body = Object.entries(out)
  .map(([target, gpios]) => {
    const rows = Object.entries(gpios)
      .map(([num, e]) => `    ${num}: ${JSON.stringify(e)},`)
      .join('\n')
    return `  ${target}: {\n${rows}\n  },`
  })
  .join('\n')

writeFileSync(outFile, `// AUTO-GENERATED from Espressif's esp-gpio-tool dataset. Do NOT edit by hand.
// Regenerate: node scripts/import-esp-gpio-tool.mjs
// Source: https://github.com/espressif/esp-gpio-tool @ ${commit}
// Copyright Espressif Systems (Shanghai) CO LTD, Apache-2.0 (vendor/esp-gpio-tool/LICENSE).

export interface EspressifGpio {
  fns: string[]        // IO MUX / dedicated alternate functions for this pad
  rtc?: boolean        // pin is in the RTC / low-power domain (usable in deep sleep)
  strap?: string       // strapping role sampled at reset, verbatim from Espressif
  atReset?: string     // internal pull at reset: 'PUP' (pull-up) or 'PDOWN' (pull-down)
  domain?: string      // power domain, e.g. VDD3P3_RTC, VDD_SDIO (flash), VDD_SPI
  inputOnly?: boolean  // pad has no output driver
}

export const ESPRESSIF_GPIO: Record<string, Record<number, EspressifGpio>> = {
${body}
}
`)
console.log(`wrote ${outFile}`)
