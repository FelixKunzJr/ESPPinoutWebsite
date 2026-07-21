// AUTO-GENERATED from Espressif's official KiCad libraries (symbols + footprints).
// Do NOT edit by hand - run: KICAD_LIB=./kicad-libraries node scripts/generate-chip-data.mjs
// Pin names and physical pad layout are authoritative (datasheet-equivalent).
import type { Capability, Pin, PackageLayout, SymbolLayout } from '../../types/chip'

const INPUT_ONLY = { id: 'input_only' as const, severity: 'warning' as const, title: 'Input only', description: 'This pin has no output driver or internal pull resistors. Use only as a digital/analog input.' }
const STRAP = { id: 'strapping_pin' as const, severity: 'warning' as const, title: 'Strapping pin', description: 'Sampled at boot to set boot mode / configuration. Avoid driving it at reset unless you know the required level.' }
const ADC2_WIFI = { id: 'adc2_no_wifi' as const, severity: 'warning' as const, title: 'ADC2 unusable with Wi-Fi', description: 'ADC2 is claimed by the Wi-Fi driver; analogRead() on this pin fails while Wi-Fi is active. Prefer ADC1 pins.' }
const USB = { id: 'usb_jtag' as const, severity: 'warning' as const, title: 'USB / Serial-JTAG', description: 'Part of the native USB (Serial/JTAG) interface. Avoid repurposing while USB is in use.' }
const FLASH = { id: 'flash_reserved' as const, severity: 'danger' as const, title: 'Reserved for flash', description: 'Wired to the SPI flash of the module. Using it for anything else will crash the chip.' }
const OSPI = { id: 'ospi_reserved' as const, severity: 'warning' as const, title: 'OSPI PSRAM', description: 'On modules with Octal SPI PSRAM (ESP32-S3R8 / R16V based, e.g. N8R8/N16R8 variants), IO35, IO36 and IO37 are connected to the PSRAM and are not available for other uses. Free on quad-PSRAM and no-PSRAM variants.' }

export const ESP32_WROOM_32_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN/CHIP_PU" }, { pins: [8], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [9], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [14], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [16], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [13], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [23], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [6], gpio: 34, name: "GPIO34/ADC1_CH6" }, { pins: [7], gpio: 35, name: "GPIO35/ADC1_CH7" }, { pins: [4], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [5], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }],
  right: [{ pins: [35], gpio: 1, name: "U0TXD/GPIO1" }, { pins: [34], gpio: 3, name: "U0RXD/GPIO3" }, { pins: [25], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [24], gpio: 2, name: "ADC2_CH2/GPIO2" }, { pins: [26], gpio: 4, name: "ADC2_CH0/GPIO4" }, { pins: [29], gpio: 5, name: "GPIO5" }, { pins: [27], gpio: 16, name: "GPIO16" }, { pins: [28], gpio: 17, name: "GPIO17" }, { pins: [30], gpio: 18, name: "GPIO18" }, { pins: [31], gpio: 19, name: "GPIO19" }, { pins: [33], gpio: 21, name: "GPIO21" }, { pins: [36], gpio: 22, name: "GPIO22" }, { pins: [37], gpio: 23, name: "GPIO23" }, { pins: [10], gpio: 25, name: "DAC_1/ADC2_CH8/GPIO25" }, { pins: [11], gpio: 26, name: "DAC_2/ADC2_CH9/GPIO26" }, { pins: [12], gpio: 27, name: "ADC2_CH7/GPIO27" }],
  bottom: [{ pins: [1,15,38], label: 'GND', name: "GND" }, { pins: [39], label: 'GND', name: "GND_THERMAL" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const ESP32_WROVER_E_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN/CHIP_PU" }, { pins: [8], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [9], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [14], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [16], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [13], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [23], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [6], gpio: 34, name: "GPIO34/ADC1_CH6" }, { pins: [7], gpio: 35, name: "GPIO35/ADC1_CH7" }, { pins: [4], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [5], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }],
  right: [{ pins: [35], gpio: 1, name: "U0TXD/GPIO1" }, { pins: [34], gpio: 3, name: "U0RXD/GPIO3" }, { pins: [25], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [24], gpio: 2, name: "ADC2_CH2/GPIO2" }, { pins: [26], gpio: 4, name: "ADC2_CH0/GPIO4" }, { pins: [29], gpio: 5, name: "GPIO5" }, { pins: [30], gpio: 18, name: "GPIO18" }, { pins: [31], gpio: 19, name: "GPIO19" }, { pins: [33], gpio: 21, name: "GPIO21" }, { pins: [36], gpio: 22, name: "GPIO22" }, { pins: [37], gpio: 23, name: "GPIO23" }, { pins: [10], gpio: 25, name: "DAC_1/ADC2_CH8/GPIO25" }, { pins: [11], gpio: 26, name: "DAC_2/ADC2_CH9/GPIO26" }, { pins: [12], gpio: 27, name: "ADC2_CH7/GPIO27" }],
  bottom: [{ pins: [1,15,38], label: 'GND', name: "GND" }, { pins: [39], label: 'GND', name: "GND_THERMAL" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const ESP32_WROOM_DA_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 1, names: ["GPIO1","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 12, names: ["GPIO12","MTDI","ADC2_CH5"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","MTCK","ADC2_CH4","TOUCH4"], capabilities: ["gpio","adc2","touch","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","MTMS","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","MTDO","ADC2_CH3","TOUCH3"], capabilities: ["gpio","adc2","touch","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","DAC_2","ADC2_CH9"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 27, names: ["GPIO27","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 32, names: ["GPIO32","32K_XP","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","32K_XN","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","ADC1_CH6"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 35, names: ["GPIO35","ADC1_CH7"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 36, names: ["GPIO36","SENSOR_VP","ADC1_CH0"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 39, names: ["GPIO39","SENSOR_VN","ADC1_CH3"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
]

export const ESP32_WROOM_DA_LAYOUT: PackageLayout = {
  name: 'ESP32-WROOM-DA',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 36 }, { pinNumber: 5, gpio: 39 }, { pinNumber: 6, gpio: 34 }, { pinNumber: 7, gpio: 35 }, { pinNumber: 8, gpio: 32 }, { pinNumber: 9, gpio: 33 }, { pinNumber: 10, label: 'NC' }, { pinNumber: 11, gpio: 26 }, { pinNumber: 12, gpio: 27 }, { pinNumber: 13, gpio: 14 }, { pinNumber: 14, gpio: 12 }],
  bottom: [{ pinNumber: 15, label: 'NC' }, { pinNumber: 16, label: 'GND' }, { pinNumber: 17, gpio: 13 }, { pinNumber: 18, label: 'NC' }, { pinNumber: 19, label: 'NC' }, { pinNumber: 20, label: 'NC' }, { pinNumber: 21, label: 'NC' }, { pinNumber: 22, label: 'NC' }, { pinNumber: 23, label: 'NC' }, { pinNumber: 24, gpio: 15 }, { pinNumber: 25, label: 'NC' }, { pinNumber: 26, label: 'NC' }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, gpio: 23 }, { pinNumber: 38, gpio: 22 }, { pinNumber: 37, gpio: 1 }, { pinNumber: 36, gpio: 3 }, { pinNumber: 35, gpio: 21 }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, gpio: 19 }, { pinNumber: 32, gpio: 18 }, { pinNumber: 31, gpio: 5 }, { pinNumber: 30, gpio: 17 }, { pinNumber: 29, gpio: 16 }, { pinNumber: 28, gpio: 4 }, { pinNumber: 27, gpio: 0 }],
  bodyMm: { w: 18, h: 31.4 },
  antennaMm: 12.56,
}

export const ESP32_WROOM_DA_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN/CHIP_PU" }, { pins: [8], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [9], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [14], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [17], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4/TOUCH4" }, { pins: [13], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [24], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3/TOUCH3" }, { pins: [6], gpio: 34, name: "GPIO34/ADC1_CH6" }, { pins: [7], gpio: 35, name: "GPIO35/ADC1_CH7" }, { pins: [4], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [5], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }],
  right: [{ pins: [37], gpio: 1, name: "GPIO1/U0TXD" }, { pins: [36], gpio: 3, name: "GPIO3/U0RXD" }, { pins: [27], gpio: 0, name: "GPIO0/ADC2_CH1" }, { pins: [28], gpio: 4, name: "GPIO4/ADC2_CH0" }, { pins: [31], gpio: 5, name: "GPIO5" }, { pins: [29], gpio: 16, name: "GPIO16" }, { pins: [30], gpio: 17, name: "GPIO17" }, { pins: [32], gpio: 18, name: "GPIO18" }, { pins: [33], gpio: 19, name: "GPIO19" }, { pins: [35], gpio: 21, name: "GPIO21" }, { pins: [38], gpio: 22, name: "GPIO22" }, { pins: [39], gpio: 23, name: "GPIO23" }, { pins: [11], gpio: 26, name: "DAC_2/ADC2_CH9/GPIO26" }, { pins: [12], gpio: 27, name: "ADC2_CH7/GPIO27" }],
  bottom: [{ pins: [1,16,40,43], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const ESP32_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 1, names: ["GPIO1","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 3, names: ["GPIO3","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9","SD_DATA2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","SD_DATA3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","MTDI","ADC2_CH5"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","MTCK","ADC2_CH4"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","MTMS","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","MTDO","ADC2_CH3"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25","ADC2_CH8","DAC_1"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 26, names: ["GPIO26","ADC2_CH9","DAC_2"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 27, names: ["GPIO27","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 32, names: ["GPIO32","32K_XP","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","32K_XN","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","VDET_1","ADC1_CH6"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 35, names: ["GPIO35","VDET_2","ADC1_CH7"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 36, names: ["GPIO36","SENSOR_VP","ADC1_CH0"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 37, names: ["GPIO37","SENSOR_CAPP","ADC1_CH1"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 38, names: ["GPIO38","SENSOR_CAPN","ADC1_CH2"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 39, names: ["GPIO39","SENSOR_VN","ADC1_CH3"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
]

export const ESP32_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-MINI-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 36 }, { pinNumber: 5, gpio: 37 }, { pinNumber: 6, gpio: 38 }, { pinNumber: 7, gpio: 39 }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 34 }, { pinNumber: 10, gpio: 35 }, { pinNumber: 11, gpio: 32 }, { pinNumber: 12, gpio: 33 }, { pinNumber: 13, gpio: 25 }],
  bottom: [{ pinNumber: 14, gpio: 26 }, { pinNumber: 15, gpio: 27 }, { pinNumber: 16, gpio: 14 }, { pinNumber: 17, gpio: 12 }, { pinNumber: 18, gpio: 13 }, { pinNumber: 19, gpio: 15 }, { pinNumber: 20, gpio: 2 }, { pinNumber: 21, gpio: 0 }, { pinNumber: 22, gpio: 4 }, { pinNumber: 23, label: 'NC' }, { pinNumber: 24, label: 'NC' }, { pinNumber: 25, gpio: 9 }, { pinNumber: 26, gpio: 10 }, { pinNumber: 27, label: 'GND' }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'NC' }, { pinNumber: 36, gpio: 1 }, { pinNumber: 35, gpio: 3 }, { pinNumber: 34, gpio: 21 }, { pinNumber: 33, gpio: 22 }, { pinNumber: 32, gpio: 19 }, { pinNumber: 31, gpio: 23 }, { pinNumber: 30, gpio: 18 }, { pinNumber: 29, gpio: 5 }, { pinNumber: 28, label: 'NC' }],
  top: [{ pinNumber: 54, label: 'GND' }, { pinNumber: 53, label: 'GND' }, { pinNumber: 52, label: 'GND' }, { pinNumber: 51, label: 'GND' }, { pinNumber: 50, label: 'GND' }, { pinNumber: 49, label: 'GND' }, { pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }],
  bodyMm: { w: 13.8, h: 19.6 },
  antennaMm: 6.45,
}

