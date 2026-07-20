import type { Chip } from '../../types/chip'
import type { FlashingInfo } from './types'

// Download-mode BOOT strapping pin per family, from Espressif's esptool boot-mode
// docs: GPIO0 on ESP32/S2/S3, GPIO9 on C3/C6/H2 (C5 is not documented there yet,
// so it is deliberately absent - familyFlashing returns null for it).
const BOOT_PIN: Record<string, number> = {
  'ESP32': 0,
  'ESP32-S2': 0,
  'ESP32-S3': 0,
  'ESP32-C3': 9,
  'ESP32-C6': 9,
  'ESP32-H2': 9,
}

// Families with a native USB path that can flash without an external adapter.
const NATIVE_USB: Record<string, string> = {
  'ESP32-S2': 'USB-OTG',
  'ESP32-S3': 'USB Serial/JTAG',
  'ESP32-C3': 'USB Serial/JTAG',
  'ESP32-C6': 'USB Serial/JTAG',
  'ESP32-H2': 'USB Serial/JTAG',
}

function pinRef(chip: Chip, name: string): string {
  const gpio = chip.pins.find(p => p.names.includes(name))?.gpio
  return gpio === undefined ? name : `${name} (GPIO${gpio})`
}

// Verified default flashing procedure for a bare module, derived from the chip's
// UART0 pins and its download-mode BOOT pin. Returns null for families whose
// sequence is not verified here (e.g. C5), which fall back to the contribute line.
export function familyFlashing(chip: Chip): FlashingInfo | null {
  // Only bare modules use this procedure. Dev boards auto-flash over their
  // onboard USB-serial bridge (handled by FlashingSection's board default).
  if (chip.module?.form === 'board') return null
  const boot = BOOT_PIN[chip.family]
  if (boot === undefined) return null

  const usb = NATIVE_USB[chip.family]
  const bootExtra = boot === 9
    ? ' (keep GPIO8 high - GPIO8 low together with GPIO9 low is an invalid strapping combination)'
    : ''

  const steps: string[] = []
  if (usb) {
    steps.push(`This chip has native ${usb}: wire the module's USB D+/D- to a USB port to flash directly, no external adapter needed.`)
    steps.push(`Alternatively use a 3.3 V USB-to-serial adapter: adapter TX to ${pinRef(chip, 'U0RXD')}, adapter RX to ${pinRef(chip, 'U0TXD')}, GND to GND, 3V3 to 3V3.`)
  } else {
    steps.push(`Wire a 3.3 V USB-to-serial adapter: adapter TX to ${pinRef(chip, 'U0RXD')}, adapter RX to ${pinRef(chip, 'U0TXD')}, GND to GND, 3V3 to 3V3. Never feed a 3.3 V module from 5 V.`)
  }
  steps.push(`Enter download mode: hold GPIO${boot} (BOOT) low, pulse EN/reset low then high, then release GPIO${boot}${bootExtra}.`)
  steps.push('Flash the firmware, then reset or power-cycle the module to run it.')

  return {
    autoFlash: false,
    wiring: `Bare module: no onboard USB-serial bridge or auto-reset. Download-mode strapping pin is GPIO${boot}.`,
    manualSteps: steps,
    note: 'Dev boards with an onboard USB-serial chip do this automatically - the steps above are for a bare module or a custom PCB.',
  }
}
