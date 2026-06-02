import type { Chip } from '../../types/chip'
import { WROOM32_LAYOUT, ESP32_BASE_PINS } from './esp32'

const PSRAM_RESERVED = {
  id: 'psram_reserved' as const,
  severity: 'danger' as const,
  title: 'Reserved for PSRAM',
  description: 'GPIO16 and GPIO17 are connected to the on-board PSRAM module on ESP-WROVER variants. They cannot be used for any other purpose.',
}

const WROVER_LAYOUT = {
  ...WROOM32_LAYOUT,
  name: 'ESP-WROVER-32',
}

export const esp32wrover: Chip = {
  id: 'esp32wrover',
  name: 'ESP32-WROVER-E',
  family: 'ESP32',
  totalGpio: 32,
  hasWifi: true,
  hasBle: true,
  hasBluetooth: true,
  cores: 2,
  datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-wrover_datasheet_en.pdf',
  notes: [
    'GPIO16 and GPIO17 are used for PSRAM — do not use them in user code.',
    'ADC2 (GPIO0,2,4,12–15,25–27) cannot be used while WiFi is active.',
    'GPIO6–11 are connected to internal SPI flash — never use them.',
    'GPIO34, 35, 36, 39 are input-only (no output, no pull-up/down).',
    'GPIO0 must be HIGH (or floating) at boot to boot from flash.',
    'GPIO12 must be LOW at boot for 3.3 V flash.',
  ],
  packageLayout: WROVER_LAYOUT,
  module: {
    name: 'ESP32-WROVER-E',
    form: 'wrover',
    arch: 'Dual-core Xtensa LX6 · 8 MB PSRAM',
    pcb: 'black',
    accent: '#6366f1',
    radios: 'Wi-Fi 4 · BT · BLE',
  },
  pins: ESP32_BASE_PINS.map(pin => {
    if (pin.gpio === 16 || pin.gpio === 17) {
      return { ...pin, constraints: [PSRAM_RESERVED], isUsable: false }
    }
    return pin
  }),
}
