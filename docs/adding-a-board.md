# Adding a board without KiCad

Most third-party boards (LILYGO, Waveshare, combo display boards, generic dev boards) are just a known ESP32 chip on a carrier. You do **not** need KiCad or the generator to add one. You describe the board as a **BoardSpec**: pick the base chip, list which header pad maps to which GPIO, and add the gotchas. Every electrical fact (what each GPIO can do, its constraints) is inherited from the base chip, so you cannot get the pin capabilities wrong.

## 1. Copy the template

Start from [`contrib/boards/example.board.json`](../contrib/boards/example.board.json) and rename it `contrib/boards/<your-board-id>.board.json`.

```jsonc
{
  "id": "lilygo-tdisplay-s3",        // url-safe id
  "name": "LILYGO T-Display-S3",     // display name
  "baseChip": "esp32s3",             // an existing chip id (esp32, esp32s3, esp32c3, ...)
  "pcb": "black",
  "notes": [
    "Board-level gotchas go here, e.g. the 3.3V regulator is only good for ~500mA."
  ],
  "headers": {
    "left":  [ { "label": "5V" }, { "label": "GND" }, { "gpio": 1 }, { "gpio": 2 } ],
    "right": [ { "gpio": 43 }, { "gpio": 44 }, { "gpio": 0 } ]
  },
  "overrides": {
    "1": { "label": "TFT_CS", "note": "wired to the on-board display chip-select" },
    "0": { "note": "also the BOOT button; low at reset enters download mode" }
  }
}
```

- **Header pads** are listed top-to-bottom for `left`/`right` (and left-to-right for optional `top`/`bottom`). A pad is either a `gpio` or a non-GPIO `label` (`"GND"`, `"3V3"`, `"5V"`, `"EN"`, `"NC"`).
- **overrides** are keyed by GPIO number. Use `label` for the board's silk name and `note` for a board-specific gotcha.

## 2. Base chip ids

`esp32`, `esp32s2`, `esp32s3`, `esp32c3`, `esp32c6`, `esp32h2` (and the specific module variants listed in `src/data/chips/catalog.ts`). Pick the one your board actually uses.

## 3. Validate it

```sh
npm test
```

The board test resolves every `contrib/boards/*.json` against the real chip data. It fails if a GPIO does not exist on the base chip, if a GPIO is assigned twice, or if the base chip is unknown. It warns (does not fail) when you break out a pin that is never safe to use, so you can double-check the board really exposes it.

## 4. Submit it

Open a [board data issue](https://github.com/FelixKunzJr/ESPPinoutWebsite/issues/new/choose) with the JSON (or a pull request adding the file). Include a link to the board's schematic or pinout so the wiring can be spot-checked. The gotchas are the most valuable part, so do not skip them.

## Why the schematic still looks right

Boards added this way have no official KiCad symbol, so the Schematic view synthesizes a sensible one from the pin list (GPIOs in order, power and ground grouped). That is by design. Exact official symbols are reserved for Espressif's own modules, which come through the KiCad generator.
