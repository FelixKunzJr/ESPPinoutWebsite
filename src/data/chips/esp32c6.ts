import type { Chip } from '../../types/chip'
import { ESP32C6_PINS, ESP32C6_LAYOUT } from './generated'

export const esp32c6: Chip = {
  id: 'esp32c6',
  name: 'ESP32-C6',
  family: 'ESP32-C6',
  totalGpio: 31,
  hasWifi: true,
  hasBle: true,
  hasBluetooth: false,
  cores: 1,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf',
  notes: [
    'RISC-V. Wi-Fi 6 (802.11ax), BLE 5, and IEEE 802.15.4 (Zigbee / Thread / Matter).',
    'No ADC2 — no ADC/Wi-Fi conflict.',
    'GPIO12/13 are the native USB Serial/JTAG D−/D+ (not flash).',
    'GPIO8, 9, 15 are strapping pins.',
    'GPIO24–30 drive the in-package SPI flash and are not broken out on the module.',
    'No DAC, no capacitive touch.',
  ],
  module: {
    name: 'ESP32-C6-MINI-1',
    form: 'mini',
    arch: 'Single-core RISC-V',
    pcb: 'black',
    accent: '#f97316',
    radios: 'Wi-Fi 6 · BLE 5 · 802.15.4',
  },
  packageLayout: ESP32C6_LAYOUT,
  pins: ESP32C6_PINS,
}
