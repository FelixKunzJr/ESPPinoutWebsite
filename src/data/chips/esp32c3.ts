import type { Chip } from '../../types/chip'

const USB_JTAG_C3 = {
  id: 'usb_jtag' as const, severity: 'warning' as const,
  title: 'USB Serial/JTAG',
  description: 'GPIO18 (D−) and GPIO19 (D+) are the internal USB Serial/JTAG interface. Avoid using as GPIO when USB is connected.',
}

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
    'No ADC2 (all ADC channels are ADC1) — no ADC/WiFi conflict.',
    'GPIO18/19 are USB Serial/JTAG D−/D+.',
    'GPIO2, 8, 9 are strapping pins.',
    'GPIO11 is connected to VDD_SPI on some modules — avoid.',
    'No touch sensor, no DAC.',
  ],
  pins: [
    ...[0,1,2,3,4,5].map(n => ({
      gpio: n, names: [`GPIO${n}`, `ADC1_CH${n}`], capabilities: ['gpio','adc1','pwm'] as ('gpio'|'adc1'|'pwm')[],
      constraints: n === 2 ? [{ id: 'strapping_pin' as const, severity: 'warning' as const, title: 'Strapping pin', description: 'Sampled at boot to configure chip behavior. Keep floating or at default level during reset.' }] : [],
      isUsable: true,
    })),
    ...[6,7].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    { gpio: 8, names: ['GPIO8'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin', description: 'Must be HIGH at boot for normal operation on some modules.' }], isUsable: true },
    { gpio: 9, names: ['GPIO9'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin / boot button', description: 'Pulled HIGH internally. LOW at boot = download mode. This is the BOOT button on most dev boards.' }], isUsable: true },
    { gpio: 10, names: ['GPIO10'], capabilities: ['gpio','pwm'], constraints: [], isUsable: true },
    { gpio: 11, names: ['GPIO11','VDD_SPI'], capabilities: ['gpio'],
      constraints: [{ id: 'flash_reserved', severity: 'danger', title: 'VDD_SPI / possibly flash', description: 'On modules with external flash, GPIO11 may be connected to the flash VDD rail. Do not use without checking your module schematic.' }], isUsable: false },
    ...[12,13,14,15,16,17].map(n => ({ gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true })),
    { gpio: 18, names: ['GPIO18','USB_D-'], capabilities: ['gpio','usb'], constraints: [USB_JTAG_C3], isUsable: true },
    { gpio: 19, names: ['GPIO19','USB_D+'], capabilities: ['gpio','usb'], constraints: [USB_JTAG_C3], isUsable: true },
    { gpio: 20, names: ['GPIO20','U0RXD'], capabilities: ['gpio','uart','pwm'], constraints: [], isUsable: true },
    { gpio: 21, names: ['GPIO21','U0TXD'], capabilities: ['gpio','uart','pwm'], constraints: [], isUsable: true },
  ],
}
