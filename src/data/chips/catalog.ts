// Full module catalog. One Chip entry per distinct module pinout.
// Pin data + physical layouts come from ./generated.ts (authoritative, from
// Espressif's KiCad libraries); chip-level facts live in the FAMILIES table here.
import type { Chip, ModuleForm, Pin, PackageLayout } from '../../types/chip'
import * as G from './generated'
import { esp32 } from './esp32'
import { esp32wrover } from './esp32wrover'

const GEN = G as unknown as Record<string, Pin[] | PackageLayout>

interface Family {
  family: string
  cores: number
  hasWifi: boolean
  hasBle: boolean
  hasBluetooth: boolean
  arch: string
  radios: string
  accent: string
  totalGpio: number
  datasheetUrl: string
  notes: string[]
}

const FAMILIES: Record<string, Family> = {
  esp32: {
    family: 'ESP32', cores: 2, hasWifi: true, hasBle: true, hasBluetooth: true,
    arch: 'Dual-core Xtensa LX6', radios: 'Wi-Fi 4 · BT · BLE', accent: '#3b82f6', totalGpio: 34,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf',
    notes: [
      'ADC2 (GPIO0,2,4,12–15,25–27) cannot be used while Wi-Fi is active.',
      'GPIO6–11 are connected to internal SPI flash — never use them.',
      'GPIO34, 35, 36, 39 are input-only (no output, no pull-up/down).',
      'GPIO0 must be HIGH/floating at boot to boot from flash; pull LOW for the bootloader.',
      'GPIO12 (MTDI) must be LOW at boot for 3.3 V flash.',
      'GPIO15 (MTDO) must be HIGH at boot to suppress the boot log on UART0.',
    ],
  },
  s2: {
    family: 'ESP32-S2', cores: 1, hasWifi: true, hasBle: false, hasBluetooth: false,
    arch: 'Single-core Xtensa LX7', radios: 'Wi-Fi 4 · no Bluetooth', accent: '#a855f7', totalGpio: 43,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s2_datasheet_en.pdf',
    notes: [
      'No Bluetooth — Wi-Fi only.',
      'Native USB (USB OTG) on GPIO19/20 — do not use as plain GPIO while USB is connected.',
      'GPIO46 is input-only (no output, no pull-up/down).',
      'ADC2 has the same Wi-Fi conflict as the classic ESP32.',
      'GPIO0/45/46 are strapping pins sampled at boot.',
    ],
  },
  s3: {
    family: 'ESP32-S3', cores: 2, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Dual-core Xtensa LX7', radios: 'Wi-Fi 4 · BLE 5', accent: '#22c55e', totalGpio: 45,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf',
    notes: [
      'No ADC2/Wi-Fi conflict — the S3 redesigned the ADC/Wi-Fi arbitration.',
      'GPIO19/20 are USB Serial/JTAG D−/D+. Do not use as GPIO while USB is connected.',
      'GPIO0 is a strapping pin (HIGH = normal boot, LOW = download mode).',
      'GPIO3/45/46 are strapping pins — avoid driving them at boot.',
      'No DAC on the S3.',
    ],
  },
  c3: {
    family: 'ESP32-C3', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 4 · BLE 5', accent: '#eab308', totalGpio: 22,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf',
    notes: [
      'RISC-V single-core. No classic Bluetooth.',
      'No ADC2 (all ADC channels are ADC1) — no ADC/Wi-Fi conflict.',
      'GPIO18/19 are USB Serial/JTAG D−/D+.',
      'GPIO2, 8, 9 are strapping pins.',
      'No touch sensor, no DAC.',
    ],
  },
  c6: {
    family: 'ESP32-C6', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 6 · BLE 5 · 802.15.4', accent: '#f97316', totalGpio: 31,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf',
    notes: [
      'RISC-V. Wi-Fi 6 (802.11ax), BLE 5, and IEEE 802.15.4 (Zigbee / Thread / Matter).',
      'No ADC2 — no ADC/Wi-Fi conflict.',
      'GPIO12/13 are the native USB Serial/JTAG D−/D+ (not flash).',
      'GPIO8, 9, 15 are strapping pins.',
      'GPIO24–30 drive the in-package SPI flash and are not broken out.',
      'No DAC, no capacitive touch.',
    ],
  },
  c5: {
    family: 'ESP32-C5', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 6 dual-band · BLE 5 · 802.15.4', accent: '#14b8a6', totalGpio: 29,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c5_datasheet_en.pdf',
    notes: [
      'RISC-V. Dual-band Wi-Fi 6 (2.4 GHz + 5 GHz), BLE 5, IEEE 802.15.4 (Zigbee / Thread / Matter).',
      'No ADC2 — no ADC/Wi-Fi conflict.',
      'GPIO26/27/28 control the boot mode (strapping pins); GPIO7 selects the JTAG source.',
      'No DAC.',
    ],
  },
  h2: {
    family: 'ESP32-H2', cores: 1, hasWifi: false, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'BLE 5 · 802.15.4 · no Wi-Fi', accent: '#ec4899', totalGpio: 28,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-h2_datasheet_en.pdf',
    notes: [
      'No Wi-Fi — BLE 5 + IEEE 802.15.4 (Zigbee / Thread / Matter) only.',
      'No ADC/Wi-Fi conflict (no Wi-Fi radio).',
      'GPIO26/27 are the native USB Serial/JTAG D−/D+.',
      'GPIO8, 9 are strapping pins (GPIO2/3 are also sampled at boot).',
      'No DAC, no capacitive touch.',
    ],
  },
}

