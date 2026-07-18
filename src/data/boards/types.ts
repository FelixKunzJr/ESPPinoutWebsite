import type { Severity } from '../../types/chip'

// A BoardSpec is the no-KiCad contribution format. A contributor describes a
// third-party board as a base ESP32 chip plus the board-specific wiring:
// which header pad maps to which GPIO, board silk labels, and gotchas. All the
// electrical facts (capabilities, constraints) are inherited from the base
// chip, so a BoardSpec cannot introduce wrong per-pin data.

export interface HeaderPad {
  gpio?: number   // omit for power/ground/NC pads
  label?: string  // for non-GPIO pads ('GND' | '3V3' | 'EN' | '5V' | 'NC')
}

export interface BoardOverride {
  label?: string     // board silk name for this GPIO, e.g. 'TFT_CS'
  note?: string      // board-specific gotcha, e.g. 'wired to the display backlight'
  severity?: Severity
}

export interface BoardSpec {
  id: string                    // url-safe id, e.g. 'lilygo-tdisplay-s3'
  name: string                  // display name, e.g. 'LILYGO T-Display-S3'
  baseChip: string              // existing chip id this board is built on, e.g. 'esp32s3'
  pcb?: 'green' | 'black'
  notes?: string[]              // board-level gotchas (appended to the base chip's)
  headers: {
    left: HeaderPad[]           // top -> bottom
    right: HeaderPad[]          // top -> bottom
    top?: HeaderPad[]           // left -> right
    bottom?: HeaderPad[]        // left -> right
  }
  overrides?: Record<string, BoardOverride>  // keyed by GPIO number (as a string)
}

export interface BoardResult {
  chip: import('../../types/chip').Chip | null
  errors: string[]
  warnings: string[]
}
