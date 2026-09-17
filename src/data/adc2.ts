// How ADC2 behaves on each family. This differs per silicon, so the pin panel,
// the conflict checker, the SEO pages and the per-pin constraints (attached in
// applyEspressif) all read it from here instead of assuming the classic ESP32
// behavior everywhere.
//
// Sources (quoted in GitHub issue #19):
// - ESP32 'wifi_blocks': ESP-IDF v4.4 ADC docs, adc2_get_raw(): "If Wi-Fi is
//   started via esp_wifi_start(), this function will always fail with
//   ESP_ERR_TIMEOUT." In the driver, adc2_wifi_acquire() takes the ADC2 lock
//   for the whole Wi-Fi session on CONFIG_IDF_TARGET_ESP32 only.
// - ESP32-S2/S3 'wifi_may_fail': ESP-IDF v4.4 ADC docs (S2 and S3 pages):
//   "reading operation of adc2_get_raw() may fail between esp_wifi_start() and
//   esp_wifi_stop()". These chips share ADC2 through a hardware arbiter with
//   Wi-Fi at the highest priority; a pre-empted read returns ESP_ERR_TIMEOUT.
//   arduino-esp32's analogRead() ignores that return code.
// - ESP32-C3 'unsupported': current ESP-IDF adc_oneshot docs (C3 page): "ADC2
//   oneshot mode is no longer supported, due to hardware limitations. The
//   results are not stable. This issue can be found in ESP32-C3 Series SoC
//   Errata."

import type { Constraint } from '../types/chip'

export type Adc2Behavior = 'wifi_blocks' | 'wifi_may_fail' | 'unsupported'

const BY_FAMILY: Record<string, Adc2Behavior> = {
  'ESP32': 'wifi_blocks',
  'ESP32-S2': 'wifi_may_fail',
  'ESP32-S3': 'wifi_may_fail',
  'ESP32-C3': 'unsupported',
}

// esp-gpio-tool target name -> chip.family, for the enrichment pass.
const TARGET_FAMILY: Record<string, string> = {
  esp32: 'ESP32', esp32s2: 'ESP32-S2', esp32s3: 'ESP32-S3', esp32c3: 'ESP32-C3',
}

export function adc2Behavior(family: string): Adc2Behavior | undefined {
  return BY_FAMILY[family]
}

// The warning attached to every ADC2 pin of an esp-gpio-tool target.
export function adc2Constraint(target: string): Constraint | undefined {
  switch (adc2Behavior(TARGET_FAMILY[target] ?? '')) {
    case 'wifi_blocks':
      return { id: 'adc2_no_wifi', severity: 'warning', title: 'ADC2 unusable with Wi-Fi', description: 'ADC2 is claimed by the Wi-Fi driver; analogRead() on this pin fails while Wi-Fi is active. Prefer ADC1 pins.' }
    case 'wifi_may_fail':
      return { id: 'adc2_no_wifi', severity: 'warning', title: 'ADC2 unreliable with Wi-Fi', description: 'ADC2 is shared with Wi-Fi, and Wi-Fi has priority. While Wi-Fi is active a read can fail (ESP_ERR_TIMEOUT in ESP-IDF), and analogRead() does not report it. Prefer ADC1 pins.' }
    case 'unsupported':
      return { id: 'adc2_unsupported', severity: 'warning', title: 'ADC2 not supported', description: 'ESP-IDF no longer supports ADC2 on the ESP32-C3 because of a hardware limitation (unstable results). Use an ADC1 pin for analog reads.' }
    default:
      return undefined
  }
}

// Long description for the capability card in the pin panel.
export function adc2Description(family: string): string {
  switch (adc2Behavior(family)) {
    case 'wifi_blocks':
      return 'Analog-to-digital converter, unit 2. The Wi-Fi driver holds ADC2 while Wi-Fi is on, so every read fails until Wi-Fi stops. Use ADC1 for analog reads with Wi-Fi.'
    case 'wifi_may_fail':
      return 'Analog-to-digital converter, unit 2. Shared with Wi-Fi, which has priority: reads may fail while Wi-Fi is active, and analogRead() does not report the failure. Prefer ADC1 with Wi-Fi.'
    case 'unsupported':
      return 'Analog-to-digital converter, unit 2. ESP-IDF no longer supports ADC2 on this chip because of a hardware limitation (unstable results). Use ADC1.'
    default:
      return 'Analog-to-digital converter, unit 2.'
  }
}

// Short label for the per-pin SEO pages.
export function adc2Label(family: string): string {
  switch (adc2Behavior(family)) {
    case 'wifi_blocks':   return 'ADC2 analog input (unusable while Wi-Fi is active)'
    case 'wifi_may_fail': return 'ADC2 analog input (reads may fail while Wi-Fi is active)'
    case 'unsupported':   return 'ADC2 analog input (not supported by ESP-IDF on this chip)'
    default:              return 'ADC2 analog input'
  }
}

// Mapping-builder warning for a pin assigned as ADC, or null if none applies.
export function adc2ConflictMessage(family: string, hasWifi: boolean, gpio: number): string | null {
  switch (adc2Behavior(family)) {
    case 'wifi_blocks':
      return hasWifi ? `GPIO${gpio} uses ADC2 - every read fails while Wi-Fi is active. Use an ADC1 pin instead.` : null
    case 'wifi_may_fail':
      return hasWifi ? `GPIO${gpio} uses ADC2 - reads may fail while Wi-Fi is active. Use an ADC1 pin instead.` : null
    case 'unsupported':
      return `GPIO${gpio} uses ADC2, which ESP-IDF does not support on this chip. Use an ADC1 pin instead.`
    default:
      return null
  }
}
