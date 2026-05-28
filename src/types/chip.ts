export type Severity = 'danger' | 'warning' | 'info'

export type Capability =
  | 'adc1' | 'adc2' | 'dac' | 'touch'
  | 'pwm' | 'i2c' | 'spi' | 'uart' | 'i2s'
  | 'rtc' | 'input_only' | 'usb' | 'jtag'
  | 'gpio'

export type ConstraintId =
  | 'adc2_no_wifi'
  | 'input_only'
  | 'strapping_pin'
  | 'flash_reserved'
  | 'boot_must_float'
  | 'boot_must_high'
  | 'boot_must_low'
  | 'usb_jtag'
  | 'limited_current'
  | 'no_pullup'

export interface Constraint {
  id: ConstraintId
  severity: Severity
  title: string
  description: string
}

export interface Pin {
  gpio: number
  names: string[]            // e.g. ['GPIO4', 'ADC2_CH0', 'TOUCH0']
  capabilities: Capability[]
  constraints: Constraint[]
  isUsable: boolean          // false = never use (flash-reserved etc)
  notes?: string
}

export interface Chip {
  id: string                 // e.g. 'esp32', 'esp32s3'
  name: string               // e.g. 'ESP32 (WROOM/WROVER)'
  family: string             // e.g. 'ESP32', 'ESP32-S3'
  totalGpio: number
  hasWifi: boolean
  hasBle: boolean
  hasBluetooth: boolean      // classic BT (not just BLE)
  cores: number
  datasheetUrl: string
  notes: string[]            // chip-level gotchas
  pins: Pin[]
}

export type MappingRole =
  | 'LED' | 'Button' | 'I2C_SDA' | 'I2C_SCL'
  | 'SPI_MOSI' | 'SPI_MISO' | 'SPI_SCK' | 'SPI_CS'
  | 'UART_TX' | 'UART_RX' | 'PWM' | 'ADC' | 'DAC'
  | 'Touch' | 'Custom'

export type FilterKey =
  | 'all'
  | 'safe_output'            // not input_only, not flash_reserved
  | 'adc_wifi_safe'          // adc1 only (no adc2)
  | 'pwm'
  | 'free'                   // no constraints at all
  | 'strapping'              // is a strapping pin
  | 'touch'
