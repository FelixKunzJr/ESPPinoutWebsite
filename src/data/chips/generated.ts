// AUTO-GENERATED from Espressif KiCad libraries (symbols + footprints).
// Do not edit by hand — regenerate. Pin names & physical pad layout are authoritative.
import type { Capability, Pin, PackageLayout } from '../../types/chip'

const INPUT_ONLY = { id: 'input_only' as const, severity: 'warning' as const, title: 'Input only', description: 'This pin has no output driver or internal pull resistors. Use only as a digital/analog input.' }
const STRAP = { id: 'strapping_pin' as const, severity: 'warning' as const, title: 'Strapping pin', description: 'Sampled at boot to set boot mode / configuration. Avoid driving it at reset unless you know the required level.' }
const ADC2_WIFI = { id: 'adc2_no_wifi' as const, severity: 'warning' as const, title: 'ADC2 unusable with Wi-Fi', description: 'ADC2 is claimed by the Wi-Fi driver; analogRead() on this pin fails while Wi-Fi is active. Prefer ADC1 pins.' }
const USB = { id: 'usb_jtag' as const, severity: 'warning' as const, title: 'USB / Serial-JTAG', description: 'Part of the native USB (Serial/JTAG) interface. Avoid repurposing while USB is in use.' }

export const ESP32S2_PINS: Pin[] = [
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

export const ESP32S2_LAYOUT: PackageLayout = {
  name: 'ESP32-S2-WROOM',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, gpio: 0 }, { pinNumber: 4, gpio: 1 }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, gpio: 4 }, { pinNumber: 8, gpio: 5 }, { pinNumber: 9, gpio: 6 }, { pinNumber: 10, gpio: 7 }, { pinNumber: 11, gpio: 8 }, { pinNumber: 12, gpio: 9 }, { pinNumber: 13, gpio: 10 }, { pinNumber: 14, gpio: 11 }, { pinNumber: 15, gpio: 12 }, { pinNumber: 16, gpio: 13 }],
  bottom: [{ pinNumber: 17, gpio: 14 }, { pinNumber: 18, gpio: 15 }, { pinNumber: 19, gpio: 16 }, { pinNumber: 20, gpio: 17 }, { pinNumber: 21, gpio: 18 }, { pinNumber: 22, gpio: 19 }, { pinNumber: 23, gpio: 20 }, { pinNumber: 24, gpio: 21 }, { pinNumber: 25, gpio: 26 }, { pinNumber: 26, label: 'GND' }],
  right: [{ pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'EN' }, { pinNumber: 40, gpio: 46 }, { pinNumber: 39, gpio: 45 }, { pinNumber: 38, gpio: 44 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 42 }, { pinNumber: 35, gpio: 41 }, { pinNumber: 34, gpio: 40 }, { pinNumber: 33, gpio: 39 }, { pinNumber: 32, gpio: 38 }, { pinNumber: 31, gpio: 37 }, { pinNumber: 30, gpio: 36 }, { pinNumber: 29, gpio: 35 }, { pinNumber: 28, gpio: 34 }, { pinNumber: 27, gpio: 33 }],
}