export const ESP32_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [8], label: 'EN', name: "EN/CHIP_PU" }, { pins: [11], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [12], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [17], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [18], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [16], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [19], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [9], gpio: 34, name: "VDET_1/GPIO34/ADC1_CH6" }, { pins: [10], gpio: 35, name: "VDET_2/GPIO35/ADC1_CH7" }, { pins: [4], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [5], gpio: 37, name: "SENSOR_CAPP/GPIO37/ADC1_CH1" }, { pins: [6], gpio: 38, name: "SENSOR_CAPN/GPIO38/ADC1_CH2" }, { pins: [7], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }, { pins: [23], label: 'NC', name: "NC" }, { pins: [24], label: 'NC', name: "NC" }, { pins: [28], label: 'NC', name: "NC" }, { pins: [37], label: 'NC', name: "NC" }],
  right: [{ pins: [36], gpio: 1, name: "U0TXD/GPIO1" }, { pins: [35], gpio: 3, name: "U0RXD/GPIO3" }, { pins: [21], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [20], gpio: 2, name: "GPIO2/ADC2_CH2" }, { pins: [22], gpio: 4, name: "GPIO4/ADC2_CH0" }, { pins: [29], gpio: 5, name: "GPIO5" }, { pins: [30], gpio: 18, name: "GPIO18" }, { pins: [32], gpio: 19, name: "GPIO19" }, { pins: [34], gpio: 21, name: "GPIO21" }, { pins: [33], gpio: 22, name: "GPIO22" }, { pins: [31], gpio: 23, name: "GPIO23" }, { pins: [13], gpio: 25, name: "GPIO25/ADC2_CH8/DAC_1" }, { pins: [14], gpio: 26, name: "GPIO26/ADC2_CH9/DAC_2" }, { pins: [15], gpio: 27, name: "GPIO27/ADC2_CH7" }, { pins: [26], gpio: 10, name: "SD_DATA3/GPIO10" }, { pins: [25], gpio: 9, name: "SD_DATA2/GPIO9" }],
  bottom: [{ pins: [1,2,27,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const ESP32_PICO_MINI_02_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 1, names: ["GPIO1","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 3, names: ["GPIO3","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 7, names: ["GPIO7","SD_DATA_0"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 8, names: ["GPIO8","SD_DATA_1"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 12, names: ["GPIO12","MTDI","ADC2_CH5"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","MTCK","ADC2_CH4"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","MTMS","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","MTDO","ADC2_CH3"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25","ADC2_CH8","DAC_1"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 26, names: ["GPIO26","ADC2_CH9","DAC_2"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 27, names: ["GPIO27","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 32, names: ["GPIO32","32K_XP","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","32K_XN","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","VDET_1","ADC1_CH6"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 35, names: ["GPIO35","VDET_2","ADC1_CH7"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 36, names: ["GPIO36","SENSOR_VP","ADC1_CH0"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 37, names: ["GPIO37","SENSOR_CAPP","ADC1_CH1"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 38, names: ["GPIO38","SENSOR_CAPN","ADC1_CH2"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 39, names: ["GPIO39","SENSOR_VN","ADC1_CH3"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
]

export const ESP32_PICO_MINI_02_LAYOUT: PackageLayout = {
  name: 'ESP32-PICO-MINI-02',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 36 }, { pinNumber: 5, gpio: 37 }, { pinNumber: 6, gpio: 38 }, { pinNumber: 7, gpio: 39 }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 34 }, { pinNumber: 10, gpio: 35 }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 32 }, { pinNumber: 13, gpio: 33 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, gpio: 25 }, { pinNumber: 16, gpio: 26 }, { pinNumber: 17, gpio: 27 }, { pinNumber: 18, gpio: 14 }, { pinNumber: 19, gpio: 12 }, { pinNumber: 20, gpio: 13 }, { pinNumber: 21, gpio: 15 }, { pinNumber: 22, gpio: 2 }, { pinNumber: 23, gpio: 0 }, { pinNumber: 24, gpio: 4 }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, gpio: 21 }, { pinNumber: 34, gpio: 22 }, { pinNumber: 33, gpio: 19 }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 1 }, { pinNumber: 30, gpio: 3 }, { pinNumber: 29, gpio: 5 }, { pinNumber: 28, gpio: 8 }, { pinNumber: 27, gpio: 7 }, { pinNumber: 26, gpio: 20 }, { pinNumber: 25, label: 'NC' }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
  bodyMm: { w: 13.6, h: 17 },
  antennaMm: 6.25,
}

export const ESP32_PICO_MINI_02_SYMBOL: SymbolLayout = {
  left: [{ pins: [8], label: 'EN', name: "EN/CHIP_PU" }, { pins: [12], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [13], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [19], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [20], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [18], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [21], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [9], gpio: 34, name: "VDET_1/GPIO34/ADC1_CH6" }, { pins: [10], gpio: 35, name: "VDET_2/GPIO35/ADC1_CH7" }, { pins: [4], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [5], gpio: 37, name: "SENSOR_CAPP/GPIO37/ADC1_CH1" }, { pins: [6], gpio: 38, name: "SENSOR_CAPN/GPIO38/ADC1_CH2" }, { pins: [7], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }, { pins: [25], label: 'NC', name: "NC" }, { pins: [32], label: 'NC', name: "NC" }],
  right: [{ pins: [31], gpio: 1, name: "U0TXD/GPIO1" }, { pins: [30], gpio: 3, name: "U0RXD/GPIO3" }, { pins: [23], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [22], gpio: 2, name: "GPIO2/ADC2_CH2" }, { pins: [24], gpio: 4, name: "GPIO4/ADC2_CH0" }, { pins: [29], gpio: 5, name: "GPIO5" }, { pins: [33], gpio: 19, name: "GPIO19" }, { pins: [26], gpio: 20, name: "GPIO20" }, { pins: [35], gpio: 21, name: "GPIO21" }, { pins: [34], gpio: 22, name: "GPIO22" }, { pins: [15], gpio: 25, name: "GPIO25/ADC2_CH8/DAC_1" }, { pins: [16], gpio: 26, name: "GPIO26/ADC2_CH9/DAC_2" }, { pins: [17], gpio: 27, name: "GPIO27/ADC2_CH7" }, { pins: [28], gpio: 8, name: "SD_DATA_1/GPIO8" }, { pins: [27], gpio: 7, name: "SD_DATA_0/GPIO7" }],
  bottom: [{ pins: [1,2,11,14,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const S2_WROOM_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH0"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH1"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","ADC1_CH6"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","ADC1_CH7"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","ADC1_CH8"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","ADC1_CH9"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 12, names: ["GPIO12","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","ADC2_CH3"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 17, names: ["GPIO17","ADC2_CH6","DAC_1"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18","ADC2_CH7","DAC_2"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D-","ADC2_CH8"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","USB_D+","ADC2_CH9"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","SPI_CS1"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio"] as Capability[], constraints: [INPUT_ONLY, STRAP], isUsable: true },
]

export const S2_WROOM_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-WROOM',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, gpio: 0 }, { pinNumber: 4, gpio: 1 }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, gpio: 4 }, { pinNumber: 8, gpio: 5 }, { pinNumber: 9, gpio: 6 }, { pinNumber: 10, gpio: 7 }, { pinNumber: 11, gpio: 8 }, { pinNumber: 12, gpio: 9 }, { pinNumber: 13, gpio: 10 }, { pinNumber: 14, gpio: 11 }, { pinNumber: 15, gpio: 12 }, { pinNumber: 16, gpio: 13 }],
  bottom: [{ pinNumber: 17, gpio: 14 }, { pinNumber: 18, gpio: 15 }, { pinNumber: 19, gpio: 16 }, { pinNumber: 20, gpio: 17 }, { pinNumber: 21, gpio: 18 }, { pinNumber: 22, gpio: 19 }, { pinNumber: 23, gpio: 20 }, { pinNumber: 24, gpio: 21 }, { pinNumber: 25, gpio: 26 }, { pinNumber: 26, label: 'GND' }],
  right: [{ pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'EN' }, { pinNumber: 40, gpio: 46 }, { pinNumber: 39, gpio: 45 }, { pinNumber: 38, gpio: 44 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 42 }, { pinNumber: 35, gpio: 41 }, { pinNumber: 34, gpio: 40 }, { pinNumber: 33, gpio: 39 }, { pinNumber: 32, gpio: 38 }, { pinNumber: 31, gpio: 37 }, { pinNumber: 30, gpio: 36 }, { pinNumber: 29, gpio: 35 }, { pinNumber: 28, gpio: 34 }, { pinNumber: 27, gpio: 33 }],
  bodyMm: { w: 19.6, h: 32.2 },
  antennaMm: 7.85,
}

export const S2_WROOM_SYMBOL: SymbolLayout = {
  left: [{ pins: [41], label: 'EN', name: "CHIP/PU/RESET" }, { pins: [18], gpio: 15, name: "GPIO15/ADC2_CH4/XTAL_32K_P" }, { pins: [19], gpio: 16, name: "GPIO16/ADC2_CH5/XTAL_32K_N" }, { pins: [33], gpio: 39, name: "MTCK/JTAG/GPIO39" }, { pins: [34], gpio: 40, name: "MTDO/JTAG/GPIO40" }, { pins: [35], gpio: 41, name: "MTDI/JTAG/GPIO41" }, { pins: [36], gpio: 42, name: "MTMS/JTAG/GPIO42" }, { pins: [40], gpio: 46, name: "GPIO46" }, { pins: [25], gpio: 26, name: "SPI_CS1/GPIO26" }],
  right: [{ pins: [38], gpio: 44, name: "GPIO44/U0RXD/PROG" }, { pins: [37], gpio: 43, name: "GPIO43/U0TXD/PROG" }, { pins: [23], gpio: 20, name: "USB_D+/ADC2_CH9/GPIO20" }, { pins: [22], gpio: 19, name: "USB_D-/ADC2_CH8/GPIO19" }, { pins: [3], gpio: 0, name: "GPIO0/BOOT" }, { pins: [4], gpio: 1, name: "GPIO1/ADC1_CH0" }, { pins: [5], gpio: 2, name: "GPIO2/ADC1_CH1" }, { pins: [6], gpio: 3, name: "GPIO3/ADC1_CH2" }, { pins: [7], gpio: 4, name: "GPIO4/ADC1_CH3" }, { pins: [8], gpio: 5, name: "GPIO5/ADC1_CH4" }, { pins: [9], gpio: 6, name: "GPIO6/ADC1_CH5" }, { pins: [10], gpio: 7, name: "GPIO7/ADC1_CH6" }, { pins: [11], gpio: 8, name: "GPIO8/ADC1_CH7" }, { pins: [12], gpio: 9, name: "GPIO9/ADC1_CH8" }, { pins: [13], gpio: 10, name: "GPIO10/ADC1_CH9" }, { pins: [14], gpio: 11, name: "GPIO11/ADC2_CH0" }, { pins: [15], gpio: 12, name: "GPIO12/ADC2_CH1" }, { pins: [16], gpio: 13, name: "GPIO13/ADC2_CH2" }, { pins: [17], gpio: 14, name: "GPIO14/ADC2_CH3" }, { pins: [20], gpio: 17, name: "ADC2_CH6/DAC_1/GPIO17" }, { pins: [21], gpio: 18, name: "ADC2_CH7/DAC_2/GPIO18" }, { pins: [24], gpio: 21, name: "GPIO21" }, { pins: [27], gpio: 33, name: "GPIO33" }, { pins: [28], gpio: 34, name: "GPIO34" }, { pins: [29], gpio: 35, name: "GPIO35" }, { pins: [30], gpio: 36, name: "GPIO36" }, { pins: [31], gpio: 37, name: "GPIO37" }, { pins: [32], gpio: 38, name: "GPIO38" }, { pins: [39], gpio: 45, name: "GPIO45" }],
  bottom: [{ pins: [1,26,42,43], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const S2_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH0"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH1"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","ADC1_CH6"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","ADC1_CH7"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","ADC1_CH8"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","ADC1_CH9"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 12, names: ["GPIO12","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","ADC2_CH3"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 17, names: ["GPIO17","ADC2_CH6","DAC_1"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18","ADC2_CH7","DAC_2"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D-","ADC2_CH8"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","USB_D+","ADC2_CH9"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","SPI_CS1"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio"] as Capability[], constraints: [INPUT_ONLY, STRAP], isUsable: true },
]

export const S2_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-MINI-1',
  left: [{ pinNumber: 62, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 0 }, { pinNumber: 5, gpio: 1 }, { pinNumber: 6, gpio: 2 }, { pinNumber: 7, gpio: 3 }, { pinNumber: 8, gpio: 4 }, { pinNumber: 9, gpio: 5 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, gpio: 7 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 9 }, { pinNumber: 14, gpio: 10 }, { pinNumber: 15, gpio: 11 }, { pinNumber: 63, label: 'GND' }],
  bottom: [{ pinNumber: 16, gpio: 12 }, { pinNumber: 17, gpio: 13 }, { pinNumber: 18, gpio: 14 }, { pinNumber: 19, gpio: 15 }, { pinNumber: 20, gpio: 16 }, { pinNumber: 21, gpio: 17 }, { pinNumber: 22, gpio: 18 }, { pinNumber: 23, gpio: 19 }, { pinNumber: 24, gpio: 20 }, { pinNumber: 25, gpio: 21 }, { pinNumber: 26, gpio: 26 }, { pinNumber: 27, label: 'NC' }, { pinNumber: 28, gpio: 33 }, { pinNumber: 29, gpio: 34 }, { pinNumber: 30, label: 'GND' }],
  right: [{ pinNumber: 65, label: 'GND' }, { pinNumber: 45, label: 'EN' }, { pinNumber: 44, gpio: 46 }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, gpio: 45 }, { pinNumber: 40, gpio: 44 }, { pinNumber: 39, gpio: 43 }, { pinNumber: 38, gpio: 42 }, { pinNumber: 37, gpio: 41 }, { pinNumber: 36, gpio: 40 }, { pinNumber: 35, gpio: 39 }, { pinNumber: 34, gpio: 38 }, { pinNumber: 33, gpio: 37 }, { pinNumber: 32, gpio: 36 }, { pinNumber: 31, gpio: 35 }, { pinNumber: 64, label: 'GND' }],
  top: [{ pinNumber: 60, label: 'GND' }, { pinNumber: 59, label: 'GND' }, { pinNumber: 58, label: 'GND' }, { pinNumber: 57, label: 'GND' }, { pinNumber: 56, label: 'GND' }, { pinNumber: 55, label: 'GND' }, { pinNumber: 54, label: 'GND' }, { pinNumber: 53, label: 'GND' }, { pinNumber: 52, label: 'GND' }, { pinNumber: 51, label: 'GND' }, { pinNumber: 50, label: 'GND' }, { pinNumber: 49, label: 'GND' }, { pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }],
  bodyMm: { w: 16, h: 20.6 },
  antennaMm: 5.6,
}

export const S2_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [45], label: 'EN', name: "CHIP/PU/RESET" }, { pins: [19], gpio: 15, name: "GPIO15/ADC2_CH4/XTAL_32K_P" }, { pins: [20], gpio: 16, name: "GPIO16/ADC2_CH5/XTAL_32K_N" }, { pins: [35], gpio: 39, name: "MTCK/JTAG/GPIO39" }, { pins: [36], gpio: 40, name: "MTDO/JTAG/GPIO40" }, { pins: [37], gpio: 41, name: "MTDI/JTAG/GPIO41" }, { pins: [38], gpio: 42, name: "MTMS/JTAG/GPIO42" }, { pins: [44], gpio: 46, name: "GPIO46" }, { pins: [26], gpio: 26, name: "SPI_CS1/GPIO26" }, { pins: [27], label: 'NC', name: "NC" }],
  right: [{ pins: [39], gpio: 43, name: "GPIO43/U0TXD/PROG" }, { pins: [40], gpio: 44, name: "GPIO44/U0RXD/PROG" }, { pins: [24], gpio: 20, name: "USB_D+/ADC2_CH9/GPIO20" }, { pins: [23], gpio: 19, name: "USB_D-/ADC2_CH8/GPIO19" }, { pins: [4], gpio: 0, name: "GPIO0/BOOT" }, { pins: [5], gpio: 1, name: "GPIO1/ADC1_CH0" }, { pins: [6], gpio: 2, name: "GPIO2/ADC1_CH1" }, { pins: [7], gpio: 3, name: "GPIO3/ADC1_CH2" }, { pins: [8], gpio: 4, name: "GPIO4/ADC1_CH3" }, { pins: [9], gpio: 5, name: "GPIO5/ADC1_CH4" }, { pins: [10], gpio: 6, name: "GPIO6/ADC1_CH5" }, { pins: [11], gpio: 7, name: "GPIO7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/ADC1_CH7" }, { pins: [13], gpio: 9, name: "GPIO9/ADC1_CH8" }, { pins: [14], gpio: 10, name: "GPIO10/ADC1_CH9" }, { pins: [15], gpio: 11, name: "GPIO11/ADC2_CH0" }, { pins: [16], gpio: 12, name: "GPIO12/ADC2_CH1" }, { pins: [17], gpio: 13, name: "GPIO13/ADC2_CH2" }, { pins: [18], gpio: 14, name: "GPIO14/ADC2_CH3" }, { pins: [21], gpio: 17, name: "ADC2_CH6/DAC_1/GPIO17" }, { pins: [22], gpio: 18, name: "ADC2_CH7/DAC_2/GPIO18" }, { pins: [25], gpio: 21, name: "GPIO21" }, { pins: [28], gpio: 33, name: "GPIO33" }, { pins: [29], gpio: 34, name: "GPIO34" }, { pins: [31], gpio: 35, name: "GPIO35" }, { pins: [32], gpio: 36, name: "GPIO36" }, { pins: [33], gpio: 37, name: "GPIO37" }, { pins: [34], gpio: 38, name: "GPIO38" }, { pins: [41], gpio: 45, name: "GPIO45" }],
  bottom: [{ pins: [1,2,30,42,43,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const S2_SOLO_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","TOUCH1","ADC1_CH0"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","TOUCH2","ADC1_CH1"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","TOUCH3","ADC1_CH2"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","TOUCH4","ADC1_CH3"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","TOUCH5","ADC1_CH4"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","TOUCH6","ADC1_CH5"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","TOUCH7","ADC1_CH6"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","TOUCH8","ADC1_CH7"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","TOUCH9","ADC1_CH8","FSPIHD"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","TOUCH10","ADC1_CH9","FSPICS0","FSPIIO4"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","TOUCH11","ADC2_CH0","FSPID","FSPIIO5"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 12, names: ["GPIO12","TOUCH12","ADC2_CH1","FSPICLK","FSPIIO6"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","TOUCH13","ADC2_CH2","FSPIQ","FSPIIO7"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","TOUCH14","ADC2_CH3","FSPIWP","FSPIDQS"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","U0RTS","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0CTS","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 17, names: ["GPIO17","U1TXD","ADC2_CH6","DAC_1"], capabilities: ["gpio","adc2","dac","pwm","uart"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18","U1RXD","ADC2_CH7","DAC_2","CLK_OUT3"], capabilities: ["gpio","adc2","dac","pwm","uart"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19","U1RTS","ADC2_CH8","CLK_OUT2","USB_D-"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U1CTS","ADC2_CH9","CLK_OUT1","USB_D+"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","SPIIO4","FSPIHD"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","SPIIO5","FSPICS0"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35","SPIIO6","FSPID"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36","SPIIO7","FSPICLK"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37","SPIDQS","FSPIQ"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38","FSPIWP"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","CLK_OUT3"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","CLK_OUT2"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","CLK_OUT1"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","CLK_OUT1"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","CLK_OUT2"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio"] as Capability[], constraints: [INPUT_ONLY, STRAP], isUsable: true },
]

export const S2_SOLO_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-SOLO',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 19 }, { pinNumber: 14, gpio: 20 }],
  bottom: [{ pinNumber: 15, gpio: 3 }, { pinNumber: 16, gpio: 46 }, { pinNumber: 17, gpio: 9 }, { pinNumber: 18, gpio: 10 }, { pinNumber: 19, gpio: 11 }, { pinNumber: 20, gpio: 12 }, { pinNumber: 21, gpio: 13 }, { pinNumber: 22, gpio: 14 }, { pinNumber: 23, gpio: 21 }, { pinNumber: 24, gpio: 33 }, { pinNumber: 25, gpio: 34 }, { pinNumber: 26, gpio: 45 }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, gpio: 1 }, { pinNumber: 38, gpio: 2 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 44 }, { pinNumber: 35, gpio: 42 }, { pinNumber: 34, gpio: 41 }, { pinNumber: 33, gpio: 40 }, { pinNumber: 32, gpio: 39 }, { pinNumber: 31, gpio: 38 }, { pinNumber: 30, gpio: 37 }, { pinNumber: 29, gpio: 36 }, { pinNumber: 28, gpio: 35 }, { pinNumber: 27, gpio: 0 }],
  bodyMm: { w: 19.6, h: 26.6 },
  antennaMm: 7.79,
}

export const S2_SOLO_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN" }, { pins: [8], gpio: 15, name: "GPIO15/U0RTS/ADC2_CH4/XTAL_32K_P" }, { pins: [9], gpio: 16, name: "GPIO16/U0CTS/ADC2_CH5/XTAL_32K_N" }, { pins: [32], gpio: 39, name: "MTCK/GPIO39/CLK_OUT3" }, { pins: [33], gpio: 40, name: "MTDO/GPIO40/CLK_OUT2" }, { pins: [34], gpio: 41, name: "MTDI/GPIO41/CLK_OUT1" }, { pins: [35], gpio: 42, name: "MTMS/GPIO42" }, { pins: [16], gpio: 46, name: "GPIO46" }],
  right: [{ pins: [36], gpio: 44, name: "U0RXD/GPIO44/CLK_OUT2" }, { pins: [37], gpio: 43, name: "U0TXD/GPIO43/CLK_OUT1" }, { pins: [14], gpio: 20, name: "GPIO20/U1CTS/ADC2_CH9/CLK_OUT1/USB_D+" }, { pins: [13], gpio: 19, name: "GPIO19/U1RTS/ADC2_CH8/CLK_OUT2/USB_D-" }, { pins: [27], gpio: 0, name: "GPIO0" }, { pins: [39], gpio: 1, name: "GPIO1/TOUCH1/ADC1_CH0" }, { pins: [38], gpio: 2, name: "GPIO2/TOUCH2/ADC1_CH1" }, { pins: [15], gpio: 3, name: "GPIO3/TOUCH3/ADC1_CH2" }, { pins: [4], gpio: 4, name: "GPIO4/TOUCH4/ADC1_CH3" }, { pins: [5], gpio: 5, name: "GPIO5/TOUCH5/ADC1_CH4" }, { pins: [6], gpio: 6, name: "GPIO6/TOUCH6/ADC1_CH5" }, { pins: [7], gpio: 7, name: "GPIO7/TOUCH7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/TOUCH8/ADC1_CH7" }, { pins: [17], gpio: 9, name: "GPIO9/TOUCH9/ADC1_CH8/FSPIHD" }, { pins: [18], gpio: 10, name: "GPIO10/TOUCH10/ADC1_CH9/FSPICS0/FSPIIO4" }, { pins: [19], gpio: 11, name: "GPIO11/TOUCH11/ADC2_CH0/FSPID/FSPIIO5" }, { pins: [20], gpio: 12, name: "GPIO12/TOUCH12/ADC2_CH1/FSPICLK/FSPIIO6" }, { pins: [21], gpio: 13, name: "GPIO13/TOUCH13/ADC2_CH2/FSPIQ/FSPIIO7" }, { pins: [22], gpio: 14, name: "GPIO14/TOUCH14/ADC2_CH3/FSPIWP/FSPIDQS" }, { pins: [10], gpio: 17, name: "GPIO17/U1TXD/ADC2_CH6/DAC_1" }, { pins: [11], gpio: 18, name: "GPIO18/U1RXD/ADC2_CH7/DAC_2/CLK_OUT3" }, { pins: [23], gpio: 21, name: "GPIO21" }, { pins: [24], gpio: 33, name: "SPIIO4/GPIO33/FSPIHD" }, { pins: [25], gpio: 34, name: "SPIIO5/GPIO34/FSPICS0" }, { pins: [28], gpio: 35, name: "SPIIO6/GPIO35/FSPID" }, { pins: [29], gpio: 36, name: "SPIIO7/GPIO36/FSPICLK" }, { pins: [30], gpio: 37, name: "SPIDQS/GPIO37/FSPIQ" }, { pins: [31], gpio: 38, name: "GPIO38/FSPIWP" }, { pins: [26], gpio: 45, name: "GPIO45" }],
  bottom: [{ pins: [1,40,41], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const S2_WROVER_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH0"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH1"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","ADC1_CH6"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","ADC1_CH7"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","ADC1_CH8"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","ADC1_CH9"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 12, names: ["GPIO12","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","ADC2_CH3"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","rtc"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 17, names: ["GPIO17","ADC2_CH6","DAC_1"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18","ADC2_CH7","DAC_2"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D-","ADC2_CH8"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","USB_D+","ADC2_CH9"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","SPI_CS1"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","PROG"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio"] as Capability[], constraints: [INPUT_ONLY, STRAP], isUsable: true },
]

export const S2_WROVER_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-WROVER',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, gpio: 0 }, { pinNumber: 4, gpio: 1 }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, gpio: 4 }, { pinNumber: 8, gpio: 5 }, { pinNumber: 9, gpio: 6 }, { pinNumber: 10, gpio: 7 }, { pinNumber: 11, gpio: 8 }, { pinNumber: 12, gpio: 9 }, { pinNumber: 13, gpio: 10 }, { pinNumber: 14, gpio: 11 }, { pinNumber: 15, gpio: 12 }, { pinNumber: 16, gpio: 13 }],
  bottom: [{ pinNumber: 17, gpio: 14 }, { pinNumber: 18, gpio: 15 }, { pinNumber: 19, gpio: 16 }, { pinNumber: 20, gpio: 17 }, { pinNumber: 21, gpio: 18 }, { pinNumber: 22, gpio: 19 }, { pinNumber: 23, gpio: 20 }, { pinNumber: 24, gpio: 21 }, { pinNumber: 25, gpio: 26 }, { pinNumber: 26, label: 'GND' }],
  right: [{ pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'EN' }, { pinNumber: 40, gpio: 46 }, { pinNumber: 39, gpio: 45 }, { pinNumber: 38, gpio: 44 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 42 }, { pinNumber: 35, gpio: 41 }, { pinNumber: 34, gpio: 40 }, { pinNumber: 33, gpio: 39 }, { pinNumber: 32, gpio: 38 }, { pinNumber: 31, gpio: 37 }, { pinNumber: 30, gpio: 36 }, { pinNumber: 29, gpio: 35 }, { pinNumber: 28, gpio: 34 }, { pinNumber: 27, gpio: 33 }],
  bodyMm: { w: 19.6, h: 32 },
  antennaMm: 7.85,
}

export const S2_WROVER_SYMBOL: SymbolLayout = {
  left: [{ pins: [41], label: 'EN', name: "CHIP/PU/RESET" }, { pins: [18], gpio: 15, name: "GPIO15/ADC2_CH4/XTAL_32K_P" }, { pins: [19], gpio: 16, name: "GPIO16/ADC2_CH5/XTAL_32K_N" }, { pins: [33], gpio: 39, name: "MTCK/JTAG/GPIO39" }, { pins: [34], gpio: 40, name: "MTDO/JTAG/GPIO40" }, { pins: [35], gpio: 41, name: "MTDI/JTAG/GPIO41" }, { pins: [36], gpio: 42, name: "MTMS/JTAG/GPIO42" }, { pins: [40], gpio: 46, name: "GPIO46" }, { pins: [25], gpio: 26, name: "SPI_CS1/GPIO26" }],
  right: [{ pins: [38], gpio: 44, name: "GPIO44/U0RXD/PROG" }, { pins: [37], gpio: 43, name: "GPIO43/U0TXD/PROG" }, { pins: [23], gpio: 20, name: "USB_D+/ADC2_CH9/GPIO20" }, { pins: [22], gpio: 19, name: "USB_D-/ADC2_CH8/GPIO19" }, { pins: [3], gpio: 0, name: "GPIO0/BOOT" }, { pins: [4], gpio: 1, name: "GPIO1/ADC1_CH0" }, { pins: [5], gpio: 2, name: "GPIO2/ADC1_CH1" }, { pins: [6], gpio: 3, name: "GPIO3/ADC1_CH2" }, { pins: [7], gpio: 4, name: "GPIO4/ADC1_CH3" }, { pins: [8], gpio: 5, name: "GPIO5/ADC1_CH4" }, { pins: [9], gpio: 6, name: "GPIO6/ADC1_CH5" }, { pins: [10], gpio: 7, name: "GPIO7/ADC1_CH6" }, { pins: [11], gpio: 8, name: "GPIO8/ADC1_CH7" }, { pins: [12], gpio: 9, name: "GPIO9/ADC1_CH8" }, { pins: [13], gpio: 10, name: "GPIO10/ADC1_CH9" }, { pins: [14], gpio: 11, name: "GPIO11/ADC2_CH0" }, { pins: [15], gpio: 12, name: "GPIO12/ADC2_CH1" }, { pins: [16], gpio: 13, name: "GPIO13/ADC2_CH2" }, { pins: [17], gpio: 14, name: "GPIO14/ADC2_CH3" }, { pins: [20], gpio: 17, name: "ADC2_CH6/DAC_1/GPIO17" }, { pins: [21], gpio: 18, name: "ADC2_CH7/DAC_2/GPIO18" }, { pins: [24], gpio: 21, name: "GPIO21" }, { pins: [27], gpio: 33, name: "GPIO33" }, { pins: [28], gpio: 34, name: "GPIO34" }, { pins: [29], gpio: 35, name: "GPIO35" }, { pins: [30], gpio: 36, name: "GPIO36" }, { pins: [31], gpio: 37, name: "GPIO37" }, { pins: [32], gpio: 38, name: "GPIO38" }, { pins: [39], gpio: 45, name: "GPIO45" }],
  bottom: [{ pins: [1,26,42,43], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const S3_WROOM_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","TOUCH1","ADC1_CH0"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","TOUCH2","ADC1_CH1"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","TOUCH3","ADC1_CH2"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 4, names: ["GPIO4","TOUCH4","ADC1_CH3"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","TOUCH5","ADC1_CH4"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","TOUCH6","ADC1_CH5"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","TOUCH7","ADC1_CH6"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","TOUCH8","ADC1_CH7","SUBSPICS1"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","TOUCH9","ADC1_CH8","FSPIHD","SUBSPIHD"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","TOUCH10","ADC1_CH9","FSPICS0","FSPIIO4","SUBSPICS0"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","TOUCH11","ADC2_CH0","FSPID","FSPIIO5","SUBSPID"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","TOUCH12","ADC2_CH1","FSPICLK","FSPIIO6","SUBSPICLK"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","TOUCH13","ADC2_CH2","FSPIQ","FSPIIO7","SUBSPIQ"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 14, names: ["GPIO14","TOUCH14","ADC2_CH3","FSPIWP","FSPIDQS","SUBSPIWP"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15","U0RTS","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0CTS","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U1TXD","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","U1RXD","ADC2_CH7","CLK_OUT3"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","U1RTS","ADC2_CH8","CLK_OUT2","USB_D-"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U1CTS","ADC2_CH9","CLK_OUT1","USB_D+"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35","SPIIO6","FSPID","SUBSPID"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 36, names: ["GPIO36","SPIIO7","FSPICLK","SUBSPICLK"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 37, names: ["GPIO37","SPIDQS","FSPIQ","SUBSPIQ"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 38, names: ["GPIO38","FSPIWP","SUBSPIWP"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","CLK_OUT3","SUBSPICS1"], capabilities: ["gpio","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","CLK_OUT2"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","CLK_OUT1"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","CLK_OUT1"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","CLK_OUT2"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 47, names: ["GPIO47","SPICLK_P","SUBSPICLK_P_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 48, names: ["GPIO48","SPICLK_N","SUBSPICLK_N_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
]

export const S3_WROOM_1_LAYOUT: PackageLayout = {
  name: 'ESP32-S3-WROOM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 19 }, { pinNumber: 14, gpio: 20 }],
  bottom: [{ pinNumber: 15, gpio: 3 }, { pinNumber: 16, gpio: 46 }, { pinNumber: 17, gpio: 9 }, { pinNumber: 18, gpio: 10 }, { pinNumber: 19, gpio: 11 }, { pinNumber: 20, gpio: 12 }, { pinNumber: 21, gpio: 13 }, { pinNumber: 22, gpio: 14 }, { pinNumber: 23, gpio: 21 }, { pinNumber: 24, gpio: 47 }, { pinNumber: 25, gpio: 48 }, { pinNumber: 26, gpio: 45 }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, gpio: 1 }, { pinNumber: 38, gpio: 2 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 44 }, { pinNumber: 35, gpio: 42 }, { pinNumber: 34, gpio: 41 }, { pinNumber: 33, gpio: 40 }, { pinNumber: 32, gpio: 39 }, { pinNumber: 31, gpio: 38 }, { pinNumber: 30, gpio: 37 }, { pinNumber: 29, gpio: 36 }, { pinNumber: 28, gpio: 35 }, { pinNumber: 27, gpio: 0 }],
  bodyMm: { w: 19.6, h: 26.6 },
  antennaMm: 7.79,
}

export const S3_WROOM_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN" }, { pins: [8], gpio: 15, name: "GPIO15/U0RTS/ADC2_CH4/XTAL_32K_P" }, { pins: [9], gpio: 16, name: "GPIO16/U0CTS/ADC2_CH5/XTAL_32K_N" }, { pins: [32], gpio: 39, name: "MTCK/GPIO39/CLK_OUT3/SUBSPICS1" }, { pins: [33], gpio: 40, name: "MTDO/GPIO40/CLK_OUT2" }, { pins: [34], gpio: 41, name: "MTDI/GPIO41/CLK_OUT1" }, { pins: [35], gpio: 42, name: "MTMS/GPIO42" }, { pins: [28], gpio: 35, name: "SPIIO6/GPIO35/FSPID/SUBSPID" }, { pins: [29], gpio: 36, name: "SPIIO7/GPIO36/FSPICLK/SUBSPICLK" }, { pins: [30], gpio: 37, name: "SPIDQS/GPIO37/FSPIQ/SUBSPIQ" }],
  right: [{ pins: [37], gpio: 43, name: "U0TXD/GPIO43/CLK_OUT1" }, { pins: [36], gpio: 44, name: "U0RXD/GPIO44/CLK_OUT2" }, { pins: [14], gpio: 20, name: "GPIO20/U1CTS/ADC2_CH9/CLK_OUT1/USB_D+" }, { pins: [13], gpio: 19, name: "GPIO19/U1RTS/ADC2_CH8/CLK_OUT2/USB_D-" }, { pins: [27], gpio: 0, name: "GPIO0/BOOT" }, { pins: [39], gpio: 1, name: "GPIO1/TOUCH1/ADC1_CH0" }, { pins: [38], gpio: 2, name: "GPIO2/TOUCH2/ADC1_CH1" }, { pins: [15], gpio: 3, name: "GPIO3/TOUCH3/ADC1_CH2" }, { pins: [4], gpio: 4, name: "GPIO4/TOUCH4/ADC1_CH3" }, { pins: [5], gpio: 5, name: "GPIO5/TOUCH5/ADC1_CH4" }, { pins: [6], gpio: 6, name: "GPIO6/TOUCH6/ADC1_CH5" }, { pins: [7], gpio: 7, name: "GPIO7/TOUCH7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/TOUCH8/ADC1_CH7/SUBSPICS1" }, { pins: [17], gpio: 9, name: "GPIO9/TOUCH9/ADC1_CH8/FSPIHD/SUBSPIHD" }, { pins: [18], gpio: 10, name: "GPIO10/TOUCH10/ADC1_CH9/FSPICS0/FSPIIO4/SUBSPICS0" }, { pins: [19], gpio: 11, name: "GPIO11/TOUCH11/ADC2_CH0/FSPID/FSPIIO5/SUBSPID" }, { pins: [20], gpio: 12, name: "GPIO12/TOUCH12/ADC2_CH1/FSPICLK/FSPIIO6/SUBSPICLK" }, { pins: [21], gpio: 13, name: "GPIO13/TOUCH13/ADC2_CH2/FSPIQ/FSPIIO7/SUBSPIQ" }, { pins: [22], gpio: 14, name: "GPIO14/TOUCH14/ADC2_CH3/FSPIWP/FSPIDQS/SUBSPIWP" }, { pins: [10], gpio: 17, name: "GPIO17/U1TXD/ADC2_CH6" }, { pins: [11], gpio: 18, name: "GPIO18/U1RXD/ADC2_CH7/CLK_OUT3" }, { pins: [23], gpio: 21, name: "GPIO21" }, { pins: [31], gpio: 38, name: "GPIO38/FSPIWP/SUBSPIWP" }, { pins: [26], gpio: 45, name: "GPIO45" }, { pins: [16], gpio: 46, name: "GPIO46" }, { pins: [24], gpio: 47, name: "GPIO47/SPICLK_P/SUBSPICLK_P_DIFF" }, { pins: [25], gpio: 48, name: "GPIO48/SPICLK_N/SUBSPICLK_N_DIFF" }],
  bottom: [{ pins: [1,40,41], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const S3_WROOM_2_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","TOUCH1","ADC1_CH0"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","TOUCH2","ADC1_CH1"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","TOUCH3","ADC1_CH2"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 4, names: ["GPIO4","TOUCH4","ADC1_CH3"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","TOUCH5","ADC1_CH4"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","TOUCH6","ADC1_CH5"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","TOUCH7","ADC1_CH6"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","TOUCH8","ADC1_CH7","SUBSPICS1"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","TOUCH9","ADC1_CH8","FSPIHD","SUBSPIHD"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","TOUCH10","ADC1_CH9","FSPICS0","FSPIIO4","SUBSPICS0"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","TOUCH11","ADC2_CH0","FSPID","FSPIIO5","SUBSPID"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","TOUCH12","ADC2_CH1","FSPICLK","FSPIIO6","SUBSPICLK"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","TOUCH13","ADC2_CH2","FSPIQ","FSPIIO7","SUBSPIQ"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 14, names: ["GPIO14","TOUCH14","ADC2_CH3","FSPIWP","FSPIDQS","SUBSPIWP"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15","U0RTS","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0CTS","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U1TXD","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","U1RXD","ADC2_CH7","CLK_OUT3"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","U1RTS","ADC2_CH8","CLK_OUT2","USB_D-"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U1CTS","ADC2_CH9","CLK_OUT1","USB_D+"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38","FSPIWP","SUBSPIWP"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","CLK_OUT3","SUBSPICS1"], capabilities: ["gpio","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","CLK_OUT2"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","CLK_OUT1"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","CLK_OUT1"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","CLK_OUT2"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 47, names: ["GPIO47","SPICLK_P","SUBSPICLK_P_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 48, names: ["GPIO48","SPICLK_N","SUBSPICLK_N_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
]

export const S3_WROOM_2_LAYOUT: PackageLayout = {
  name: 'ESP32-S3-WROOM-2',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 19 }, { pinNumber: 14, gpio: 20 }],
  bottom: [{ pinNumber: 15, gpio: 3 }, { pinNumber: 16, gpio: 46 }, { pinNumber: 17, gpio: 9 }, { pinNumber: 18, gpio: 10 }, { pinNumber: 19, gpio: 11 }, { pinNumber: 20, gpio: 12 }, { pinNumber: 21, gpio: 13 }, { pinNumber: 22, gpio: 14 }, { pinNumber: 23, gpio: 21 }, { pinNumber: 24, gpio: 47 }, { pinNumber: 25, gpio: 48 }, { pinNumber: 26, gpio: 45 }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, gpio: 1 }, { pinNumber: 38, gpio: 2 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 44 }, { pinNumber: 35, gpio: 42 }, { pinNumber: 34, gpio: 41 }, { pinNumber: 33, gpio: 40 }, { pinNumber: 32, gpio: 39 }, { pinNumber: 31, gpio: 38 }, { pinNumber: 30, label: 'NC' }, { pinNumber: 29, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 27, gpio: 0 }],
  bodyMm: { w: 19.6, h: 26.6 },
  antennaMm: 7.79,
}

export const S3_WROOM_2_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN" }, { pins: [8], gpio: 15, name: "GPIO15/U0RTS/ADC2_CH4/XTAL_32K_P" }, { pins: [9], gpio: 16, name: "GPIO16/U0CTS/ADC2_CH5/XTAL_32K_N" }, { pins: [32], gpio: 39, name: "MTCK/GPIO39/CLK_OUT3/SUBSPICS1" }, { pins: [33], gpio: 40, name: "MTDO/GPIO40/CLK_OUT2" }, { pins: [34], gpio: 41, name: "MTDI/GPIO41/CLK_OUT1" }, { pins: [35], gpio: 42, name: "MTMS/GPIO42" }, { pins: [30], label: 'NC', name: "NC" }, { pins: [29], label: 'NC', name: "NC" }, { pins: [28], label: 'NC', name: "NC" }],
  right: [{ pins: [37], gpio: 43, name: "U0TXD/GPIO43/CLK_OUT1" }, { pins: [36], gpio: 44, name: "U0RXD/GPIO44/CLK_OUT2" }, { pins: [14], gpio: 20, name: "GPIO20/U1CTS/ADC2_CH9/CLK_OUT1/USB_D+" }, { pins: [13], gpio: 19, name: "GPIO19/U1RTS/ADC2_CH8/CLK_OUT2/USB_D-" }, { pins: [27], gpio: 0, name: "GPIO0/BOOT" }, { pins: [39], gpio: 1, name: "GPIO1/TOUCH1/ADC1_CH0" }, { pins: [38], gpio: 2, name: "GPIO2/TOUCH2/ADC1_CH1" }, { pins: [15], gpio: 3, name: "GPIO3/TOUCH3/ADC1_CH2" }, { pins: [4], gpio: 4, name: "GPIO4/TOUCH4/ADC1_CH3" }, { pins: [5], gpio: 5, name: "GPIO5/TOUCH5/ADC1_CH4" }, { pins: [6], gpio: 6, name: "GPIO6/TOUCH6/ADC1_CH5" }, { pins: [7], gpio: 7, name: "GPIO7/TOUCH7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/TOUCH8/ADC1_CH7/SUBSPICS1" }, { pins: [17], gpio: 9, name: "GPIO9/TOUCH9/ADC1_CH8/FSPIHD/SUBSPIHD" }, { pins: [18], gpio: 10, name: "GPIO10/TOUCH10/ADC1_CH9/FSPICS0/FSPIIO4/SUBSPICS0" }, { pins: [19], gpio: 11, name: "GPIO11/TOUCH11/ADC2_CH0/FSPID/FSPIIO5/SUBSPID" }, { pins: [20], gpio: 12, name: "GPIO12/TOUCH12/ADC2_CH1/FSPICLK/FSPIIO6/SUBSPICLK" }, { pins: [21], gpio: 13, name: "GPIO13/TOUCH13/ADC2_CH2/FSPIQ/FSPIIO7/SUBSPIQ" }, { pins: [22], gpio: 14, name: "GPIO14/TOUCH14/ADC2_CH3/FSPIWP/FSPIDQS/SUBSPIWP" }, { pins: [10], gpio: 17, name: "GPIO17/U1TXD/ADC2_CH6" }, { pins: [11], gpio: 18, name: "GPIO18/U1RXD/ADC2_CH7/CLK_OUT3" }, { pins: [23], gpio: 21, name: "GPIO21" }, { pins: [31], gpio: 38, name: "GPIO38/FSPIWP/SUBSPIWP" }, { pins: [26], gpio: 45, name: "GPIO45" }, { pins: [16], gpio: 46, name: "GPIO46" }, { pins: [24], gpio: 47, name: "GPIO47/SPICLK_P/SUBSPICLK_P_DIFF" }, { pins: [25], gpio: 48, name: "GPIO48/SPICLK_N/SUBSPICLK_N_DIFF" }],
  bottom: [{ pins: [1,40,41], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const S3_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","TOUCH1","ADC1_CH0"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","TOUCH2","ADC1_CH1"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","TOUCH3","ADC1_CH2"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 4, names: ["GPIO4","TOUCH4","ADC1_CH3"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","TOUCH5","ADC1_CH4"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","TOUCH6","ADC1_CH5"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","TOUCH7","ADC1_CH6"], capabilities: ["gpio","adc1","touch","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","TOUCH8","ADC1_CH7","SUBSPICS1"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","TOUCH9","ADC1_CH8","FSPIHD","SUBSPIHD"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","TOUCH10","ADC1_CH9","FSPICS0","FSPIIO4","SUBSPICS0"], capabilities: ["gpio","adc1","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","TOUCH11","ADC2_CH0","FSPID","FSPIIO5","SUBSPID"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","TOUCH12","ADC2_CH1","FSPICLK","FSPIIO6","SUBSPICLK"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","TOUCH13","ADC2_CH2","FSPIQ","FSPIIO7","SUBSPIQ"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 14, names: ["GPIO14","TOUCH14","ADC2_CH3","FSPIWP","FSPIDQS","SUBSPIWP"], capabilities: ["gpio","adc2","touch","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15","U0RTS","ADC2_CH4","XTAL_32K_P"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0CTS","ADC2_CH5","XTAL_32K_N"], capabilities: ["gpio","adc2","pwm","uart","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U1TXD","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","U1RXD","ADC2_CH7","CLK_OUT3"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","U1RTS","ADC2_CH8","CLK_OUT2","USB_D-"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U1CTS","ADC2_CH9","CLK_OUT1","USB_D+"], capabilities: ["gpio","adc2","pwm","uart","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","SPIIO4","FSPIHD","SUBSPIHD"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","SPIIO5","FSPICS0","SUBSPICS0"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35","SPIIO6","FSPID","SUBSPID"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36","SPIIO7","FSPICLK","SUBSPICLK"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37","SPIDQS","FSPIQ","SUBSPIQ"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38","FSPIWP","SUBSPIWP"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK","CLK_OUT3","SUBSPICS1"], capabilities: ["gpio","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO","CLK_OUT2"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI","CLK_OUT1"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD","CLK_OUT1"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD","CLK_OUT2"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 47, names: ["GPIO47","SPICLK_P","SUBSPICLK_P_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 48, names: ["GPIO48","SPICLK_N","SUBSPICLK_N_DIFF"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
]

export const S3_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-S3-MINI-1',
  left: [{ pinNumber: 62, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 0 }, { pinNumber: 5, gpio: 1 }, { pinNumber: 6, gpio: 2 }, { pinNumber: 7, gpio: 3 }, { pinNumber: 8, gpio: 4 }, { pinNumber: 9, gpio: 5 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, gpio: 7 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 9 }, { pinNumber: 14, gpio: 10 }, { pinNumber: 15, gpio: 11 }, { pinNumber: 63, label: 'GND' }],
  bottom: [{ pinNumber: 16, gpio: 12 }, { pinNumber: 17, gpio: 13 }, { pinNumber: 18, gpio: 14 }, { pinNumber: 19, gpio: 15 }, { pinNumber: 20, gpio: 16 }, { pinNumber: 21, gpio: 17 }, { pinNumber: 22, gpio: 18 }, { pinNumber: 23, gpio: 19 }, { pinNumber: 24, gpio: 20 }, { pinNumber: 25, gpio: 21 }, { pinNumber: 26, gpio: 26 }, { pinNumber: 27, gpio: 47 }, { pinNumber: 28, gpio: 33 }, { pinNumber: 29, gpio: 34 }, { pinNumber: 30, gpio: 48 }],
  right: [{ pinNumber: 65, label: 'GND' }, { pinNumber: 45, label: 'EN' }, { pinNumber: 44, gpio: 46 }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, gpio: 45 }, { pinNumber: 40, gpio: 44 }, { pinNumber: 39, gpio: 43 }, { pinNumber: 38, gpio: 42 }, { pinNumber: 37, gpio: 41 }, { pinNumber: 36, gpio: 40 }, { pinNumber: 35, gpio: 39 }, { pinNumber: 34, gpio: 38 }, { pinNumber: 33, gpio: 37 }, { pinNumber: 32, gpio: 36 }, { pinNumber: 31, gpio: 35 }, { pinNumber: 64, label: 'GND' }],
  top: [{ pinNumber: 60, label: 'GND' }, { pinNumber: 59, label: 'GND' }, { pinNumber: 58, label: 'GND' }, { pinNumber: 57, label: 'GND' }, { pinNumber: 56, label: 'GND' }, { pinNumber: 55, label: 'GND' }, { pinNumber: 54, label: 'GND' }, { pinNumber: 53, label: 'GND' }, { pinNumber: 52, label: 'GND' }, { pinNumber: 51, label: 'GND' }, { pinNumber: 50, label: 'GND' }, { pinNumber: 49, label: 'GND' }, { pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }],
  bodyMm: { w: 16, h: 21.1 },
  antennaMm: 6.1,
}

export const S3_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [45], label: 'EN', name: "EN" }, { pins: [19], gpio: 15, name: "GPIO15/U0RTS/ADC2_CH4/XTAL_32K_P" }, { pins: [20], gpio: 16, name: "GPIO16/U0CTS/ADC2_CH5/XTAL_32K_N" }, { pins: [35], gpio: 39, name: "MTCK/GPIO39/CLK_OUT3/SUBSPICS1" }, { pins: [36], gpio: 40, name: "MTDO/GPIO40/CLK_OUT2" }, { pins: [37], gpio: 41, name: "MTDI/GPIO41/CLK_OUT1" }, { pins: [38], gpio: 42, name: "MTMS/GPIO42" }, { pins: [26], gpio: 26, name: "GPIO26" }, { pins: [28], gpio: 33, name: "SPIIO4/GPIO33/FSPIHD/SUBSPIHD" }, { pins: [29], gpio: 34, name: "SPIIO5/GPIO34/FSPICS0/SUBSPICS0" }, { pins: [31], gpio: 35, name: "SPIIO6/GPIO35/FSPID/SUBSPID" }, { pins: [32], gpio: 36, name: "SPIIO7/GPIO36/FSPICLK/SUBSPICLK" }, { pins: [33], gpio: 37, name: "SPIDQS/GPIO37/FSPIQ/SUBSPIQ" }],
  right: [{ pins: [39], gpio: 43, name: "U0TXD/GPIO43/CLK_OUT1" }, { pins: [40], gpio: 44, name: "U0RXD/GPIO44/CLK_OUT2" }, { pins: [24], gpio: 20, name: "GPIO20/U1CTS/ADC2_CH9/CLK_OUT1/USB_D+" }, { pins: [23], gpio: 19, name: "GPIO19/U1RTS/ADC2_CH8/CLK_OUT2/USB_D-" }, { pins: [4], gpio: 0, name: "GPIO0/BOOT" }, { pins: [5], gpio: 1, name: "GPIO1/TOUCH1/ADC1_CH0" }, { pins: [6], gpio: 2, name: "GPIO2/TOUCH2/ADC1_CH1" }, { pins: [7], gpio: 3, name: "GPIO3/TOUCH3/ADC1_CH2" }, { pins: [8], gpio: 4, name: "GPIO4/TOUCH4/ADC1_CH3" }, { pins: [9], gpio: 5, name: "GPIO5/TOUCH5/ADC1_CH4" }, { pins: [10], gpio: 6, name: "GPIO6/TOUCH6/ADC1_CH5" }, { pins: [11], gpio: 7, name: "GPIO7/TOUCH7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/TOUCH8/ADC1_CH7/SUBSPICS1" }, { pins: [13], gpio: 9, name: "GPIO9/TOUCH9/ADC1_CH8/FSPIHD/SUBSPIHD" }, { pins: [14], gpio: 10, name: "GPIO10/TOUCH10/ADC1_CH9/FSPICS0/FSPIIO4/SUBSPICS0" }, { pins: [15], gpio: 11, name: "GPIO11/TOUCH11/ADC2_CH0/FSPID/FSPIIO5/SUBSPID" }, { pins: [16], gpio: 12, name: "GPIO12/TOUCH12/ADC2_CH1/FSPICLK/FSPIIO6/SUBSPICLK" }, { pins: [17], gpio: 13, name: "GPIO13/TOUCH13/ADC2_CH2/FSPIQ/FSPIIO7/SUBSPIQ" }, { pins: [18], gpio: 14, name: "GPIO14/TOUCH14/ADC2_CH3/FSPIWP/FSPIDQS/SUBSPIWP" }, { pins: [21], gpio: 17, name: "GPIO17/U1TXD/ADC2_CH6" }, { pins: [22], gpio: 18, name: "GPIO18/U1RXD/ADC2_CH7/CLK_OUT3" }, { pins: [25], gpio: 21, name: "GPIO21" }, { pins: [34], gpio: 38, name: "GPIO38/FSPIWP/SUBSPIWP" }, { pins: [41], gpio: 45, name: "GPIO45" }, { pins: [44], gpio: 46, name: "GPIO46" }, { pins: [27], gpio: 47, name: "GPIO47/SPICLK_P/SUBSPICLK_P_DIFF" }, { pins: [30], gpio: 48, name: "GPIO48/SPICLK_N/SUBSPICLK_N_DIFF" }],
  bottom: [{ pins: [1,2,42,43,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const C3_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC1_CH0","XTAL_32K_P"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH1","XTAL_32K_N"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
]

export const C3_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C3-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, label: 'NC' }, { pinNumber: 10, label: 'NC' }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 0 }, { pinNumber: 13, gpio: 1 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, label: 'NC' }, { pinNumber: 16, gpio: 10 }, { pinNumber: 17, label: 'NC' }, { pinNumber: 18, gpio: 4 }, { pinNumber: 19, gpio: 5 }, { pinNumber: 20, gpio: 6 }, { pinNumber: 21, gpio: 7 }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, label: 'NC' }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 21 }, { pinNumber: 30, gpio: 20 }, { pinNumber: 29, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 27, gpio: 19 }, { pinNumber: 26, gpio: 18 }, { pinNumber: 25, label: 'NC' }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
  bodyMm: { w: 13.6, h: 17 },
  antennaMm: 6.25,
}

export const C3_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [8], label: 'EN', name: "EN/CHIP_PU" }, { pins: [12], gpio: 0, name: "GPIO0/ADC1_CH0/XTAL_32K_P" }, { pins: [13], gpio: 1, name: "GPIO1/ADC1_CH1/XTAL_32K_N" }, { pins: [4], label: 'NC', name: "NC" }, { pins: [7], label: 'NC', name: "NC" }, { pins: [9], label: 'NC', name: "NC" }, { pins: [10], label: 'NC', name: "NC" }, { pins: [15], label: 'NC', name: "NC" }, { pins: [17], label: 'NC', name: "NC" }, { pins: [24], label: 'NC', name: "NC" }, { pins: [25], label: 'NC', name: "NC" }, { pins: [28], label: 'NC', name: "NC" }, { pins: [29], label: 'NC', name: "NC" }, { pins: [32], label: 'NC', name: "NC" }, { pins: [33], label: 'NC', name: "NC" }, { pins: [34], label: 'NC', name: "NC" }, { pins: [35], label: 'NC', name: "NC" }],
  right: [{ pins: [31], gpio: 21, name: "GPIO21/U0TXD" }, { pins: [30], gpio: 20, name: "GPIO20/U0RXD" }, { pins: [27], gpio: 19, name: "GPIO19/USB_D+" }, { pins: [26], gpio: 18, name: "GPIO18/USB_D-" }, { pins: [5], gpio: 2, name: "GPIO2/ADC1_CH2" }, { pins: [6], gpio: 3, name: "GPIO3/ADC1_CH3" }, { pins: [18], gpio: 4, name: "GPIO4/ADC1_CH4" }, { pins: [19], gpio: 5, name: "GPIO5/ADC2_CH0" }, { pins: [20], gpio: 6, name: "GPIO6" }, { pins: [21], gpio: 7, name: "GPIO7" }, { pins: [22], gpio: 8, name: "GPIO8" }, { pins: [23], gpio: 9, name: "GPIO9" }, { pins: [16], gpio: 10, name: "GPIO10" }],
  bottom: [{ pins: [1,2,11,14,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const C3_WROOM_02_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC1_CH0","XTAL_32K_P"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH1","XTAL_32K_N"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
]

export const C3_WROOM_02_LAYOUT: PackageLayout = {
  name: 'ESP32-C3-WROOM-02',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 4 }, { pinNumber: 4, gpio: 5 }, { pinNumber: 5, gpio: 6 }, { pinNumber: 6, gpio: 7 }, { pinNumber: 7, gpio: 8 }, { pinNumber: 8, gpio: 9 }, { pinNumber: 9, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 18, gpio: 0 }, { pinNumber: 17, gpio: 1 }, { pinNumber: 16, gpio: 2 }, { pinNumber: 15, gpio: 3 }, { pinNumber: 14, gpio: 19 }, { pinNumber: 13, gpio: 18 }, { pinNumber: 12, gpio: 21 }, { pinNumber: 11, gpio: 20 }, { pinNumber: 10, gpio: 10 }],
  bodyMm: { w: 19.6, h: 20.6 },
  antennaMm: 7.4,
}

export const C3_WROOM_02_SYMBOL: SymbolLayout = {
  left: [{ pins: [2], label: 'EN', name: "EN/CHIP_PU" }, { pins: [18], gpio: 0, name: "GPIO0/ADC1_CH0/XTAL_32K_P" }, { pins: [17], gpio: 1, name: "GPIO1/ADC1_CH1/XTAL_32K_N" }],
  right: [{ pins: [11], gpio: 20, name: "GPIO20/U0RXD" }, { pins: [12], gpio: 21, name: "GPIO21/U0TXD" }, { pins: [13], gpio: 18, name: "GPIO18/USB_D-" }, { pins: [14], gpio: 19, name: "GPIO19/USB_D+" }, { pins: [16], gpio: 2, name: "GPIO2/ADC1_CH2" }, { pins: [15], gpio: 3, name: "GPIO3/ADC1_CH3" }, { pins: [3], gpio: 4, name: "GPIO4/ADC1_CH4" }, { pins: [4], gpio: 5, name: "GPIO5/ADC2_CH0" }, { pins: [5], gpio: 6, name: "GPIO6" }, { pins: [6], gpio: 7, name: "GPIO7" }, { pins: [7], gpio: 8, name: "GPIO8" }, { pins: [8], gpio: 9, name: "GPIO9" }, { pins: [10], gpio: 10, name: "GPIO10" }],
  bottom: [{ pins: [9,19], label: 'GND', name: "GND" }],
  top: [{ pins: [1], label: '3V3', name: "3V3" }],
}

export const C6_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC1_CH0","XTAL_32K_P"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH1","XTAL_32K_N"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","MTMS","ADC1_CH4"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","MTDI","ADC1_CH5"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","MTCK","ADC1_CH6"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","MTDO"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 12, names: ["GPIO12","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 14, names: ["GPIO14"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const C6_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C6-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 4 }, { pinNumber: 10, gpio: 5 }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 0 }, { pinNumber: 13, gpio: 1 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, gpio: 6 }, { pinNumber: 16, gpio: 7 }, { pinNumber: 17, gpio: 12 }, { pinNumber: 18, gpio: 13 }, { pinNumber: 19, gpio: 14 }, { pinNumber: 20, gpio: 15 }, { pinNumber: 21, label: 'NC' }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, gpio: 18 }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 16 }, { pinNumber: 30, gpio: 17 }, { pinNumber: 29, gpio: 23 }, { pinNumber: 28, gpio: 22 }, { pinNumber: 27, gpio: 21 }, { pinNumber: 26, gpio: 20 }, { pinNumber: 25, gpio: 19 }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
  bodyMm: { w: 13.6, h: 17 },
  antennaMm: 6.25,
}

export const C6_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [8], label: 'EN', name: "EN/CHIP_PU" }, { pins: [12], gpio: 0, name: "GPIO0/ADC1_CH0/XTAL_32K_P" }, { pins: [13], gpio: 1, name: "GPIO1/ADC1_CH1/XTAL_32K_N" }, { pins: [5], gpio: 2, name: "GPIO2/ADC1_CH2" }, { pins: [6], gpio: 3, name: "GPIO3/ADC1_CH3" }, { pins: [9], gpio: 4, name: "MTMS/GPIO4/ADC1_CH4" }, { pins: [10], gpio: 5, name: "MTDI/GPIO5/ADC1_CH5" }, { pins: [15], gpio: 6, name: "MTCK/GPIO6/ADC1_CH6" }, { pins: [16], gpio: 7, name: "MTDO/GPIO7" }, { pins: [4], label: 'NC', name: "NC" }, { pins: [7], label: 'NC', name: "NC" }, { pins: [21], label: 'NC', name: "NC" }, { pins: [32], label: 'NC', name: "NC" }, { pins: [33], label: 'NC', name: "NC" }, { pins: [34], label: 'NC', name: "NC" }, { pins: [35], label: 'NC', name: "NC" }],
  right: [{ pins: [31], gpio: 16, name: "U0TXD/GPIO16" }, { pins: [30], gpio: 17, name: "U0RXD/GPIO17" }, { pins: [18], gpio: 13, name: "GPIO13/USB_D+" }, { pins: [17], gpio: 12, name: "GPIO12/USB_D-" }, { pins: [22], gpio: 8, name: "GPIO8" }, { pins: [23], gpio: 9, name: "GPIO9" }, { pins: [19], gpio: 14, name: "GPIO14" }, { pins: [20], gpio: 15, name: "GPIO15" }, { pins: [24], gpio: 18, name: "GPIO18" }, { pins: [25], gpio: 19, name: "GPIO19" }, { pins: [26], gpio: 20, name: "GPIO20" }, { pins: [27], gpio: 21, name: "GPIO21" }, { pins: [28], gpio: 22, name: "GPIO22" }, { pins: [29], gpio: 23, name: "GPIO23" }],
  bottom: [{ pins: [1,2,11,14,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }],
}

export const C6_WROOM_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC1_CH0","XTAL_32K_P"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH1","XTAL_32K_N"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","MTMS","ADC1_CH4"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","MTDI","ADC1_CH5"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","MTCK","ADC1_CH6"], capabilities: ["gpio","adc1","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","MTDO"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 15, names: ["GPIO15"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const C6_WROOM_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C6-WROOM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 0 }, { pinNumber: 9, gpio: 1 }, { pinNumber: 10, gpio: 8 }, { pinNumber: 11, gpio: 10 }, { pinNumber: 12, gpio: 11 }, { pinNumber: 13, gpio: 12 }, { pinNumber: 14, gpio: 13 }],
  bottom: [],
  right: [{ pinNumber: 28, label: 'GND' }, { pinNumber: 27, gpio: 2 }, { pinNumber: 26, gpio: 3 }, { pinNumber: 25, gpio: 16 }, { pinNumber: 24, gpio: 17 }, { pinNumber: 23, gpio: 15 }, { pinNumber: 22, label: 'NC' }, { pinNumber: 21, gpio: 23 }, { pinNumber: 20, gpio: 22 }, { pinNumber: 19, gpio: 21 }, { pinNumber: 18, gpio: 20 }, { pinNumber: 17, gpio: 19 }, { pinNumber: 16, gpio: 18 }, { pinNumber: 15, gpio: 9 }],
  bodyMm: { w: 19.6, h: 26.6 },
  antennaMm: 7.79,
}

export const C6_WROOM_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN/CHIP_PU" }, { pins: [8], gpio: 0, name: "GPIO0/ADC1_CH0/XTAL_32K_P" }, { pins: [9], gpio: 1, name: "GPIO1/ADC1_CH1/XTAL_32K_N" }, { pins: [27], gpio: 2, name: "GPIO2/ADC1_CH2" }, { pins: [26], gpio: 3, name: "GPIO3/ADC1_CH3" }, { pins: [4], gpio: 4, name: "MTMS/GPIO4/ADC1_CH4" }, { pins: [5], gpio: 5, name: "MTDI/GPIO5/ADC1_CH5" }, { pins: [6], gpio: 6, name: "MTCK/GPIO6/ADC1_CH6" }, { pins: [7], gpio: 7, name: "MTDO/GPIO7" }, { pins: [22], label: 'NC', name: "NC" }],
  right: [{ pins: [25], gpio: 16, name: "U0TXD/GPIO16" }, { pins: [24], gpio: 17, name: "U0RXD/GPIO17" }, { pins: [14], gpio: 13, name: "GPIO13/USB_D+" }, { pins: [13], gpio: 12, name: "GPIO12/USB_D-" }, { pins: [10], gpio: 8, name: "GPIO8" }, { pins: [15], gpio: 9, name: "GPIO9" }, { pins: [11], gpio: 10, name: "GPIO10" }, { pins: [12], gpio: 11, name: "GPIO11" }, { pins: [23], gpio: 15, name: "GPIO15" }, { pins: [16], gpio: 18, name: "GPIO18" }, { pins: [17], gpio: 19, name: "GPIO19" }, { pins: [18], gpio: 20, name: "GPIO20" }, { pins: [19], gpio: 21, name: "GPIO21" }, { pins: [20], gpio: 22, name: "GPIO22" }, { pins: [21], gpio: 23, name: "GPIO23" }],
  bottom: [{ pins: [1,28,29], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const C5_WROOM_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 14, names: ["GPIO14","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 15, names: ["GPIO15"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 24, names: ["GPIO24"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 26, names: ["GPIO26"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 27, names: ["GPIO27"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 28, names: ["GPIO28"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
]

export const C5_WROOM_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C5-WROOM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 2 }, { pinNumber: 5, gpio: 3 }, { pinNumber: 6, gpio: 0 }, { pinNumber: 7, gpio: 1 }, { pinNumber: 8, gpio: 6 }, { pinNumber: 9, gpio: 7 }, { pinNumber: 10, gpio: 8 }, { pinNumber: 11, gpio: 9 }, { pinNumber: 12, gpio: 10 }, { pinNumber: 13, gpio: 13 }, { pinNumber: 14, gpio: 14 }],
  bottom: [],
  right: [{ pinNumber: 28, label: 'GND' }, { pinNumber: 27, gpio: 26 }, { pinNumber: 26, gpio: 25 }, { pinNumber: 25, gpio: 11 }, { pinNumber: 24, gpio: 12 }, { pinNumber: 23, gpio: 24 }, { pinNumber: 22, label: 'NC' }, { pinNumber: 21, gpio: 23 }, { pinNumber: 20, label: 'NC' }, { pinNumber: 19, gpio: 15 }, { pinNumber: 18, gpio: 27 }, { pinNumber: 17, gpio: 4 }, { pinNumber: 16, gpio: 5 }, { pinNumber: 15, gpio: 28 }],
  bodyMm: { w: 19.6, h: 28.6 },
  antennaMm: 8.29,
}

export const C5_WROOM_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "EN/CHIP_PU" }, { pins: [4], gpio: 2, name: "GPIO2" }, { pins: [5], gpio: 3, name: "GPIO3" }, { pins: [16], gpio: 5, name: "GPIO5" }, { pins: [17], gpio: 4, name: "GPIO4" }, { pins: [6], gpio: 0, name: "GPIO0" }, { pins: [7], gpio: 1, name: "GPIO1" }, { pins: [8], gpio: 6, name: "GPIO6" }, { pins: [9], gpio: 7, name: "GPIO7" }, { pins: [10], gpio: 8, name: "GPIO8" }, { pins: [11], gpio: 9, name: "GPIO9" }, { pins: [12], gpio: 10, name: "GPIO10" }],
  right: [{ pins: [24], gpio: 12, name: "U0RXD/GPIO12" }, { pins: [25], gpio: 11, name: "U0TXD/GPIO11" }, { pins: [13], gpio: 13, name: "GPIO13/USB_D-" }, { pins: [14], gpio: 14, name: "GPIO14/USB_D+" }, { pins: [15], gpio: 28, name: "GPIO28" }, { pins: [18], gpio: 27, name: "GPIO27" }, { pins: [19], gpio: 15, name: "GPIO15" }, { pins: [21], gpio: 23, name: "GPIO23" }, { pins: [23], gpio: 24, name: "GPIO24" }, { pins: [26], gpio: 25, name: "GPIO25" }, { pins: [27], gpio: 26, name: "GPIO26" }, { pins: [20], label: 'NC', name: "NC" }, { pins: [22], label: 'NC', name: "NC" }],
  bottom: [{ pins: [1,28,29], label: 'GND', name: "GND" }],
  top: [{ pins: [2], label: '3V3', name: "3V3" }],
}

export const C5_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 14, names: ["GPIO14","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 15, names: ["GPIO15"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 24, names: ["GPIO24"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 26, names: ["GPIO26"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 27, names: ["GPIO27"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 28, names: ["GPIO28"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
]

export const C5_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C5-MINI-1',
  left: [{ pinNumber: 62, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 28 }, { pinNumber: 5, label: 'NC' }, { pinNumber: 6, gpio: 2 }, { pinNumber: 7, gpio: 3 }, { pinNumber: 8, gpio: 4 }, { pinNumber: 9, gpio: 5 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, label: 'NC' }, { pinNumber: 12, label: 'NC' }, { pinNumber: 13, label: 'NC' }, { pinNumber: 14, label: 'NC' }, { pinNumber: 15, label: 'NC' }, { pinNumber: 63, label: 'GND' }],
  bottom: [{ pinNumber: 16, gpio: 0 }, { pinNumber: 17, gpio: 1 }, { pinNumber: 18, label: 'NC' }, { pinNumber: 19, gpio: 7 }, { pinNumber: 20, gpio: 8 }, { pinNumber: 21, gpio: 9 }, { pinNumber: 22, gpio: 10 }, { pinNumber: 23, gpio: 13 }, { pinNumber: 24, gpio: 14 }, { pinNumber: 25, label: 'NC' }, { pinNumber: 26, gpio: 15 }, { pinNumber: 27, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 29, label: 'NC' }, { pinNumber: 30, label: 'NC' }],
  right: [{ pinNumber: 65, label: 'GND' }, { pinNumber: 45, label: 'EN' }, { pinNumber: 44, label: 'NC' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'NC' }, { pinNumber: 40, gpio: 12 }, { pinNumber: 39, gpio: 11 }, { pinNumber: 38, label: 'NC' }, { pinNumber: 37, label: 'NC' }, { pinNumber: 36, label: 'NC' }, { pinNumber: 35, gpio: 27 }, { pinNumber: 34, gpio: 26 }, { pinNumber: 33, gpio: 25 }, { pinNumber: 32, gpio: 24 }, { pinNumber: 31, gpio: 23 }, { pinNumber: 64, label: 'GND' }],
  top: [{ pinNumber: 60, label: 'GND' }, { pinNumber: 59, label: 'GND' }, { pinNumber: 58, label: 'GND' }, { pinNumber: 57, label: 'GND' }, { pinNumber: 56, label: 'GND' }, { pinNumber: 55, label: 'GND' }, { pinNumber: 54, label: 'GND' }, { pinNumber: 53, label: 'GND' }, { pinNumber: 52, label: 'GND' }, { pinNumber: 51, label: 'GND' }, { pinNumber: 50, label: 'GND' }, { pinNumber: 49, label: 'NC' }, { pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }],
  bodyMm: { w: 16, h: 21.9 },
  antennaMm: 6.9,
}

export const C5_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [45], label: 'EN', name: "EN/CHIP_PU" }, { pins: [5], label: 'NC', name: "NC" }, { pins: [6], gpio: 2, name: "GPIO2" }, { pins: [7], gpio: 3, name: "GPIO3" }, { pins: [8], gpio: 4, name: "GPIO4" }, { pins: [9], gpio: 5, name: "GPIO5" }, { pins: [10], gpio: 6, name: "GPIO6" }, { pins: [16], gpio: 0, name: "GPIO0" }, { pins: [17], gpio: 1, name: "GPIO1" }, { pins: [14], label: 'NC', name: "NC" }, { pins: [19], gpio: 7, name: "GPIO7" }, { pins: [20], gpio: 8, name: "GPIO8" }, { pins: [21], gpio: 9, name: "GPIO9" }, { pins: [22], gpio: 10, name: "GPIO10" }, { pins: [26], gpio: 15, name: "GPIO15" }, { pins: [15], label: 'NC', name: "NC" }, { pins: [18], label: 'NC', name: "NC" }],
  right: [{ pins: [39], gpio: 11, name: "U0TXD/GPIO11" }, { pins: [40], gpio: 12, name: "U0RXD/GPIO12" }, { pins: [23], gpio: 13, name: "GPIO13/USB_D-" }, { pins: [24], gpio: 14, name: "GPIO14/USB_D+" }, { pins: [31], gpio: 23, name: "GPIO23" }, { pins: [32], gpio: 24, name: "GPIO24" }, { pins: [33], gpio: 25, name: "GPIO25" }, { pins: [34], gpio: 26, name: "GPIO26" }, { pins: [35], gpio: 27, name: "GPIO27" }, { pins: [4], gpio: 28, name: "GPIO28" }, { pins: [36], label: 'NC', name: "NC" }, { pins: [37], label: 'NC', name: "NC" }, { pins: [38], label: 'NC', name: "NC" }, { pins: [41], label: 'NC', name: "NC" }, { pins: [44], label: 'NC', name: "NC" }],
  bottom: [{ pins: [28], label: 'NC', name: "NC" }, { pins: [25], label: 'NC', name: "NC" }, { pins: [27], label: 'NC', name: "NC" }, { pins: [29], label: 'NC', name: "NC" }, { pins: [30], label: 'NC', name: "NC" }, { pins: [49], label: 'NC', name: "NC" }, { pins: [1,2,42,43,46,47,48,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }, { pins: [11], label: 'NC', name: "NC" }, { pins: [12], label: 'NC', name: "NC" }, { pins: [13], label: 'NC', name: "NC" }],
}

