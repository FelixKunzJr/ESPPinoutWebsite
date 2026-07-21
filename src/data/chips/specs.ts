// Datasheet-sourced chip specs, keyed by family. Figures verified against
// Espressif's official datasheets (documentation.espressif.com).
export interface ChipSpecs {
  cores: number
  arch: string
  cpuMaxMhz: number
  sramKb: number
  romKb: number
  flash?: string     // typical + SKU note
  psram?: string
  notable?: string[]
}

export const FAMILY_SPECS: Record<string, ChipSpecs> = {
  'ESP32': {
    cores: 2, arch: 'Dual-core Xtensa LX6', cpuMaxMhz: 240, sramKb: 520, romKb: 448,
    flash: '4 MB typical; SKUs up to 16 MB', psram: 'None on WROOM; up to 8 MB on WROVER',
    notable: ['Ethernet MAC (RMII)', '10 touch channels', '2x DAC'],
  },
  'ESP32-S2': {
    cores: 1, arch: 'Single-core Xtensa LX7', cpuMaxMhz: 240, sramKb: 320, romKb: 128,
    flash: 'Up to 4 MB (module SKU)', psram: 'Up to 2 MB (module SKU)',
    notable: ['Native USB-OTG', '14 touch channels', '2x DAC'],
  },
  'ESP32-S3': {
    cores: 2, arch: 'Dual-core Xtensa LX7', cpuMaxMhz: 240, sramKb: 512, romKb: 384,
    flash: 'Up to 16 MB (module SKU)', psram: 'Up to 8 MB (module SKU)',
    notable: ['Native USB-OTG', 'AI vector instructions', '14 touch channels'],
  },
  'ESP32-C3': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 160, sramKb: 400, romKb: 384,
    flash: 'Up to 4 MB (module SKU)', psram: 'None',
    notable: ['USB Serial/JTAG'],
  },
  'ESP32-C6': {
    cores: 1, arch: 'Single-core RISC-V (HP) + LP core', cpuMaxMhz: 160, sramKb: 512, romKb: 320,
    flash: 'Up to 8 MB (module SKU)', psram: 'None',
    notable: ['Wi-Fi 6', '802.15.4 (Zigbee/Thread)', 'USB Serial/JTAG'],
  },
  'ESP32-C5': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 240, sramKb: 384, romKb: 320,
    flash: 'Up to 8 MB (module SKU)', psram: 'None',
    notable: ['Dual-band Wi-Fi 6 (2.4 + 5 GHz)', '802.15.4', 'USB Serial/JTAG'],
  },
  'ESP32-C2': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 120, sramKb: 272, romKb: 576,
    flash: '2 or 4 MB in-package', psram: 'None',
    notable: ['Sold as ESP8684', '14 GPIOs', 'No native USB - UART0 only'],
  },
  'ESP32-H2': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 96, sramKb: 320, romKb: 128,
    flash: 'Up to 4 MB (module SKU)', psram: 'None',
    notable: ['No Wi-Fi', '802.15.4 + BLE 5 (Zigbee/Thread/Matter)'],
  },
}

// Per-module SKU overrides where flash/PSRAM differ from the family default.
export const SKU_OVERRIDES: Record<string, { flash?: string; psram?: string }> = {
  esp32wrover: { psram: '8 MB PSRAM (WROVER-E)' },
  esp32pico: { flash: '4 MB in-package (PICO-MINI-02)' },
  esp32s2wrover: { psram: '2 MB PSRAM' },
  esp32s3wroom2: { flash: '16 MB', psram: '8 MB Octal PSRAM' },
}
