import type { Chip } from '../../types/chip'

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
    'RISC-V. Supports WiFi 6 (802.11ax), BLE 5, IEEE 802.15.4 (Zigbee/Thread).',
    'No ADC2 — no ADC/WiFi conflict.',
    'GPIO8, 9 are strapping pins.',
    'GPIO12–17 connected to internal SPI flash — do not use.',
    'GPIO24/25 are USB Serial/JTAG D−/D+.',
    'No DAC, no capacitive touch.',
  ],
  pins: [
    ...[0,1,2,3,4,5,6,7].map(n => ({
      gpio: n, names: [`GPIO${n}`, ...(n < 6 ? [`ADC1_CH${n}`] : [])],
      capabilities: (n < 6 ? ['gpio','adc1','pwm'] : ['gpio','pwm']) as ('gpio'|'adc1'|'pwm')[],
      constraints: [], isUsable: true,
    })),
    { gpio: 8, names: ['GPIO8'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin', description: 'Sampled at boot to configure chip behavior. Keep floating or at default level during reset.' }], isUsable: true },
    { gpio: 9, names: ['GPIO9'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin / boot button', description: 'LOW at boot = download mode (BOOT button on dev boards).' }], isUsable: true },
    ...[10,11].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    ...[12,13,14,15,16,17].map(n => ({
      gpio: n, names: [`GPIO${n}`], capabilities: [] as ('gpio'|'pwm')[],
      constraints: [{ id: 'flash_reserved' as const, severity: 'danger' as const, title: 'Reserved for flash', description: 'Connected to internal SPI flash. Do not use.' }],
      isUsable: false,
    })),
    ...[18,19,20,21,22,23].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    { gpio: 24, names: ['GPIO24','USB_D-'], capabilities: ['gpio','usb'],
      constraints: [{ id: 'usb_jtag', severity: 'warning', title: 'USB Serial/JTAG D−', description: 'Internal USB debug interface.' }], isUsable: true },
    { gpio: 25, names: ['GPIO25','USB_D+'], capabilities: ['gpio','usb'],
      constraints: [{ id: 'usb_jtag', severity: 'warning', title: 'USB Serial/JTAG D+', description: 'Internal USB debug interface.' }], isUsable: true },
    ...[26,27,28,29,30].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
  ],
}