interface ModuleSpec {
  id: string
  fam: keyof typeof FAMILIES
  name: string        // module silkscreen / display name
  form: ModuleForm
  pcb: 'green' | 'black'
  prefix: string      // const prefix in generated.ts
  arch?: string       // override (e.g. PSRAM variants)
}

const MODULES: ModuleSpec[] = [
  // ESP32 (classic)
  { id: 'esp32wroomda', fam: 'esp32', name: 'ESP32-WROOM-DA',     form: 'wroom', pcb: 'green', prefix: 'ESP32_WROOM_DA', arch: 'Dual-core Xtensa LX6 · dual PCB antenna' },
  { id: 'esp32mini1',   fam: 'esp32', name: 'ESP32-MINI-1',       form: 'mini',  pcb: 'black', prefix: 'ESP32_MINI_1' },
  { id: 'esp32pico',    fam: 'esp32', name: 'ESP32-PICO-MINI-02', form: 'mini',  pcb: 'black', prefix: 'ESP32_PICO_MINI_02', arch: 'Dual-core Xtensa LX6 · SiP' },
  // ESP32-S2
  { id: 'esp32s2',        fam: 's2', name: 'ESP32-S2-WROOM',  form: 'wroom',  pcb: 'green', prefix: 'S2_WROOM' },
  { id: 'esp32s2mini1',   fam: 's2', name: 'ESP32-S2-MINI-1', form: 'mini',   pcb: 'black', prefix: 'S2_MINI_1' },
  { id: 'esp32s2solo',    fam: 's2', name: 'ESP32-S2-SOLO',   form: 'wroom',  pcb: 'green', prefix: 'S2_SOLO' },
  { id: 'esp32s2wrover',  fam: 's2', name: 'ESP32-S2-WROVER', form: 'wrover', pcb: 'black', prefix: 'S2_WROVER', arch: 'Single-core Xtensa LX7 · 2 MB PSRAM' },
  // ESP32-S3
  { id: 'esp32s3',        fam: 's3', name: 'ESP32-S3-WROOM-1', form: 'wroom', pcb: 'black', prefix: 'S3_WROOM_1' },
  { id: 'esp32s3wroom2',  fam: 's3', name: 'ESP32-S3-WROOM-2', form: 'wroom', pcb: 'black', prefix: 'S3_WROOM_2', arch: 'Dual-core Xtensa LX7 · Octal PSRAM' },
  { id: 'esp32s3mini1',   fam: 's3', name: 'ESP32-S3-MINI-1',  form: 'mini',  pcb: 'black', prefix: 'S3_MINI_1' },
  // ESP32-C3
  { id: 'esp32c3',        fam: 'c3', name: 'ESP32-C3-MINI-1',   form: 'mini',  pcb: 'black', prefix: 'C3_MINI_1' },
  { id: 'esp32c3wroom02', fam: 'c3', name: 'ESP32-C3-WROOM-02', form: 'wroom', pcb: 'black', prefix: 'C3_WROOM_02' },
  // ESP32-C6
  { id: 'esp32c6',        fam: 'c6', name: 'ESP32-C6-MINI-1',  form: 'mini',  pcb: 'black', prefix: 'C6_MINI_1' },
  { id: 'esp32c6wroom1',  fam: 'c6', name: 'ESP32-C6-WROOM-1', form: 'wroom', pcb: 'black', prefix: 'C6_WROOM_1' },
  // ESP32-C5
  { id: 'esp32c5wroom1',  fam: 'c5', name: 'ESP32-C5-WROOM-1', form: 'wroom', pcb: 'black', prefix: 'C5_WROOM_1' },
  { id: 'esp32c5mini1',   fam: 'c5', name: 'ESP32-C5-MINI-1',  form: 'mini',  pcb: 'black', prefix: 'C5_MINI_1' },
  // ESP32-H2
  { id: 'esp32h2',        fam: 'h2', name: 'ESP32-H2-MINI-1',  form: 'mini',  pcb: 'black', prefix: 'H2_MINI_1' },
  // Development boards
  { id: 'esp32devkitc',   fam: 'esp32', name: 'ESP32-DevKitC',       form: 'board', pcb: 'black', prefix: 'ESP32_DEVKITC', arch: 'Dev board · ESP32-WROOM-32' },
  { id: 'esp32s3devkitc', fam: 's3',    name: 'ESP32-S3-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'S3_DEVKITC',    arch: 'Dev board · ESP32-S3-WROOM-1' },
  { id: 'esp32c3devkitm', fam: 'c3',    name: 'ESP32-C3-DevKitM-1',  form: 'board', pcb: 'black', prefix: 'C3_DEVKITM',    arch: 'Dev board · ESP32-C3-MINI-1' },
  { id: 'esp32c6devkitc', fam: 'c6',    name: 'ESP32-C6-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'C6_DEVKITC',    arch: 'Dev board · ESP32-C6-WROOM-1' },
]

function build(spec: ModuleSpec): Chip {
  const f = FAMILIES[spec.fam]
  return {
    id: spec.id,
    name: spec.name,
    family: f.family,
    totalGpio: f.totalGpio,
    hasWifi: f.hasWifi,
    hasBle: f.hasBle,
    hasBluetooth: f.hasBluetooth,
    cores: f.cores,
    datasheetUrl: f.datasheetUrl,
    notes: f.notes,
    module: {
      name: spec.name,
      form: spec.form,
      arch: spec.arch ?? f.arch,
      pcb: spec.pcb,
      accent: f.accent,
      radios: f.radios,
    },
    packageLayout: GEN[`${spec.prefix}_LAYOUT`] as PackageLayout,
    pins: GEN[`${spec.prefix}_PINS`] as Pin[],
  }
}

const generated = MODULES.map(build)
const byId = (id: string) => generated.find(c => c.id === id)!

// Ordered, grouped by family for the selector.
export const CHIPS: Chip[] = [
  esp32,                       // ESP32-WROOM-32
  byId('esp32wroomda'),
  esp32wrover,                 // ESP32-WROVER-E
  byId('esp32mini1'),
  byId('esp32pico'),
  byId('esp32s2'),
  byId('esp32s2mini1'),
  byId('esp32s2solo'),
  byId('esp32s2wrover'),
  byId('esp32s3'),
  byId('esp32s3wroom2'),
  byId('esp32s3mini1'),
  byId('esp32c3'),
  byId('esp32c3wroom02'),
  byId('esp32c6'),
  byId('esp32c6wroom1'),
  byId('esp32c5wroom1'),
  byId('esp32c5mini1'),
  byId('esp32h2'),
  // Dev boards
  byId('esp32devkitc'),
  byId('esp32s3devkitc'),
  byId('esp32c3devkitm'),
  byId('esp32c6devkitc'),
]

export function getChip(id: string): Chip | undefined {
  return CHIPS.find(c => c.id === id)
}