export const H2_MINI_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","FSPIQ"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","FSPICS0","ADC1_CH0"], capabilities: ["gpio","adc1","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","FSPIWP","ADC1_CH1","MTMS"], capabilities: ["gpio","adc1","pwm","spi","jtag"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3","FSPIHD","ADC1_CH2","MTDO"], capabilities: ["gpio","adc1","pwm","spi","jtag"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 4, names: ["GPIO4","FSPICLK","ADC1_CH3","MTCK"], capabilities: ["gpio","adc1","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","FSPID","ADC1_CH4","MTDI"], capabilities: ["gpio","adc1","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10","ZCD0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ZCD1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","XTAL_32K_P"], capabilities: ["gpio","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 14, names: ["GPIO14","XTAL_32K_N"], capabilities: ["gpio","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23","FSPICS1","U0RXD"], capabilities: ["gpio","pwm","spi","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 24, names: ["GPIO24","FSPICS2","U0TXD"], capabilities: ["gpio","pwm","spi","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25","FSPICS3"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","FSPICS4","USB_D-"], capabilities: ["gpio","pwm","spi","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 27, names: ["GPIO27","FSPICS5","USB_D+"], capabilities: ["gpio","pwm","spi","usb"] as Capability[], constraints: [USB], isUsable: true },
]

export const H2_MINI_1_LAYOUT: PackageLayout = {
  name: 'ESP32-H2-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 0 }, { pinNumber: 10, gpio: 1 }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 13 }, { pinNumber: 13, gpio: 14 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, label: 'VBAT' }, { pinNumber: 16, gpio: 12 }, { pinNumber: 17, label: 'NC' }, { pinNumber: 18, gpio: 4 }, { pinNumber: 19, gpio: 5 }, { pinNumber: 20, gpio: 10 }, { pinNumber: 21, gpio: 11 }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, gpio: 22 }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 24 }, { pinNumber: 30, gpio: 23 }, { pinNumber: 29, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 27, gpio: 27 }, { pinNumber: 26, gpio: 26 }, { pinNumber: 25, gpio: 25 }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
  bodyMm: { w: 13.6, h: 17 },
  antennaMm: 6.25,
}

export const H2_MINI_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [8], label: 'EN', name: "EN" }, { pins: [10], gpio: 1, name: "GPIO1/FSPICS0/ADC1_CH0" }, { pins: [12], gpio: 13, name: "GPIO13/XTAL_32K_P" }, { pins: [13], gpio: 14, name: "GPIO14/XTAL_32K_N" }, { pins: [24], gpio: 22, name: "GPIO22" }, { pins: [25], gpio: 25, name: "GPIO25/FSPICS3" }, { pins: [17], label: 'NC', name: "NC" }, { pins: [28], label: 'NC', name: "NC" }, { pins: [29], label: 'NC', name: "NC" }, { pins: [32], label: 'NC', name: "NC" }, { pins: [33], label: 'NC', name: "NC" }, { pins: [34], label: 'NC', name: "NC" }, { pins: [35], label: 'NC', name: "NC" }, { pins: [4], label: 'NC', name: "NC" }, { pins: [7], label: 'NC', name: "NC" }],
  right: [{ pins: [9], gpio: 0, name: "GPIO0/FSPIQ" }, { pins: [31], gpio: 24, name: "GPIO24/FSPICS2/U0TXD" }, { pins: [30], gpio: 23, name: "GPIO23/FSPICS1/U0RXD" }, { pins: [27], gpio: 27, name: "GPIO27/FSPICS5/USB_D+" }, { pins: [26], gpio: 26, name: "GPIO26/FSPICS4/USB_D-" }, { pins: [5], gpio: 2, name: "GPIO2/FSPIWP/ADC1_CH1/MTMS" }, { pins: [6], gpio: 3, name: "GPIO3/FSPIHD/ADC1_CH2/MTDO" }, { pins: [18], gpio: 4, name: "GPIO4/FSPICLK/ADC1_CH3/MTCK" }, { pins: [19], gpio: 5, name: "GPIO5/FSPID/ADC1_CH4/MTDI" }, { pins: [20], gpio: 10, name: "GPIO10/ZCD0" }, { pins: [21], gpio: 11, name: "GPIO11/ZCD1" }, { pins: [22], gpio: 8, name: "GPIO8" }, { pins: [23], gpio: 9, name: "GPIO9" }, { pins: [16], gpio: 12, name: "GPIO12" }],
  bottom: [{ pins: [1,2,11,14,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53], label: 'GND', name: "GND" }],
  top: [{ pins: [3], label: '3V3', name: "3V3" }, { pins: [15], label: 'VBAT', name: "VBAT" }],
}

