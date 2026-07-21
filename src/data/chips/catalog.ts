// Full module catalog. One Chip entry per distinct module pinout.
// Pin data + physical layouts come from ./generated.ts (authoritative, from
// Espressif's KiCad libraries); chip-level facts live in the FAMILIES table here.
import type { Chip, ModuleForm, Pin, PackageLayout, SymbolLayout } from '../../types/chip'
import * as G from './generated'
import { esp32 } from './esp32'
import { esp32wrover } from './esp32wrover'
import esp32S3ZeroJson from '../../../contrib/boards/esp32-s3-zero.board.json'
import esp32Devkit38Json from '../../../contrib/boards/esp32-devkit-38pin.board.json'
import esp32DevkitcJson from '../../../contrib/boards/esp32-devkitc.board.json'
import xiaoEsp32c3Json from '../../../contrib/boards/xiao-esp32c3.board.json'
import xiaoEsp32s3Json from '../../../contrib/boards/xiao-esp32s3.board.json'
import xiaoEsp32c6Json from '../../../contrib/boards/xiao-esp32c6.board.json'
import c3SuperMiniJson from '../../../contrib/boards/esp32-c3-supermini.board.json'
import c6SuperMiniJson from '../../../contrib/boards/esp32-c6-supermini.board.json'
import { resolveBoard } from '../boards/resolveBoard'
import { enrichPins } from './enrich'
import type { BoardSpec } from '../boards/types'