export const ESP32S3_PINS: Pin[] = [
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

export const ESP32S3_LAYOUT: PackageLayout = {
  name: 'ESP32-S3-WROOM-1',
  left: [{ pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: '3V3' }, { pinNumber: 3, label: 'EN' }, { pinNumber: 4, gpio: 4 }, { pinNumber: 5, gpio: 5 }, { pinNumber: 6, gpio: 6 }, { pinNumber: 7, gpio: 7 }, { pinNumber: 8, gpio: 15 }, { pinNumber: 9, gpio: 16 }, { pinNumber: 10, gpio: 17 }, { pinNumber: 11, gpio: 18 }, { pinNumber: 12, gpio: 8 }, { pinNumber: 13, gpio: 19 }, { pinNumber: 14, gpio: 20 }],
  bottom: [{ pinNumber: 15, gpio: 3 }, { pinNumber: 16, gpio: 46 }, { pinNumber: 17, gpio: 9 }, { pinNumber: 18, gpio: 10 }, { pinNumber: 19, gpio: 11 }, { pinNumber: 20, gpio: 12 }, { pinNumber: 21, gpio: 13 }, { pinNumber: 22, gpio: 14 }, { pinNumber: 23, gpio: 21 }, { pinNumber: 24, gpio: 47 }, { pinNumber: 25, gpio: 48 }, { pinNumber: 26, gpio: 45 }],
  right: [{ pinNumber: 40, label: 'GND' }, { pinNumber: 39, gpio: 1 }, { pinNumber: 38, gpio: 2 }, { pinNumber: 37, gpio: 43 }, { pinNumber: 36, gpio: 44 }, { pinNumber: 35, gpio: 42 }, { pinNumber: 34, gpio: 41 }, { pinNumber: 33, gpio: 40 }, { pinNumber: 32, gpio: 39 }, { pinNumber: 31, gpio: 38 }, { pinNumber: 30, gpio: 37 }, { pinNumber: 29, gpio: 36 }, { pinNumber: 28, gpio: 35 }, { pinNumber: 27, gpio: 0 }],
}

export const ESP32C3_PINS: Pin[] = [
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

export const ESP32C3_LAYOUT: PackageLayout = {
  name: 'ESP32-C3-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, label: 'NC' }, { pinNumber: 10, label: 'NC' }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 0 }, { pinNumber: 13, gpio: 1 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, label: 'NC' }, { pinNumber: 16, gpio: 10 }, { pinNumber: 17, label: 'NC' }, { pinNumber: 18, gpio: 4 }, { pinNumber: 19, gpio: 5 }, { pinNumber: 20, gpio: 6 }, { pinNumber: 21, gpio: 7 }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, label: 'NC' }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 21 }, { pinNumber: 30, gpio: 20 }, { pinNumber: 29, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 27, gpio: 19 }, { pinNumber: 26, gpio: 18 }, { pinNumber: 25, label: 'NC' }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
}

export const ESP32C6_PINS: Pin[] = [
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

export const ESP32C6_LAYOUT: PackageLayout = {
  name: 'ESP32-C6-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 4 }, { pinNumber: 10, gpio: 5 }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 0 }, { pinNumber: 13, gpio: 1 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, gpio: 6 }, { pinNumber: 16, gpio: 7 }, { pinNumber: 17, gpio: 12 }, { pinNumber: 18, gpio: 13 }, { pinNumber: 19, gpio: 14 }, { pinNumber: 20, gpio: 15 }, { pinNumber: 21, label: 'NC' }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, gpio: 18 }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 16 }, { pinNumber: 30, gpio: 17 }, { pinNumber: 29, gpio: 23 }, { pinNumber: 28, gpio: 22 }, { pinNumber: 27, gpio: 21 }, { pinNumber: 26, gpio: 20 }, { pinNumber: 25, gpio: 19 }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
}

export const ESP32H2_PINS: Pin[] = [
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

export const ESP32H2_LAYOUT: PackageLayout = {
  name: 'ESP32-H2-MINI-1',
  left: [{ pinNumber: 53, label: 'GND' }, { pinNumber: 1, label: 'GND' }, { pinNumber: 2, label: 'GND' }, { pinNumber: 3, label: '3V3' }, { pinNumber: 4, label: 'NC' }, { pinNumber: 5, gpio: 2 }, { pinNumber: 6, gpio: 3 }, { pinNumber: 7, label: 'NC' }, { pinNumber: 8, label: 'EN' }, { pinNumber: 9, gpio: 0 }, { pinNumber: 10, gpio: 1 }, { pinNumber: 11, label: 'GND' }, { pinNumber: 52, label: 'GND' }],
  bottom: [{ pinNumber: 12, gpio: 13 }, { pinNumber: 13, gpio: 14 }, { pinNumber: 14, label: 'GND' }, { pinNumber: 15, label: 'VBAT' }, { pinNumber: 16, gpio: 12 }, { pinNumber: 17, label: 'NC' }, { pinNumber: 18, gpio: 4 }, { pinNumber: 19, gpio: 5 }, { pinNumber: 20, gpio: 10 }, { pinNumber: 21, gpio: 11 }, { pinNumber: 22, gpio: 8 }, { pinNumber: 23, gpio: 9 }, { pinNumber: 24, gpio: 22 }],
  right: [{ pinNumber: 50, label: 'GND' }, { pinNumber: 35, label: 'NC' }, { pinNumber: 34, label: 'NC' }, { pinNumber: 33, label: 'NC' }, { pinNumber: 32, label: 'NC' }, { pinNumber: 31, gpio: 24 }, { pinNumber: 30, gpio: 23 }, { pinNumber: 29, label: 'NC' }, { pinNumber: 28, label: 'NC' }, { pinNumber: 27, gpio: 27 }, { pinNumber: 26, gpio: 26 }, { pinNumber: 25, gpio: 25 }, { pinNumber: 51, label: 'GND' }],
  top: [{ pinNumber: 48, label: 'GND' }, { pinNumber: 47, label: 'GND' }, { pinNumber: 46, label: 'GND' }, { pinNumber: 45, label: 'GND' }, { pinNumber: 44, label: 'GND' }, { pinNumber: 43, label: 'GND' }, { pinNumber: 42, label: 'GND' }, { pinNumber: 41, label: 'GND' }, { pinNumber: 40, label: 'GND' }, { pinNumber: 39, label: 'GND' }, { pinNumber: 38, label: 'GND' }, { pinNumber: 37, label: 'GND' }, { pinNumber: 36, label: 'GND' }],
}