export const ESP8685_WROOM_06_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","ADC1_CH0","XTAL_32K_P"], capabilities: ["gpio","adc1","pwm","rtc"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH1","XTAL32K_N"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH2","FSPIQ"], capabilities: ["gpio","adc1","pwm","spi"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH3","LEDPWM"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH4","FSPIHD","MTMS","LEDPWM"], capabilities: ["gpio","adc1","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC2_CH0","FSPIP","MTDI","LEDPWM"], capabilities: ["gpio","adc2","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","FSPICLK","MTCK","LEDPWM"], capabilities: ["gpio","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","FSPID","MTDO","LEDPWM"], capabilities: ["gpio","pwm","spi","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10","FSPICS0"], capabilities: ["gpio","pwm","spi"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","USBD-"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","USBD+"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
]

export const ESP8685_WROOM_06_LAYOUT: PackageLayout = {
  name: 'ESP8685-WROOM-06',
  left: [{ pinNumber: 1, gpio: 1 }, { pinNumber: 2, gpio: 2 }, { pinNumber: 3, label: 'NC' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 0 }, { pinNumber: 6, gpio: 20 }, { pinNumber: 7, gpio: 21 }],
  bottom: [{ pinNumber: 8, gpio: 3 }, { pinNumber: 9, gpio: 7 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, gpio: 4 }, { pinNumber: 12, gpio: 5 }, { pinNumber: 13, label: 'GND' }, { pinNumber: 14, label: 'VDD33' }],
  right: [{ pinNumber: 21, gpio: 8 }, { pinNumber: 19, gpio: 10 }, { pinNumber: 18, label: 'CHIP_EN' }, { pinNumber: 17, label: 'NC' }, { pinNumber: 16, gpio: 19 }, { pinNumber: 15, gpio: 18 }],
  bodyMm: { w: 15.8, h: 20.3 },
  antennaMm: 6.1,
}