const GEN = G as unknown as Record<string, Pin[] | PackageLayout | SymbolLayout>

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
      'ADC2 (GPIO0,2,4,12-15,25-27) cannot be used while Wi-Fi is active.',
      'GPIO6-11 are connected to internal SPI flash - never use them.',
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
      'No Bluetooth - Wi-Fi only.',
      'Native USB (USB OTG) on GPIO19/20 - do not use as plain GPIO while USB is connected.',
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
      'No ADC2/Wi-Fi conflict - the S3 redesigned the ADC/Wi-Fi arbitration.',
      'GPIO19/20 are USB Serial/JTAG D−/D+. Do not use as GPIO while USB is connected.',
      'GPIO0 is a strapping pin (HIGH = normal boot, LOW = download mode).',
      'GPIO3/45/46 are strapping pins - avoid driving them at boot.',
      'GPIO35/36/37 are used by the Octal SPI PSRAM on R8/R16V variants (e.g. N8R8/N16R8 modules) - not available there.',
      'No DAC on the S3.',
    ],
  },
  c3: {
    family: 'ESP32-C3', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 4 · BLE 5', accent: '#eab308', totalGpio: 22,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf',
    notes: [
      'RISC-V single-core. No classic Bluetooth.',
      'No ADC2 (all ADC channels are ADC1) - no ADC/Wi-Fi conflict.',
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
      'No ADC2 - no ADC/Wi-Fi conflict.',
      'GPIO12/13 are the native USB Serial/JTAG D−/D+ (not flash).',
      'GPIO8, 9, 15 are strapping pins.',
      'GPIO24-30 drive the in-package SPI flash and are not broken out.',
      'No DAC, no capacitive touch.',
    ],
  },
  c5: {
    family: 'ESP32-C5', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 6 dual-band · BLE 5 · 802.15.4', accent: '#14b8a6', totalGpio: 29,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c5_datasheet_en.pdf',
    notes: [
      'RISC-V. Dual-band Wi-Fi 6 (2.4 GHz + 5 GHz), BLE 5, IEEE 802.15.4 (Zigbee / Thread / Matter).',
      'No ADC2 - no ADC/Wi-Fi conflict.',
      'GPIO26/27/28 control the boot mode (strapping pins); GPIO7 selects the JTAG source.',
      'No DAC.',
    ],
  },
  h2: {
    family: 'ESP32-H2', cores: 1, hasWifi: false, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'BLE 5 · 802.15.4 · no Wi-Fi', accent: '#ec4899', totalGpio: 28,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-h2_datasheet_en.pdf',
    notes: [
      'No Wi-Fi - BLE 5 + IEEE 802.15.4 (Zigbee / Thread / Matter) only.',
      'No ADC/Wi-Fi conflict (no Wi-Fi radio).',
      'GPIO26/27 are the native USB Serial/JTAG D−/D+.',
      'GPIO8, 9 are strapping pins (GPIO2/3 are also sampled at boot).',
      'No DAC, no capacitive touch.',
    ],
  },
  c2: {
    family: 'ESP32-C2', cores: 1, hasWifi: true, hasBle: true, hasBluetooth: false,
    arch: 'Single-core RISC-V', radios: 'Wi-Fi 4 · BLE 5', accent: '#ef4444', totalGpio: 14,
    datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp8684_datasheet_en.pdf',
    notes: [
      'The ESP32-C2 group is sold as ESP8684. RISC-V single-core up to 120 MHz.',
      'Only 14 GPIOs - the smallest pin budget of any ESP32.',
      'GPIO8 and GPIO9 are the only strapping pins.',
      'All 5 ADC channels are ADC1 - no ADC/Wi-Fi conflict.',
      'No native USB. Flashing and the boot log go over UART0.',
      'No DAC, no capacitive touch, no classic Bluetooth.',
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
  // ESP8685 carries ESP32-C3 silicon, so it inherits the C3 family rules.
  { id: 'esp8685wroom06', fam: 'c3', name: 'ESP8685-WROOM-06',  form: 'wroom', pcb: 'black', prefix: 'ESP8685_WROOM_06', arch: 'Single-core RISC-V · ESP32-C3 silicon' },
  // ESP32-C2
  { id: 'esp8684wroom02c', fam: 'c2', name: 'ESP8684-WROOM-02C', form: 'wroom', pcb: 'black', prefix: 'ESP8684_WROOM_02C' },
  // Development boards
  // esp32devkitc is built from a contrib board spec below (rich WROOM-32 base),
  // not from the sparse KiCad-generated ESP32_DEVKITC_* set.
  { id: 'esp32devkitm1',  fam: 'esp32', name: 'ESP32-DevKitM-1',     form: 'board', pcb: 'black', prefix: 'ESP32_DEVKITM_1', arch: 'Dev board · ESP32-MINI-1' },
  { id: 'esp32s2devkitc', fam: 's2',    name: 'ESP32-S2-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'S2_DEVKITC_1',  arch: 'Dev board · ESP32-S2-WROOM' },
  { id: 'esp32s3devkitc', fam: 's3',    name: 'ESP32-S3-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'S3_DEVKITC',    arch: 'Dev board · ESP32-S3-WROOM-1' },
  { id: 'esp32c3devkitm', fam: 'c3',    name: 'ESP32-C3-DevKitM-1',  form: 'board', pcb: 'black', prefix: 'C3_DEVKITM',    arch: 'Dev board · ESP32-C3-MINI-1' },
  { id: 'esp32c3devkitc', fam: 'c3',    name: 'ESP32-C3-DevKitC-02', form: 'board', pcb: 'black', prefix: 'C3_DEVKITC_02', arch: 'Dev board · ESP32-C3-WROOM-02' },
  { id: 'esp32c6devkitc', fam: 'c6',    name: 'ESP32-C6-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'C6_DEVKITC',    arch: 'Dev board · ESP32-C6-WROOM-1' },
  { id: 'esp32c6devkitm', fam: 'c6',    name: 'ESP32-C6-DevKitM-1',  form: 'board', pcb: 'black', prefix: 'C6_DEVKITM_1',  arch: 'Dev board · ESP32-C6-MINI-1' },
  { id: 'esp32c5devkitc', fam: 'c5',    name: 'ESP32-C5-DevKitC-1',  form: 'board', pcb: 'black', prefix: 'C5_DEVKITC_1',  arch: 'Dev board · ESP32-C5-WROOM-1' },
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
    symbolLayout: GEN[`${spec.prefix}_SYMBOL`] as SymbolLayout | undefined,
    pins: enrichPins(spec.id, GEN[`${spec.prefix}_PINS`] as Pin[]),
  }
}

const generated = MODULES.map(build)
const byId = (id: string) => generated.find(c => c.id === id)!

export const esp32S3Zero = resolveBoard(esp32S3ZeroJson as unknown as BoardSpec, byId('esp32s3')).chip!
export const esp32Devkit38 = resolveBoard(esp32Devkit38Json as unknown as BoardSpec, esp32).chip!
// DevKitC is hand-authored on the rich WROOM-32 base (esp32.ts) so its per-pin
// peripheral labels (VSPID/MOSI, UART, etc.) match /esp32 and the Elegoo board,
// instead of the sparse KiCad-generated set. Same silicon, same functions.
export const esp32Devkitc = resolveBoard(esp32DevkitcJson as unknown as BoardSpec, esp32).chip!

// Seeed Studio XIAO boards - same tiny footprint, different GPIO map per silicon.
export const xiaoEsp32c3 = resolveBoard(xiaoEsp32c3Json as unknown as BoardSpec, byId('esp32c3')).chip!
export const xiaoEsp32s3 = resolveBoard(xiaoEsp32s3Json as unknown as BoardSpec, byId('esp32s3')).chip!
export const xiaoEsp32c6 = resolveBoard(xiaoEsp32c6Json as unknown as BoardSpec, byId('esp32c6')).chip!

// SuperMini boards - unbranded, but the reference schematics are published and
// the header order below is read off them plus the vendor pinout art.
export const c3SuperMini = resolveBoard(c3SuperMiniJson as unknown as BoardSpec, byId('esp32c3')).chip!
export const c6SuperMini = resolveBoard(c6SuperMiniJson as unknown as BoardSpec, byId('esp32c6')).chip!


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
  byId('esp8685wroom06'),
  byId('esp32c6'),
  byId('esp32c6wroom1'),
  byId('esp32c5wroom1'),
  byId('esp32c5mini1'),
  byId('esp32h2'),
  byId('esp8684wroom02c'),
  // Dev boards
  esp32Devkitc,
  esp32Devkit38,
  byId('esp32devkitm1'),
  byId('esp32s2devkitc'),
  byId('esp32s3devkitc'),
  esp32S3Zero,
  byId('esp32c3devkitm'),
  byId('esp32c3devkitc'),
  byId('esp32c6devkitc'),
  byId('esp32c6devkitm'),
  byId('esp32c5devkitc'),
  xiaoEsp32c3,
  xiaoEsp32s3,
  xiaoEsp32c6,
  c3SuperMini,
  c6SuperMini,
]

export function getChip(id: string): Chip | undefined {
  return CHIPS.find(c => c.id === id)
}
