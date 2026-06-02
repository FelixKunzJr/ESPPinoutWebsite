import type { Chip } from '../../types/chip'
import { ESP32C3_PINS, ESP32C3_LAYOUT } from './generated'

export const esp32c3: Chip = {
  id: 'esp32c3',
  name: 'ESP32-C3',
  family: 'ESP32-C3',
  totalGpio: 22,
  hasWifi: true,
  hasBle: true,
  hasBluetooth: false,
  cores: 1,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf',
  notes: [
    'RISC-V single-core. No classic Bluetooth.',
    'No ADC2 (all ADC channels are ADC1) — no ADC/Wi-Fi conflict.',
    'GPIO18/19 are USB Serial/JTAG D−/D+.',
    'GPIO2, 8, 9 are strapping pins.',
    'No touch sensor, no DAC.',
  ],
  module: {
    name: 'ESP32-C3-MINI-1',
    form: 'mini',
    arch: 'Single-core RISC-V',
    pcb: 'black',
    accent: '#eab308',
    radios: 'Wi-Fi 4 · BLE 5',
  },
  packageLayout: ESP32C3_LAYOUT,
  pins: ESP32C3_PINS,
}