export const ESP8685_WROOM_06_SYMBOL: SymbolLayout = {
  left: [{ pins: [5], gpio: 0, name: "GPIO0/ADC1_CH0/XTAL_32K_P" }, { pins: [1], gpio: 1, name: "GPIO1/ADC1_CH1/XTAL32K_N" }, { pins: [2], gpio: 2, name: "GPIO2/ADC1_CH2/FSPIQ" }, { pins: [8], gpio: 3, name: "GPIO3/ADC1_CH3/LEDPWM" }, { pins: [11], gpio: 4, name: "GPIO4/ADC1_CH4/FSPIHD/MTMS/LEDPWM" }, { pins: [12], gpio: 5, name: "GPIO5/ADC2_CH0/FSPIP/MTDI/LEDPWM" }, { pins: [10], gpio: 6, name: "GPIO6/FSPICLK/MTCK/LEDPWM" }, { pins: [9], gpio: 7, name: "GPIO7/FSPID/MTDO/LEDPWM" }],
  right: [{ pins: [21], gpio: 8, name: "GPIO8" }, { pins: [20], gpio: 9, name: "GPIO9" }, { pins: [19], gpio: 10, name: "GPIO10/FSPICS0" }, { pins: [15], gpio: 18, name: "GPIO18/USBD-" }, { pins: [16], gpio: 19, name: "GPIO19/USBD+" }, { pins: [6], gpio: 20, name: "GPIO20/U0RXD" }, { pins: [7], gpio: 21, name: "GPIO21/U0TXD" }],
  bottom: [{ pins: [13], label: 'GND', name: "GND" }, { pins: [22], label: 'EPAD', name: "EPAD" }],
  top: [{ pins: [14], label: 'VDD33', name: "VDD33" }, { pins: [18], label: 'CHIP_EN', name: "CHIP_EN" }, { pins: [3], label: 'NC', name: "NC" }, { pins: [4], label: 'NC', name: "NC" }, { pins: [17], label: 'NC', name: "NC" }],
}

