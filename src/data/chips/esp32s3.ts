import type { Chip } from '../../types/chip'
import { ESP32S3_PINS, ESP32S3_LAYOUT } from './generated'

export const esp32s3: Chip = {
  id: 'esp32s3',
  name: 'ESP32-S3',
  family: 'ESP32-S3',
  totalGpio: 45,
  hasWifi: true,
  hasBle: true,
  hasBluetooth: false,
  cores: 2,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf',
  notes: [
    'No ADC2/Wi-Fi conflict — the S3 redesigned the ADC/Wi-Fi arbitration.',
    'GPIO19/20 are USB Serial/JTAG D−/D+. Do not use as GPIO while USB is connected.',
    'GPIO0 is a strapping pin (HIGH = normal boot, LOW = download mode).',
    'GPIO3/45/46 are strapping pins — avoid driving them at boot.',
    'No DAC on the S3.',
  ],
  module: {
    name: 'ESP32-S3-WROOM-1',
    form: 'wroom',
    arch: 'Dual-core Xtensa LX7',
    pcb: 'black',
    accent: '#22c55e',
    radios: 'Wi-Fi 4 · BLE 5',
  },
  packageLayout: ESP32S3_LAYOUT,
  pins: ESP32S3_PINS,
}
