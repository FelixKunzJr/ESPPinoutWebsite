import type { Chip } from '../../types/chip'

const USB_JTAG = {
  id: 'usb_jtag' as const, severity: 'warning' as const,
  title: 'Native USB / JTAG',
  description: 'GPIO19 (D−) and GPIO20 (D+) are wired to the internal USB Serial/JTAG controller. Using them as GPIO breaks USB debugging.',
}

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
    'No ADC2-WiFi conflict — S3 redesigned the ADC/WiFi arbitration.',
    'GPIO19/20 are USB Serial/JTAG D−/D+. Do not use as GPIO when USB is connected.',
    'GPIO0 is strapping pin (HIGH = normal boot, LOW = download mode).',
    'GPIO45/46 are strapping pins — avoid driving at boot.',
    'GPIO3, 4, 5, 6 are strapping-related on some modules.',
    'No DAC on S3.',
  ],
  pins: [
    { gpio: 0, names: ['GPIO0'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin', description: 'HIGH = boot from flash, LOW = download mode.' }], isUsable: true },
    ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(n => ({
      gpio: n, names: [`GPIO${n}`, `ADC1_CH${n-1}`], capabilities: ['gpio','adc1','pwm'] as ('gpio'|'adc1'|'pwm')[], constraints: [], isUsable: true,
    })),
    { gpio: 19, names: ['GPIO19','USB_D-'],  capabilities: ['gpio','usb','pwm'], constraints: [USB_JTAG], isUsable: true },
    { gpio: 20, names: ['GPIO20','USB_D+'],  capabilities: ['gpio','usb','pwm'], constraints: [USB_JTAG], isUsable: true },
    ...[21,26,33,34,35,36,37,38,39,40,41,42].map(n => ({
      gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true,
    })),
    { gpio: 43, names: ['GPIO43','U0TXD'],   capabilities: ['gpio','uart','pwm'], constraints: [], isUsable: true },
    { gpio: 44, names: ['GPIO44','U0RXD'],   capabilities: ['gpio','uart','pwm'], constraints: [], isUsable: true },
    { gpio: 45, names: ['GPIO45'], capabilities: ['gpio','pwm'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin', description: 'Sampled at boot. Keep floating or HIGH for normal operation.' }], isUsable: true },
    { gpio: 46, names: ['GPIO46'], capabilities: ['gpio'],
      constraints: [{ id: 'strapping_pin', severity: 'warning', title: 'Strapping pin / input priority', description: 'Sampled at boot. Also input-only on some sub-variants.' }], isUsable: true },
    ...[47,48].map(n => ({
      gpio: n, names: [`GPIO${n}`], capabilities: ['gpio','pwm'] as ('gpio'|'pwm')[], constraints: [], isUsable: true,
    })),
  ],
}