export const ESP8684_WROOM_02C_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const ESP8684_WROOM_02C_LAYOUT: PackageLayout = {
  name: 'ESP8684-WROOM-02C',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 4 }, { pinNumber: 4, gpio: 5 }, { pinNumber: 5, gpio: 6 }, { pinNumber: 6, gpio: 7 }, { pinNumber: 7, gpio: 8 }, { pinNumber: 8, gpio: 9 }, { pinNumber: 9, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 18, gpio: 0 }, { pinNumber: 17, gpio: 1 }, { pinNumber: 16, gpio: 2 }, { pinNumber: 15, gpio: 3 }, { pinNumber: 14, gpio: 18 }, { pinNumber: 13, label: 'NC' }, { pinNumber: 12, gpio: 20 }, { pinNumber: 11, gpio: 19 }, { pinNumber: 10, gpio: 10 }],
  bodyMm: { w: 19.6, h: 20.6 },
  antennaMm: 7.4,
}

export const ESP8684_WROOM_02C_SYMBOL: SymbolLayout = {
  left: [{ pins: [2], label: 'EN', name: "EN/CHIP_PU" }, { pins: [18], gpio: 0, name: "GPIO0" }, { pins: [17], gpio: 1, name: "GPIO1" }],
  right: [{ pins: [11], gpio: 19, name: "GPIO19" }, { pins: [12], gpio: 20, name: "GPIO20" }, { pins: [13], label: 'NC', name: "NC" }, { pins: [14], gpio: 18, name: "GPIO18" }, { pins: [16], gpio: 2, name: "GPIO2" }, { pins: [15], gpio: 3, name: "GPIO3" }, { pins: [3], gpio: 4, name: "GPIO4" }, { pins: [4], gpio: 5, name: "GPIO5" }, { pins: [5], gpio: 6, name: "GPIO6" }, { pins: [6], gpio: 7, name: "GPIO7" }, { pins: [7], gpio: 8, name: "GPIO8" }, { pins: [8], gpio: 9, name: "GPIO9" }, { pins: [10], gpio: 10, name: "GPIO10" }],
  bottom: [{ pins: [9,19], label: 'GND', name: "GND" }],
  top: [{ pins: [1], label: '3V3', name: "3V3" }],
}

