import type { Chip } from '../../types/chip'

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
    'No WiFi — BLE 5.3 + IEEE 802.15.4 (Zigbee/Thread/Matter) only.',
    'No ADC/WiFi conflict (no WiFi).',
    'GPIO8, 9 are strapping pins.',
    'GPIO15–20 connected to internal SPI flash — do not use.',
    'GPIO26/27 are USB Serial/JTAG.',
    'No DAC, no capacitive touch.',
  ],
  pins: [
    ...[0,1,2,3,4,5].map(n => ({
      gpio: n, names: [`GPIO${n}`, `ADC1_CH${n}`], capabilities: ['gpio','adc1','pwm'] as ('gpio'|'adc1'|'pwm')[], constraints: [], isUsable: true,
    })),
    ...[6,7].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    { gpio: 8, names: ['GPIO8'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin', description: 'Sampled at boot to configure chip behavior. Keep floating or at default level during reset.' }], isUsable: true },
    { gpio: 9, names: ['GPIO9'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin / boot button', description: 'LOW at boot = download mode.' }], isUsable: true },
    ...[10,11,12,13,14].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    ...[15,16,17,18,19,20].map(n => ({
      gpio: n, names: [`GPIO${n}`], capabilities: [] as ('gpio'|'pwm')[],
      constraints: [{ id: 'flash_reserved' as const, severity: 'danger' as const, title: 'Reserved for flash', description: 'Connected to internal SPI flash. Do not use.' }],
      isUsable: false,
    })),
    ...[21,22,23,24,25].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    { gpio: 26, names: ['GPIO26','USB_D-'], capabilities: ['gpio','usb'],
      constraints: [{ id: 'usb_jtag', severity: 'warning', title: 'USB Serial/JTAG D−', description: 'Internal USB debug interface.' }], isUsable: true },
    { gpio: 27, names: ['GPIO27','USB_D+'], capabilities: ['gpio','usb'],
      constraints: [{ id: 'usb_jtag', severity: 'warning', title: 'USB Serial/JTAG D+', description: 'Internal USB debug interface.' }], isUsable: true },
  ],
}
