import type { Chip } from '../../types/chip'
import { ESP32S2_PINS, ESP32S2_LAYOUT } from './generated'

export const esp32s2: Chip = {
  id: 'esp32s2',
  name: 'ESP32-S2',
  family: 'ESP32-S2',
  totalGpio: 43,
  hasWifi: true,
  hasBle: false,
  hasBluetooth: false,
  cores: 1,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s2_datasheet_en.pdf',
  notes: [
    'No Bluetooth — Wi-Fi only.',
    'Native USB (USB OTG) on GPIO19/20 — do not use as plain GPIO while USB is connected.',
    'GPIO46 is input-only (no output, no pull-up/down).',
    'ADC2 has the same Wi-Fi conflict as the classic ESP32.',
    'GPIO0/45/46 are strapping pins sampled at boot.',
  ],
  module: {
    name: 'ESP32-S2-WROOM',
    form: 'wroom',
    arch: 'Single-core Xtensa LX7',
    pcb: 'green',
    accent: '#a855f7',
    radios: 'Wi-Fi 4 · no Bluetooth',
  },
  packageLayout: ESP32S2_LAYOUT,
  pins: ESP32S2_PINS,
}
