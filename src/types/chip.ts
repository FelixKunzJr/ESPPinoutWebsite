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
  | 'psram_reserved'
  | 'ospi_reserved'
  | 'boot_must_float'
  | 'boot_must_high'
  | 'boot_must_low'
  | 'usb_jtag'
  | 'serial_console'
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

// Physical module identity - drives the realistic on-screen module rendering.
// Different ESP families ship in visually distinct modules:
//   'wroom'  → rectangular metal can, full-width meander PCB antenna (WROOM-32, S2/S3-WROOM-1)
//   'wrover' → same width but taller, black PCB, extra PSRAM (WROVER)
//   'mini'   → small module, antenna on a notched keep-out tab off the top corner (C3/C6/H2-MINI-1)
export type ModuleForm = 'wroom' | 'wrover' | 'mini' | 'board'

export interface ModuleInfo {
  name: string               // silkscreen label, e.g. 'ESP32-S3-WROOM-1'
  form: ModuleForm           // physical family → shape + antenna treatment
  arch: string               // e.g. 'Dual-core Xtensa LX6', 'Single-core RISC-V'
  pcb: 'green' | 'black'     // PCB substrate color
  accent: string             // hex accent matching the family (selector colors)
  radios: string             // accurate radio markings, e.g. 'Wi-Fi 4 · BT · BLE'
  // Board appearance hints (form 'board' only):
  usbEdge?: 'top' | 'bottom' // where the USB connector sits (default bottom)
  bare?: boolean             // bare chip + ceramic antenna instead of a shielded module
  aspect?: number            // board width / height ratio for realistic proportions
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
  packageLayout?: PackageLayout
  symbolLayout?: SymbolLayout // official KiCad schematic symbol pin placement
  module?: ModuleInfo        // physical module appearance
}

export type MappingRole =
  | 'LED' | 'Button' | 'I2C_SDA' | 'I2C_SCL'
  | 'SPI_MOSI' | 'SPI_MISO' | 'SPI_SCK' | 'SPI_CS'
  | 'UART_TX' | 'UART_RX' | 'PWM' | 'ADC' | 'DAC'
  | 'Touch' | 'Custom'

export interface PinAssignment {
  gpio: number
  role: MappingRole
  label: string
}

// Physical package layout - maps castellated pads to GPIO / special names
export interface LayoutPin {
  pinNumber: number     // physical pad number (e.g. 1-38 on WROOM-32)
  gpio?: number         // present for GPIO pads
  label?: string        // 'GND' | '3V3' | 'EN' | 'NC' for non-GPIO pads
  isSurfacePad?: boolean // true = SMD pad on the front/top surface of the PCB
  isBacksidePad?: boolean // true = SMD pad on the underside/back of the PCB
}

// Schematic symbol geometry, extracted from Espressif's official KiCad symbol:
// each entry is one drawn pin (stacked duplicate power pins merged into `pins`),
// per body side, in the symbol's own top→bottom / left→right order.
export interface SymbolPin {
  pins: number[]        // physical pad number(s) this symbol pin carries
  gpio?: number
  label?: string        // 'GND' | '3V3' | 'EN' | 'NC' | ... for non-GPIO pins
  name?: string         // verbatim pin name from the Espressif symbol, e.g. 'SENSOR_VP/GPIO36'
}

export interface SymbolLayout {
  left: SymbolPin[]
  right: SymbolPin[]
  bottom?: SymbolPin[]
  top?: SymbolPin[]
}

export interface PackageLayout {
  name: string          // e.g. 'ESP-WROOM-32'
  left:   LayoutPin[]   // top → bottom
  right:  LayoutPin[]   // top → bottom (pin 38 first for WROOM-32)
  bottom: LayoutPin[]   // left → right
  top?:   LayoutPin[]   // left → right (MINI modules have a GND ring on the top edge too)
  leftRailHoles?: number  // limit count of edge through-holes to render on left rail
  rightRailHoles?: number // limit count of edge through-holes to render on right rail
  bodyMm?: { w: number; h: number } // physical outline in mm (from the KiCad footprint courtyard) - drives true rendered proportions
}

// Add packageLayout?: PackageLayout to Chip (optional; falls back to 50/50 split)

export type FilterKey =
  | 'all'
  | 'safe_output'            // not input_only, not flash_reserved
  | 'adc_wifi_safe'          // adc1 only (no adc2)
  | 'pwm'
  | 'free'                   // no constraints at all
  | 'strapping'              // is a strapping pin
  | 'touch'
