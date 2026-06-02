import type { Chip } from '../../types/chip'
import { ESP32H2_PINS, ESP32H2_LAYOUT } from './generated'

export const esp32h2: Chip = {
  id: 'esp32h2',
  name: 'ESP32-H2',
  family: 'ESP32-H2',
  totalGpio: 28,
  hasWifi: false,
  hasBle: true,
  hasBluetooth: false,
  cores: 1,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-h2_datasheet_en.pdf',
  notes: [
    'No Wi-Fi — BLE 5 + IEEE 802.15.4 (Zigbee / Thread / Matter) only.',
    'No ADC/Wi-Fi conflict (no Wi-Fi radio).',
    'GPIO26/27 are the native USB Serial/JTAG D−/D+.',
    'GPIO8, 9 are strapping pins (GPIO2/3 are also sampled at boot).',
    'GPIO15–21 are used for the in-package SPI flash and are not broken out.',
    'No DAC, no capacitive touch.',
  ],
  module: {
    name: 'ESP32-H2-MINI-1',
    form: 'mini',
    arch: 'Single-core RISC-V',
    pcb: 'black',
    accent: '#ec4899',
    radios: 'BLE 5 · 802.15.4 · no Wi-Fi',
  },
  packageLayout: ESP32H2_LAYOUT,
  pins: ESP32H2_PINS,
}