export const ESP32_DEVKITC_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 1, names: ["GPIO1","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 3, names: ["GPIO3","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 6, names: ["GPIO6","SD_CLK"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 7, names: ["GPIO7","SD_DATA0"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 8, names: ["GPIO8","SD_DATA1"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 9, names: ["GPIO9","SD_DATA2"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 10, names: ["GPIO10","SD_DATA3"], capabilities: [] as Capability[], constraints: [FLASH], isUsable: false },
  { gpio: 12, names: ["GPIO12","MTDI","ADC2_CH5"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","MTCK","ADC2_CH4"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","MTMS","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","MTDO","ADC2_CH3"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25","DAC_1","ADC2_CH8"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 26, names: ["GPIO26","DAC_2","ADC2_CH9"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 27, names: ["GPIO27","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 32, names: ["GPIO32","32K_XP","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","32K_XN","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","VDET_1","ADC1_CH6"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 35, names: ["GPIO35","VDET_2","ADC1_CH7"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 36, names: ["GPIO36","SENSOR_VP","ADC1_CH0"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 39, names: ["GPIO39","SENSOR_VN","ADC1_CH3"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
]

export const ESP32_DEVKITC_LAYOUT: PackageLayout = {
  name: 'ESP32-DevKitC',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 36 }, { pinNumber: 4, gpio: 39 }, { pinNumber: 5, gpio: 34 }, { pinNumber: 6, gpio: 35 }, { pinNumber: 7, gpio: 32 }, { pinNumber: 8, gpio: 33 }, { pinNumber: 9, gpio: 25 }, { pinNumber: 10, gpio: 26 }, { pinNumber: 11, gpio: 27 }, { pinNumber: 12, gpio: 14 }, { pinNumber: 13, gpio: 12 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, gpio: 13 }, { pinNumber: 16, gpio: 9 }, { pinNumber: 17, gpio: 10 }, { pinNumber: 18, label: 'CMD' }, { pinNumber: 19, label: '5V' }],
  bottom: [],
  right: [{ pinNumber: 38, label: 'GND' }, { pinNumber: 37, gpio: 23 }, { pinNumber: 36, gpio: 22 }, { pinNumber: 35, gpio: 1 }, { pinNumber: 34, gpio: 3 }, { pinNumber: 33, gpio: 21 }, { pinNumber: 32, label: 'GND' }, { pinNumber: 31, gpio: 19 }, { pinNumber: 30, gpio: 18 }, { pinNumber: 29, gpio: 5 }, { pinNumber: 28, gpio: 17 }, { pinNumber: 27, gpio: 16 }, { pinNumber: 26, gpio: 4 }, { pinNumber: 25, gpio: 0 }, { pinNumber: 24, gpio: 2 }, { pinNumber: 23, gpio: 15 }, { pinNumber: 22, gpio: 8 }, { pinNumber: 21, gpio: 7 }, { pinNumber: 20, gpio: 6 }],
  bodyMm: { w: 27.9, h: 47.4 },
}

export const ESP32_DEVKITC_SYMBOL: SymbolLayout = {
  left: [{ pins: [2], label: 'EN', name: "CHIP_PU" }, { pins: [7], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [8], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [13], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [15], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [12], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }, { pins: [23], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [5], gpio: 34, name: "VDET_1/GPIO34/ADC1_CH6" }, { pins: [6], gpio: 35, name: "VDET_2/GPIO35/ADC1_CH7" }, { pins: [3], gpio: 36, name: "SENSOR_VP/GPIO36/ADC1_CH0" }, { pins: [4], gpio: 39, name: "SENSOR_VN/GPIO39/ADC1_CH3" }],
  right: [{ pins: [35], gpio: 1, name: "U0TXD/GPIO1" }, { pins: [34], gpio: 3, name: "U0RXD/GPIO3" }, { pins: [25], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [24], gpio: 2, name: "ADC2_CH2/GPIO2" }, { pins: [26], gpio: 4, name: "ADC2_CH0/GPIO4" }, { pins: [29], gpio: 5, name: "GPIO5" }, { pins: [30], gpio: 18, name: "GPIO18" }, { pins: [31], gpio: 19, name: "GPIO19" }, { pins: [33], gpio: 21, name: "GPIO21" }, { pins: [36], gpio: 22, name: "GPIO22" }, { pins: [37], gpio: 23, name: "GPIO23" }, { pins: [9], gpio: 25, name: "DAC_1/ADC2_CH8/GPIO25" }, { pins: [10], gpio: 26, name: "DAC_2/ADC2_CH9/GPIO26" }, { pins: [11], gpio: 27, name: "ADC2_CH7/GPIO27" }, { pins: [20], gpio: 6, name: "SD_CLK/GPIO6" }, { pins: [21], gpio: 7, name: "SD_DATA0/GPIO7" }, { pins: [22], gpio: 8, name: "SD_DATA1/GPIO8" }, { pins: [16], gpio: 9, name: "SD_DATA2/GPIO9" }, { pins: [17], gpio: 10, name: "SD_DATA3/GPIO10" }, { pins: [18], label: 'CMD', name: "CMD" }, { pins: [27], gpio: 16, name: "GPIO16" }, { pins: [28], gpio: 17, name: "GPIO17" }],
  bottom: [{ pins: [14,32,38], label: 'GND', name: "GND" }],
  top: [{ pins: [19], label: '5V', name: "5V" }, { pins: [1], label: '3V3', name: "3V3" }],
}

export const ESP32_DEVKITM_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0","BOOT","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 1, names: ["GPIO1","U0TX"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO25","DAC_1","GPIO2_CH8"], capabilities: ["gpio","dac","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3","U0RX"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9","SD_DATA2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","SD_DATA3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","MTDI","ADC2_CH5"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","MTCK","ADC2_CH4"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","MTMS","ADC2_CH6"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","MTDO","ADC2_CH3"], capabilities: ["gpio","adc2","pwm","jtag"] as Capability[], constraints: [STRAP, ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 26, names: ["GPIO26","DAC_2","ADC2_CH9"], capabilities: ["gpio","adc2","dac","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 27, names: ["GPIO27","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 32, names: ["GPIO32","32K_XP","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33","32K_XN","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34","ADC1_CH6"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 35, names: ["GPIO35","ADC1_CH7"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 36, names: ["GPIO36","ADC1_CH0"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 37, names: ["GPIO37","ADC1_CH1"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 38, names: ["GPIO38","ADC1_CH2"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
  { gpio: 39, names: ["GPIO39","ADC1_CH3"], capabilities: ["gpio","adc1"] as Capability[], constraints: [INPUT_ONLY], isUsable: true },
]

export const ESP32_DEVKITM_1_LAYOUT: PackageLayout = {
  name: 'ESP32-DevKitM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, gpio: 36 }, { pinNumber: 4, gpio: 37 }, { pinNumber: 5, gpio: 38 }, { pinNumber: 6, gpio: 39 }, { pinNumber: 7, label: 'EN' }, { pinNumber: 8, gpio: 34 }, { pinNumber: 9, gpio: 35 }, { pinNumber: 10, gpio: 32 }, { pinNumber: 11, gpio: 33 }, { pinNumber: 12, gpio: 2 }, { pinNumber: 13, gpio: 26 }, { pinNumber: 14, gpio: 27 }, { pinNumber: 15, gpio: 14 }, { pinNumber: 16, label: '5V' }, { pinNumber: 17, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 34, label: 'GND' }, { pinNumber: 33, gpio: 3 }, { pinNumber: 32, gpio: 1 }, { pinNumber: 31, gpio: 21 }, { pinNumber: 30, gpio: 22 }, { pinNumber: 29, gpio: 19 }, { pinNumber: 28, gpio: 23 }, { pinNumber: 27, gpio: 18 }, { pinNumber: 26, gpio: 5 }, { pinNumber: 25, gpio: 10 }, { pinNumber: 24, gpio: 9 }, { pinNumber: 23, gpio: 4 }, { pinNumber: 22, gpio: 0 }, { pinNumber: 21, gpio: 2 }, { pinNumber: 20, gpio: 15 }, { pinNumber: 19, gpio: 13 }, { pinNumber: 18, gpio: 12 }],
  bodyMm: { w: 25.4, h: 43.8 },
}

export const ESP32_DEVKITM_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], gpio: 36, name: "GPIO36/ADC1_CH0" }, { pins: [4], gpio: 37, name: "GPIO37/ADC1_CH1" }, { pins: [5], gpio: 38, name: "GPIO38/ADC1_CH2" }, { pins: [6], gpio: 39, name: "GPIO39/ADC1_CH3" }, { pins: [7], label: 'EN', name: "RST" }, { pins: [8], gpio: 34, name: "GPIO34/ADC1_CH6" }, { pins: [9], gpio: 35, name: "GPIO35/ADC1_CH7" }, { pins: [10], gpio: 32, name: "32K_XP/GPIO32/ADC1_CH4" }, { pins: [11], gpio: 33, name: "32K_XN/GPIO33/ADC1_CH5" }, { pins: [12], gpio: 2, name: "DAC_1/GPIO2_CH8/GPIO25" }, { pins: [13], gpio: 26, name: "DAC_2/ADC2_CH9/GPIO26" }, { pins: [18], gpio: 12, name: "MTDI/GPIO12/ADC2_CH5" }, { pins: [19], gpio: 13, name: "MTCK/GPIO13/ADC2_CH4" }, { pins: [20], gpio: 15, name: "MTDO/GPIO15/ADC2_CH3" }, { pins: [15], gpio: 14, name: "MTMS/GPIO14/ADC2_CH6" }],
  right: [{ pins: [33], gpio: 3, name: "U0RX/GPIO3" }, { pins: [32], gpio: 1, name: "U0TX/GPIO1" }, { pins: [22], gpio: 0, name: "GPIO0/BOOT/ADC2_CH1" }, { pins: [21], gpio: 2, name: "ADC2_CH2/GPIO2" }, { pins: [23], gpio: 4, name: "ADC2_CH0/GPIO4" }, { pins: [24], gpio: 9, name: "SD_DATA2/GPIO9" }, { pins: [25], gpio: 10, name: "SD_DATA3/GPIO10" }, { pins: [26], gpio: 5, name: "GPIO5" }, { pins: [27], gpio: 18, name: "GPIO18" }, { pins: [28], gpio: 23, name: "GPIO23" }, { pins: [29], gpio: 19, name: "GPIO19" }, { pins: [31], gpio: 21, name: "GPIO21" }, { pins: [30], gpio: 22, name: "GPIO22" }, { pins: [14], gpio: 27, name: "ADC2_CH7/GPIO27" }],
  bottom: [{ pins: [1,17,34], label: 'GND', name: "GND" }],
  top: [{ pins: [16], label: '5V', name: "5V" }, { pins: [2], label: '3V3', name: "3V3" }],
}

export const S2_DEVKITC_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH0"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH1"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","ADC1_CH6"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","ADC1_CH7"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","ADC1_CH8"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","ADC1_CH9"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 12, names: ["GPIO12","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 13, names: ["GPIO13","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 14, names: ["GPIO14","ADC2_CH3"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 15, names: ["GPIO15","ADC2_CH4","32K_P"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 16, names: ["GPIO16","ADC2_CH5","32K_N"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 17, names: ["GPIO17","ADC2_CH6","U1TXD"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 18, names: ["GPIO18","ADC2_CH7","U1RXD"], capabilities: ["gpio","adc2","pwm","uart"] as Capability[], constraints: [ADC2_WIFI], isUsable: true },
  { gpio: 19, names: ["GPIO19","ADC2_CH8","USB_D-"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","ADC2_CH9","USB_D+"], capabilities: ["gpio","adc2","pwm","usb"] as Capability[], constraints: [ADC2_WIFI, USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 33, names: ["GPIO33"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 34, names: ["GPIO34"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 36, names: ["GPIO36"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 37, names: ["GPIO37"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 38, names: ["GPIO38"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio"] as Capability[], constraints: [INPUT_ONLY, STRAP], isUsable: true },
]

export const S2_DEVKITC_1_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-DevKitC-1',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 3 }, { pinNumber: 14, gpio: 46 }, { pinNumber: 15, gpio: 9 }, { pinNumber: 16, gpio: 10 }, { pinNumber: 17, gpio: 11 }, { pinNumber: 18, gpio: 12 }, { pinNumber: 19, gpio: 13 }, { pinNumber: 20, gpio: 14 }, { pinNumber: 21, label: '5V' }, { pinNumber: 22, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 44, label: 'GND' }, { pinNumber: 43, gpio: 43 }, { pinNumber: 42, gpio: 44 }, { pinNumber: 41, gpio: 1 }, { pinNumber: 40, gpio: 2 }, { pinNumber: 39, gpio: 42 }, { pinNumber: 38, gpio: 41 }, { pinNumber: 37, gpio: 40 }, { pinNumber: 36, gpio: 39 }, { pinNumber: 35, gpio: 38 }, { pinNumber: 34, gpio: 37 }, { pinNumber: 33, gpio: 36 }, { pinNumber: 32, gpio: 35 }, { pinNumber: 31, gpio: 0 }, { pinNumber: 30, gpio: 45 }, { pinNumber: 29, gpio: 34 }, { pinNumber: 28, gpio: 33 }, { pinNumber: 27, gpio: 21 }, { pinNumber: 26, gpio: 20 }, { pinNumber: 25, gpio: 19 }, { pinNumber: 24, label: 'GND' }, { pinNumber: 23, label: 'GND' }],
  bodyMm: { w: 25.4, h: 63.4 },
}

export const S2_DEVKITC_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [1], label: '3V3', name: "3V3" }, { pins: [2], label: '3V3', name: "3V3" }, { pins: [3], label: 'EN', name: "RST" }, { pins: [4], gpio: 4, name: "GPIO4/ADC1_CH3" }, { pins: [5], gpio: 5, name: "GPIO5/ADC1_CH4" }, { pins: [6], gpio: 6, name: "GPIO6/ADC1_CH5" }, { pins: [7], gpio: 7, name: "GPIO7/ADC1_CH6" }, { pins: [8], gpio: 15, name: "GPIO15/ADC2_CH4/32K_P" }, { pins: [9], gpio: 16, name: "GPIO16/ADC2_CH5/32K_N" }, { pins: [10], gpio: 17, name: "GPIO17/ADC2_CH6/U1TXD" }, { pins: [11], gpio: 18, name: "GPIO18/ADC2_CH7/U1RXD" }, { pins: [12], gpio: 8, name: "GPIO8/ADC1_CH7" }, { pins: [13], gpio: 3, name: "GPIO3/ADC1_CH2" }, { pins: [14], gpio: 46, name: "GPIO46" }, { pins: [15], gpio: 9, name: "GPIO9/ADC1_CH8" }, { pins: [16], gpio: 10, name: "GPIO10/ADC1_CH9" }, { pins: [17], gpio: 11, name: "GPIO11/ADC2_CH0" }, { pins: [18], gpio: 12, name: "GPIO12/ADC2_CH1" }, { pins: [19], gpio: 13, name: "GPIO13/ADC2_CH2" }, { pins: [20], gpio: 14, name: "GPIO14/ADC2_CH3" }, { pins: [21], label: '5V', name: "5V" }, { pins: [22], label: 'GND', name: "GND" }],
  right: [{ pins: [44], label: 'GND', name: "GND" }, { pins: [43], gpio: 43, name: "GPIO43/U0TXD" }, { pins: [42], gpio: 44, name: "GPIO44/U0RXD" }, { pins: [41], gpio: 1, name: "GPIO1/ADC1_CH0" }, { pins: [40], gpio: 2, name: "GPIO2/ADC1_CH1" }, { pins: [39], gpio: 42, name: "GPIO42/MTMS" }, { pins: [38], gpio: 41, name: "GPIO41/MTDI" }, { pins: [37], gpio: 40, name: "GPIO40/MTDO" }, { pins: [36], gpio: 39, name: "GPIO39/MTCK" }, { pins: [35], gpio: 38, name: "GPIO38" }, { pins: [34], gpio: 37, name: "GPIO37" }, { pins: [33], gpio: 36, name: "GPIO36" }, { pins: [32], gpio: 35, name: "GPIO35" }, { pins: [31], gpio: 0, name: "GPIO0" }, { pins: [30], gpio: 45, name: "GPIO45" }, { pins: [29], gpio: 34, name: "GPIO34" }, { pins: [28], gpio: 33, name: "GPIO33" }, { pins: [27], gpio: 21, name: "GPIO21" }, { pins: [26], gpio: 20, name: "GPIO20/ADC2_CH9/USB_D+" }, { pins: [25], gpio: 19, name: "GPIO19/ADC2_CH8/USB_D-" }, { pins: [24], label: 'GND', name: "GND" }, { pins: [23], label: 'GND', name: "GND" }],
}

export const S3_DEVKITC_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 1, names: ["GPIO1","ADC1_CH0"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","ADC1_CH1"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","ADC1_CH2"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 4, names: ["GPIO4","ADC1_CH3"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","ADC1_CH4"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6","ADC1_CH5"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7","ADC1_CH6"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","ADC1_CH7"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9","ADC1_CH8"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10","ADC1_CH9"], capabilities: ["gpio","adc1","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","ADC2_CH0"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","ADC2_CH1"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","ADC2_CH2"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 14, names: ["GPIO14","ADC2_CH3"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15","ADC2_CH4","32K_P"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 16, names: ["GPIO16","ADC2_CH5","32K_N"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","ADC2_CH6"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","ADC2_CH7"], capabilities: ["gpio","adc2","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 35, names: ["GPIO35"], capabilities: ["gpio","pwm"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 36, names: ["GPIO36"], capabilities: ["gpio","pwm"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 37, names: ["GPIO37"], capabilities: ["gpio","pwm"] as Capability[], constraints: [OSPI], isUsable: true },
  { gpio: 38, names: ["GPIO38"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 39, names: ["GPIO39","MTCK"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 40, names: ["GPIO40","MTDO"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 41, names: ["GPIO41","MTDI"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 42, names: ["GPIO42","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 43, names: ["GPIO43","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 44, names: ["GPIO44","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 45, names: ["GPIO45"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 46, names: ["GPIO46"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 47, names: ["GPIO47"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 48, names: ["GPIO48"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const S3_DEVKITC_LAYOUT: PackageLayout = {
  name: 'ESP32-S3-DevKitC-1',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 3 }, { pinNumber: 14, gpio: 46 }, { pinNumber: 15, gpio: 9 }, { pinNumber: 16, gpio: 10 }, { pinNumber: 17, gpio: 11 }, { pinNumber: 18, gpio: 12 }, { pinNumber: 19, gpio: 13 }, { pinNumber: 20, gpio: 14 }, { pinNumber: 21, label: '5V' }, { pinNumber: 22, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 44, label: 'GND' }, { pinNumber: 43, gpio: 43 }, { pinNumber: 42, gpio: 44 }, { pinNumber: 41, gpio: 1 }, { pinNumber: 40, gpio: 2 }, { pinNumber: 39, gpio: 42 }, { pinNumber: 38, gpio: 41 }, { pinNumber: 37, gpio: 40 }, { pinNumber: 36, gpio: 39 }, { pinNumber: 35, gpio: 38 }, { pinNumber: 34, gpio: 37 }, { pinNumber: 33, gpio: 36 }, { pinNumber: 32, gpio: 35 }, { pinNumber: 31, gpio: 0 }, { pinNumber: 30, gpio: 45 }, { pinNumber: 29, gpio: 48 }, { pinNumber: 28, gpio: 47 }, { pinNumber: 27, gpio: 21 }, { pinNumber: 26, gpio: 20 }, { pinNumber: 25, gpio: 19 }, { pinNumber: 24, label: 'GND' }, { pinNumber: 23, label: 'GND' }],
  bodyMm: { w: 25.4, h: 63.4 },
}

export const S3_DEVKITC_SYMBOL: SymbolLayout = {
  left: [{ pins: [3], label: 'EN', name: "CHIP_PU" }, { pins: [8], gpio: 15, name: "GPIO15/ADC2_CH4/32K_P" }, { pins: [9], gpio: 16, name: "GPIO16/ADC2_CH5/32K_N" }, { pins: [36], gpio: 39, name: "GPIO39/MTCK" }, { pins: [37], gpio: 40, name: "GPIO40/MTDO" }, { pins: [38], gpio: 41, name: "GPIO41/MTDI" }, { pins: [39], gpio: 42, name: "GPIO42/MTMS" }],
  right: [{ pins: [43], gpio: 43, name: "GPIO43/U0TXD" }, { pins: [42], gpio: 44, name: "GPIO44/U0RXD" }, { pins: [26], gpio: 20, name: "GPIO20/USB_D+" }, { pins: [25], gpio: 19, name: "GPIO19/USB_D-" }, { pins: [31], gpio: 0, name: "GPIO0" }, { pins: [41], gpio: 1, name: "GPIO1/ADC1_CH0" }, { pins: [40], gpio: 2, name: "GPIO2/ADC1_CH1" }, { pins: [13], gpio: 3, name: "GPIO3/ADC1_CH2" }, { pins: [4], gpio: 4, name: "GPIO4/ADC1_CH3" }, { pins: [5], gpio: 5, name: "GPIO5/ADC1_CH4" }, { pins: [6], gpio: 6, name: "GPIO6/ADC1_CH5" }, { pins: [7], gpio: 7, name: "GPIO7/ADC1_CH6" }, { pins: [12], gpio: 8, name: "GPIO8/ADC1_CH7" }, { pins: [15], gpio: 9, name: "GPIO9/ADC1_CH8" }, { pins: [16], gpio: 10, name: "GPIO10/ADC1_CH9" }, { pins: [17], gpio: 11, name: "GPIO11/ADC2_CH0" }, { pins: [18], gpio: 12, name: "GPIO12/ADC2_CH1" }, { pins: [19], gpio: 13, name: "GPIO13/ADC2_CH2" }, { pins: [20], gpio: 14, name: "GPIO14/ADC2_CH3" }, { pins: [10], gpio: 17, name: "GPIO17/ADC2_CH6" }, { pins: [11], gpio: 18, name: "GPIO18/ADC2_CH7" }, { pins: [27], gpio: 21, name: "GPIO21" }, { pins: [32], gpio: 35, name: "GPIO35" }, { pins: [33], gpio: 36, name: "GPIO36" }, { pins: [34], gpio: 37, name: "GPIO37" }, { pins: [35], gpio: 38, name: "GPIO38" }, { pins: [30], gpio: 45, name: "GPIO45" }, { pins: [14], gpio: 46, name: "GPIO46" }, { pins: [28], gpio: 47, name: "GPIO47" }, { pins: [29], gpio: 48, name: "GPIO48" }],
  bottom: [{ pins: [22,23,24,44], label: 'GND', name: "GND" }],
  top: [{ pins: [21], label: '5V', name: "5V" }, { pins: [1,2], label: '3V3', name: "3V3" }],
}

export const C3_DEVKITM_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 19, names: ["GPIO19","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 20, names: ["GPIO20","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
]

export const C3_DEVKITM_LAYOUT: PackageLayout = {
  name: 'ESP32-C3-DevKitM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, gpio: 2 }, { pinNumber: 5, gpio: 3 }, { pinNumber: 6, label: 'GND' }, { pinNumber: 7, label: 'EN' }, { pinNumber: 8, label: 'GND' }, { pinNumber: 9, gpio: 0 }, { pinNumber: 10, gpio: 1 }, { pinNumber: 11, gpio: 10 }, { pinNumber: 12, label: 'GND' }, { pinNumber: 13, label: '5V' }, { pinNumber: 14, label: '5V' }, { pinNumber: 15, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 30, label: 'GND' }, { pinNumber: 29, gpio: 21 }, { pinNumber: 28, gpio: 20 }, { pinNumber: 27, label: 'GND' }, { pinNumber: 26, gpio: 9 }, { pinNumber: 25, gpio: 8 }, { pinNumber: 24, label: 'GND' }, { pinNumber: 23, gpio: 7 }, { pinNumber: 22, gpio: 6 }, { pinNumber: 21, gpio: 5 }, { pinNumber: 20, gpio: 4 }, { pinNumber: 19, label: 'GND' }, { pinNumber: 18, gpio: 18 }, { pinNumber: 17, gpio: 19 }, { pinNumber: 16, label: 'GND' }],
  bodyMm: { w: 25.4, h: 38.9 },
}

export const C3_DEVKITM_SYMBOL: SymbolLayout = {
  left: [{ pins: [7], label: 'EN', name: "RST" }, { pins: [9], gpio: 0, name: "GPIO0" }, { pins: [10], gpio: 1, name: "GPIO1" }, { pins: [4], gpio: 2, name: "GPIO2" }, { pins: [5], gpio: 3, name: "GPIO3" }, { pins: [20], gpio: 4, name: "GPIO4" }],
  right: [{ pins: [28], gpio: 20, name: "GPIO20/U0RXD" }, { pins: [29], gpio: 21, name: "GPIO21/U0TXD" }, { pins: [18], gpio: 18, name: "GPIO18/USB_D+" }, { pins: [17], gpio: 19, name: "GPIO19/USB_D-" }, { pins: [21], gpio: 5, name: "GPIO5" }, { pins: [22], gpio: 6, name: "GPIO6" }, { pins: [23], gpio: 7, name: "GPIO7" }, { pins: [25], gpio: 8, name: "GPIO8" }, { pins: [26], gpio: 9, name: "GPIO9" }, { pins: [11], gpio: 10, name: "GPIO10" }],
  bottom: [{ pins: [1,6,8,12,15,16,19,24,27,30], label: 'GND', name: "GND" }],
  top: [{ pins: [2,3], label: '3V3', name: "3V3" }, { pins: [13,14], label: '5V', name: "5V" }],
}

export const C3_DEVKITC_02_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","RGB_LED"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18","USBD_-"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19","USBD_+"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
]

export const C3_DEVKITC_02_LAYOUT: PackageLayout = {
  name: 'ESP32-C3-DevKitC-02',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'EN' }, { pinNumber: 5, label: 'GND' }, { pinNumber: 6, gpio: 4 }, { pinNumber: 7, gpio: 5 }, { pinNumber: 8, gpio: 6 }, { pinNumber: 9, gpio: 7 }, { pinNumber: 10, label: 'GND' }, { pinNumber: 11, gpio: 8 }, { pinNumber: 12, gpio: 9 }, { pinNumber: 13, label: '5V' }, { pinNumber: 14, label: '5V' }, { pinNumber: 15, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 30, label: 'GND' }, { pinNumber: 29, gpio: 0 }, { pinNumber: 28, gpio: 1 }, { pinNumber: 27, gpio: 2 }, { pinNumber: 26, gpio: 3 }, { pinNumber: 25, label: 'GND' }, { pinNumber: 24, gpio: 10 }, { pinNumber: 23, label: 'GND' }, { pinNumber: 22, gpio: 20 }, { pinNumber: 21, gpio: 21 }, { pinNumber: 20, label: 'GND' }, { pinNumber: 19, gpio: 18 }, { pinNumber: 18, gpio: 19 }, { pinNumber: 17, label: 'GND' }, { pinNumber: 16, label: 'GND' }],
  bodyMm: { w: 25.4, h: 38.9 },
}

export const C3_DEVKITC_02_SYMBOL: SymbolLayout = {
  left: [{ pins: [4], label: 'EN', name: "RST" }, { pins: [29], gpio: 0, name: "GPIO0" }, { pins: [28], gpio: 1, name: "GPIO1" }, { pins: [27], gpio: 2, name: "GPIO2" }, { pins: [26], gpio: 3, name: "GPIO3" }, { pins: [6], gpio: 4, name: "GPIO4" }, { pins: [7], gpio: 5, name: "GPIO5" }, { pins: [8], gpio: 6, name: "GPIO6" }, { pins: [9], gpio: 7, name: "GPIO7" }],
  right: [{ pins: [11], gpio: 8, name: "GPIO8/RGB_LED" }, { pins: [12], gpio: 9, name: "GPIO9" }, { pins: [24], gpio: 10, name: "GPIO10" }, { pins: [18], gpio: 19, name: "GPIO19/USBD_+" }, { pins: [19], gpio: 18, name: "GPIO18/USBD_-" }, { pins: [22], gpio: 20, name: "GPIO20/U0RXD" }, { pins: [21], gpio: 21, name: "GPIO21/U0TXD" }],
  bottom: [{ pins: [1,5,10,15,16,17,20,23,25,30], label: 'GND', name: "GND" }],
  top: [{ pins: [2,3], label: '3V3', name: "3V3" }, { pins: [13,14], label: '5V', name: "5V" }],
}

export const C6_DEVKITC_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","MTDI"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 15, names: ["GPIO15","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const C6_DEVKITC_LAYOUT: PackageLayout = {
  name: 'ESP32-C6-DevKitC-1',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 4 }, { pinNumber: 4, gpio: 5 }, { pinNumber: 5, gpio: 6 }, { pinNumber: 6, gpio: 7 }, { pinNumber: 7, gpio: 0 }, { pinNumber: 8, gpio: 1 }, { pinNumber: 9, gpio: 8 }, { pinNumber: 10, gpio: 10 }, { pinNumber: 11, gpio: 11 }, { pinNumber: 12, gpio: 2 }, { pinNumber: 13, gpio: 3 }, { pinNumber: 14, label: '5V' }, { pinNumber: 15, label: 'GND' }, { pinNumber: 16, label: 'NC' }],
  bottom: [],
  right: [{ pinNumber: 32, label: 'GND' }, { pinNumber: 31, gpio: 16 }, { pinNumber: 30, gpio: 17 }, { pinNumber: 29, gpio: 15 }, { pinNumber: 28, gpio: 23 }, { pinNumber: 27, gpio: 22 }, { pinNumber: 26, gpio: 21 }, { pinNumber: 25, gpio: 20 }, { pinNumber: 24, gpio: 19 }, { pinNumber: 23, gpio: 18 }, { pinNumber: 22, gpio: 9 }, { pinNumber: 21, label: 'GND' }, { pinNumber: 20, gpio: 13 }, { pinNumber: 19, gpio: 12 }, { pinNumber: 18, label: 'GND' }, { pinNumber: 17, label: 'NC' }],
  bodyMm: { w: 25.4, h: 51.3 },
}

export const C6_DEVKITC_SYMBOL: SymbolLayout = {
  left: [{ pins: [1], label: '3V3', name: "3V3" }, { pins: [2], label: 'EN', name: "EN/RESET" }, { pins: [3], gpio: 4, name: "GPIO4/MTMS" }, { pins: [4], gpio: 5, name: "GPIO5/MTDI" }, { pins: [5], gpio: 6, name: "GPIO6" }, { pins: [6], gpio: 7, name: "GPIO7" }, { pins: [7], gpio: 0, name: "GPIO0" }, { pins: [8], gpio: 1, name: "GPIO1" }, { pins: [9], gpio: 8, name: "GPIO8/BOOT" }, { pins: [10], gpio: 10, name: "GPIO10" }, { pins: [11], gpio: 11, name: "GPIO11" }, { pins: [12], gpio: 2, name: "GPIO2" }, { pins: [13], gpio: 3, name: "GPIO3" }, { pins: [14], label: '5V', name: "5V" }, { pins: [15], label: 'GND', name: "GND" }, { pins: [16], label: 'NC', name: "NC" }],
  right: [{ pins: [32], label: 'GND', name: "GND" }, { pins: [31], gpio: 16, name: "GPIO16/U0TXD" }, { pins: [30], gpio: 17, name: "GPIO17/U0RXD" }, { pins: [29], gpio: 15, name: "GPIO15/JTAG" }, { pins: [28], gpio: 23, name: "GPIO23" }, { pins: [27], gpio: 22, name: "GPIO22" }, { pins: [26], gpio: 21, name: "GPIO21" }, { pins: [25], gpio: 20, name: "GPIO20" }, { pins: [24], gpio: 19, name: "GPIO19" }, { pins: [23], gpio: 18, name: "GPIO18" }, { pins: [22], gpio: 9, name: "GPIO9/BOOT" }, { pins: [21], label: 'GND', name: "GND" }, { pins: [20], gpio: 13, name: "GPIO13/USB_D+" }, { pins: [19], gpio: 12, name: "GPIO12/USB_D-" }, { pins: [18], label: 'GND', name: "GND" }, { pins: [17], label: 'NC', name: "NC" }],
}

export const C6_DEVKITM_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","MTDI"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 8, names: ["GPIO8","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 9, names: ["GPIO9","BOOT"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 12, names: ["GPIO12","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 14, names: ["GPIO14"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 15, names: ["GPIO15","JTAG"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 16, names: ["GPIO16","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 17, names: ["GPIO17","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 18, names: ["GPIO18"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 19, names: ["GPIO19"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 20, names: ["GPIO20"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 21, names: ["GPIO21"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 22, names: ["GPIO22"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
]

export const C6_DEVKITM_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C6-DevKitM-1',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 2 }, { pinNumber: 4, gpio: 3 }, { pinNumber: 5, gpio: 4 }, { pinNumber: 6, gpio: 5 }, { pinNumber: 7, gpio: 0 }, { pinNumber: 8, gpio: 1 }, { pinNumber: 9, gpio: 8 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, gpio: 7 }, { pinNumber: 12, gpio: 14 }, { pinNumber: 13, label: 'GND' }, { pinNumber: 14, label: '5V' }, { pinNumber: 15, label: 'GND' }],
  bottom: [],
  right: [{ pinNumber: 30, label: 'GND' }, { pinNumber: 29, gpio: 16 }, { pinNumber: 28, gpio: 17 }, { pinNumber: 27, gpio: 23 }, { pinNumber: 26, gpio: 22 }, { pinNumber: 25, gpio: 21 }, { pinNumber: 24, gpio: 20 }, { pinNumber: 23, gpio: 19 }, { pinNumber: 22, gpio: 18 }, { pinNumber: 21, gpio: 15 }, { pinNumber: 20, gpio: 9 }, { pinNumber: 19, label: 'GND' }, { pinNumber: 18, gpio: 13 }, { pinNumber: 17, gpio: 12 }, { pinNumber: 16, label: 'GND' }],
  bodyMm: { w: 25.1, h: 47.9 },
}

export const C6_DEVKITM_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [1], label: '3V3', name: "3V3" }, { pins: [2], label: 'EN', name: "EN/RESET" }, { pins: [3], gpio: 2, name: "GPIO2" }, { pins: [4], gpio: 3, name: "GPIO3" }, { pins: [5], gpio: 4, name: "GPIO4/MTMS" }, { pins: [6], gpio: 5, name: "GPIO5/MTDI" }, { pins: [7], gpio: 0, name: "GPIO0" }, { pins: [8], gpio: 1, name: "GPIO1" }, { pins: [9], gpio: 8, name: "GPIO8/BOOT" }, { pins: [10], gpio: 6, name: "GPIO6" }, { pins: [11], gpio: 7, name: "GPIO7" }, { pins: [12], gpio: 14, name: "GPIO14" }, { pins: [13], label: 'GND', name: "GND" }, { pins: [14], label: '5V', name: "5V" }, { pins: [15], label: 'GND', name: "GND" }],
  right: [{ pins: [30], label: 'GND', name: "GND" }, { pins: [29], gpio: 16, name: "GPIO16/U0TXD" }, { pins: [28], gpio: 17, name: "GPIO17/U0RXD" }, { pins: [27], gpio: 23, name: "GPIO23" }, { pins: [26], gpio: 22, name: "GPIO22" }, { pins: [25], gpio: 21, name: "GPIO21" }, { pins: [24], gpio: 20, name: "GPIO20" }, { pins: [23], gpio: 19, name: "GPIO19" }, { pins: [22], gpio: 18, name: "GPIO18" }, { pins: [21], gpio: 15, name: "GPIO15/JTAG" }, { pins: [20], gpio: 9, name: "GPIO9/BOOT" }, { pins: [19], label: 'GND', name: "GND" }, { pins: [18], gpio: 13, name: "GPIO13/USB_D+" }, { pins: [17], gpio: 12, name: "GPIO12/USB_D-" }, { pins: [16], label: 'GND', name: "GND" }],
}

export const C5_DEVKITC_1_PINS: Pin[] = [
  { gpio: 0, names: ["GPIO0"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 1, names: ["GPIO1"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 2, names: ["GPIO2","MTMS"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 3, names: ["GPIO3","MTDI"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 4, names: ["GPIO4","MTCK"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 5, names: ["GPIO5","MTDO"], capabilities: ["gpio","pwm","jtag"] as Capability[], constraints: [], isUsable: true },
  { gpio: 6, names: ["GPIO6"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 7, names: ["GPIO7"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 8, names: ["GPIO8"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 9, names: ["GPIO9"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 10, names: ["GPIO10"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 11, names: ["GPIO11","U0TXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 12, names: ["GPIO12","U0RXD"], capabilities: ["gpio","pwm","uart"] as Capability[], constraints: [], isUsable: true },
  { gpio: 13, names: ["GPIO13","USB_D-"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 14, names: ["GPIO14","USB_D+"], capabilities: ["gpio","pwm","usb"] as Capability[], constraints: [USB], isUsable: true },
  { gpio: 15, names: ["GPIO15"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 23, names: ["GPIO23"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 24, names: ["GPIO24"], capabilities: ["gpio","pwm"] as Capability[], constraints: [], isUsable: true },
  { gpio: 25, names: ["GPIO25"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 26, names: ["GPIO26"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 27, names: ["GPIO27"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
  { gpio: 28, names: ["GPIO28"], capabilities: ["gpio","pwm"] as Capability[], constraints: [STRAP], isUsable: true },
]

export const C5_DEVKITC_1_LAYOUT: PackageLayout = {
  name: 'ESP32-C5-DevKitC-1',
  left: [{ pinNumber: 1, label: '3V3' }, { pinNumber: 2, label: 'EN' }, { pinNumber: 3, gpio: 2 }, { pinNumber: 4, gpio: 3 }, { pinNumber: 5, gpio: 4 }, { pinNumber: 6, gpio: 5 }, { pinNumber: 7, gpio: 0 }, { pinNumber: 8, gpio: 1 }, { pinNumber: 9, gpio: 27 }, { pinNumber: 10, gpio: 6 }, { pinNumber: 11, gpio: 7 }, { pinNumber: 12, gpio: 26 }, { pinNumber: 13, gpio: 25 }, { pinNumber: 14, label: '5V' }, { pinNumber: 15, label: 'GND' }, { pinNumber: 16, label: 'NC' }],
  bottom: [],
  right: [{ pinNumber: 32, label: 'GND' }, { pinNumber: 31, gpio: 11 }, { pinNumber: 30, gpio: 12 }, { pinNumber: 29, gpio: 24 }, { pinNumber: 28, gpio: 23 }, { pinNumber: 27, gpio: 15 }, { pinNumber: 26, gpio: 10 }, { pinNumber: 25, gpio: 9 }, { pinNumber: 24, gpio: 8 }, { pinNumber: 23, label: 'NC' }, { pinNumber: 22, gpio: 28 }, { pinNumber: 21, label: 'GND' }, { pinNumber: 20, gpio: 14 }, { pinNumber: 19, gpio: 13 }, { pinNumber: 18, label: 'GND' }, { pinNumber: 17, label: 'NC' }],
  bodyMm: { w: 25.4, h: 53.3 },
}

export const C5_DEVKITC_1_SYMBOL: SymbolLayout = {
  left: [{ pins: [1], label: '3V3', name: "3V3" }, { pins: [2], label: 'EN', name: "EN/RESET" }, { pins: [3], gpio: 2, name: "GPIO2/MTMS" }, { pins: [4], gpio: 3, name: "GPIO3/MTDI" }, { pins: [5], gpio: 4, name: "GPIO4/MTCK" }, { pins: [6], gpio: 5, name: "GPIO5/MTDO" }, { pins: [7], gpio: 0, name: "GPIO0" }, { pins: [8], gpio: 1, name: "GPIO1" }, { pins: [9], gpio: 27, name: "GPIO27" }, { pins: [10], gpio: 6, name: "GPIO6" }, { pins: [11], gpio: 7, name: "GPIO7" }, { pins: [12], gpio: 26, name: "GPIO26" }, { pins: [13], gpio: 25, name: "GPIO25" }, { pins: [14], label: '5V', name: "5V" }, { pins: [15], label: 'GND', name: "GND" }, { pins: [16], label: 'NC', name: "NC" }],
  right: [{ pins: [32], label: 'GND', name: "GND" }, { pins: [31], gpio: 11, name: "GPIO11/U0TXD" }, { pins: [30], gpio: 12, name: "GPIO12/U0RXD" }, { pins: [29], gpio: 24, name: "GPIO24" }, { pins: [28], gpio: 23, name: "GPIO23" }, { pins: [27], gpio: 15, name: "GPIO15" }, { pins: [26], gpio: 10, name: "GPIO10" }, { pins: [25], gpio: 9, name: "GPIO9" }, { pins: [24], gpio: 8, name: "GPIO8" }, { pins: [23], label: 'NC', name: "NC" }, { pins: [22], gpio: 28, name: "GPIO28" }, { pins: [21], label: 'GND', name: "GND" }, { pins: [20], gpio: 14, name: "GPIO14/USB_D+" }, { pins: [19], gpio: 13, name: "GPIO13/USB_D-" }, { pins: [18], label: 'GND', name: "GND" }, { pins: [17], label: 'NC', name: "NC" }],
}

