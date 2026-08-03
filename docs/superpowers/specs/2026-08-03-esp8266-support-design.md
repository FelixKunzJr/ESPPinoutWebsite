# ESP8266 support

Date: 2026-08-03
Status: approved, not yet implemented

## Why

The site covers every ESP32 family but not the ESP8266, which is still in
active use for new projects. A reader asked for it on the r/esp32 post. The
ESP8266 also carries a distinct set of pin traps (the D0-D8 silk numbering, the
1.0 V ADC, GPIO16, the GPIO15 pull-down) that are exactly the class of mistake
this site exists to prevent.

## Scope

Three catalog entries:

| id | display name | kind | data source |
|---|---|---|---|
| `esp8266` | ESP8266 (ESP-12F) | module | generated from the KiCad stock library |
| `nodemcu-v1` | NodeMCU v1.0 (ESP8266) | board | contrib board JSON on `esp8266` |
| `d1-mini` | LOLIN D1 Mini (ESP8266) | board | contrib board JSON on `esp8266` |

Out of scope for this pass: ESP-01/ESP-01S, ESP-07S, ESP-12S, NodeMCU v3
(LOLIN), D1 Mini Pro, ESP8285. The board JSON mechanism makes each of these a
small follow-up once the family exists.

## Naming

`id: 'esp8266'` for the module, not `esp12f`. This mirrors the existing
precedent where the classic ESP32 entry uses `id: 'esp32'` despite being
specifically an ESP-WROOM-32. The URL `esp32pin.com/esp8266` is what people
search for, and the postbuild SEO script keys OG cards, prerendered HTML, and
per-pin pages off the id.

`family: 'ESP8266'` is the selector tab label. `name: 'ESP8266 (ESP-12F)'` leads
with the recognizable name and keeps the precise one.

Both boards carry an explicit `(ESP8266)` suffix because they land in the shared
Boards tab. The D1 Mini in particular sits next to LOLIN's S2 Mini, S3 Mini, and
C3 Mini, which are all ESP32 parts, so without the marker that row misleads.

`shortLabel` in `ChipSelector.tsx` strips the family prefix off a module name to
build the pill text. With `ESP8266 (ESP-12F)` that yields `" (ESP-12F)"`, with a
stray leading space and parens. It needs to also trim whitespace and surrounding
parens so the pill reads `ESP-12F`. The change is inert for every existing chip,
since no current name contains parens.

## Data model

### New family

A new `esp8266` entry in the `FAMILIES` table in `catalog.ts`:

- `cores: 1`, `arch: 'Single-core Tensilica L106'`
- `hasWifi: true`, `hasBle: false`, `hasBluetooth: false`
- `radios: 'Wi-Fi 4 only'`
- `totalGpio: 17` (GPIO0 to GPIO16)
- `accent: '#6366f1'` (indigo, the only unused hue in `FAMILY_ACCENT`)
- `datasheetUrl`: the Espressif ESP8266EX datasheet

Family notes cover: GPIO6-11 are the flash bus; GPIO9/GPIO10 are broken out but
only usable in DIO flash mode; GPIO0/2/15 are strapping pins with fixed boot
levels; GPIO16 has no interrupt, no PWM, and a pull-down rather than a pull-up;
the ADC is 0 to 1.0 V on a bare module; there is no DAC, no touch, no second
ADC, no native USB, and no Bluetooth of any kind.

### New constraint ids

Two additions to `ConstraintId` in `src/types/chip.ts`:

- `no_interrupt` for GPIO16
- `adc_input_range` for the analog input

`AFFECTED_WORD` in `src/components/pinout/shared.tsx` is typed
`Record<ConstraintId, string>`, so the compiler forces both to be handled. No
other type changes are required.

### The analog input

A0/TOUT is not a GPIO on the ESP8266, but the `Pin` type requires a numeric
`gpio`. It ships as a synthetic pin:

```ts
{ gpio: 17, names: ['A0', 'TOUT'], capabilities: ['adc1'], ... }
```

GPIO17 does not exist on the ESP8266, so the number cannot collide. Every
consumer (pin table, filters, mapping builder, conflict detection, export, SEO
pin pages) works unchanged, and the UI shows `A0` because that is the first
entry in `names`.

Known wart, accepted: the generated per-pin SEO page is `/esp8266/gpio17` while
every visible label says A0. Making `Pin.gpio` optional instead would touch
`filterPins`, `detectConflicts`, the mapping builder, the export path, the
postbuild SEO generator, and their tests, which is not worth it for one pin.

The constraint text distinguishes the two cases explicitly. The generator emits
the bare-silicon case as the family default, worded for 0 to 1.0 V. Each board
JSON then supplies an `overrides` note for gpio 17 stating its actual usable
range through the onboard divider, 0 to 3.2 V on both NodeMCU v1.0 and the D1
Mini. The base constraint is never rewritten, only annotated, which matches how
every other board-specific note already works.

## Generator extension

`scripts/generate-chip-data.mjs` gains a second library root, `KICAD_STOCK`,
alongside the existing `KICAD_LIB`, pointing at clones of KiCad's own
`kicad-symbols` and `kicad-footprints`. Both are verified to contain what is
needed: `RF_Module.kicad_symdir/ESP-12F.kicad_sym` (22 pins with full geometry)
and `RF_Module.pretty/ESP-12E.kicad_mod`.

Two parser deltas:

1. KiCad's stock symbol library is now split into `.kicad_symdir/` directories
   with one symbol per file, where Espressif ships a single flat `.kicad_sym`.
   The loader needs to handle both shapes.
2. `ESP-12F` is declared as `(extends "ESP-12E")` and carries no pins of its
   own, so the resolver has to follow the inheritance to `ESP-12E`.

The footprint parser needs no change; `.kicad_mod` is the same format already
consumed from Espressif.

A new `esp8266` family rule in the generator emits constraints:

| pins | constraint | severity |
|---|---|---|
| 6, 7, 8, 11 | `flash_reserved` | danger |
| 9, 10 | `flash_reserved` (DIO-mode wording) | warning |
| 0 | `strapping_pin` + `boot_must_high` | warning |
| 2 | `strapping_pin` + `boot_must_high` | warning |
| 15 | `strapping_pin` + `boot_must_low` | warning |
| 1, 3 | `serial_console` | warning |
| 16 | `no_interrupt` + `no_pullup` | warning |
| 17 (A0) | `adc_input_range` | warning |

GPIO9 and GPIO10 are warning rather than danger deliberately: unlike the ESP32
flash pins, they are broken out on the ESP-12F and do work when the flash runs
in DIO mode. Calling them danger would be wrong.

The KiCad symbol names pins sparsely (`CS0`, `MISO`, `SCLK`, `ADC`, `EN`), so
peripheral labels come from a new ESP8266 table in `src/data/chips/enrich.ts`,
transcribed from the ESP8266EX datasheet IO MUX. This is the same additive
overlay already used for C5 and C3: names and capabilities only, never
constraints, so `generated.ts` stays regenerable.

## Verification plan

Every pad order is checked against primary sources before commit. This is not
optional: a previous board shipped upside down because a third-party pinout
image was trusted over the vendor's own.

| entry | primary source | cross-check |
|---|---|---|
| ESP-12F | Ai-Thinker ESP-12F datasheet | Espressif ESP8266EX datasheet IO MUX table |
| NodeMCU v1.0 | official `nodemcu/nodemcu-devkit-v1.0` schematic PDF | `arduino-esp8266` `variants/nodemcu/pins_arduino.h` |
| D1 Mini | LOLIN official schematic and pinout page | `arduino-esp8266` `variants/d1_mini/pins_arduino.h` |

The D-label to GPIO map is the single most common ESP8266 mistake and gets two
independent confirmations for each board. Expected map, to be confirmed rather
than assumed: D0=GPIO16, D1=GPIO5, D2=GPIO4, D3=GPIO0, D4=GPIO2, D5=GPIO14,
D6=GPIO12, D7=GPIO13, D8=GPIO15.

D-labels render through the existing `boardLabel` field, so the board pad shows
`D5` with `GPIO14` underneath, the same treatment the XIAO boards already use
for their D0-D10 pads.

## Feature parity

Everything an ESP32 page offers, the ESP8266 pages offer too.

- **`specs.ts`**: a `FAMILY_SPECS['ESP8266']` entry (1 core, L106 at 80/160 MHz,
  no PSRAM, flash per module SKU). The SRAM and ROM figures are transcribed from
  the ESP8266EX datasheet during implementation, not carried over from memory,
  because the commonly quoted ESP8266 RAM numbers conflate total SRAM with the
  heap actually available to a sketch.
- **`flashing.ts`**: `BOOT_PIN['ESP8266'] = 0`, and deliberately absent from
  `NATIVE_USB`. The bare ESP-12F then gets the manual GPIO0-low sequence and
  both boards get the existing auto-flash board default.
- **`esphome.ts`**: the largest single code change. The config generator
  currently hardcodes an `esp32:` platform block. It needs a branch emitting
  `esp8266:` for this family, with `ESPHOME_BOARD` gaining the two verified keys
  `nodemcuv2` and `d1_mini`. `FAMILY_VARIANT` gets no ESP8266 entry, because
  ESPHome has no `variant:` concept on that platform; the fallback path must not
  emit one.
- **`routing.ts`**: audited for ESP32-specific assumptions. The flash and PSRAM
  filter at line 185 already keys off constraint ids, so it works as-is.
- **`ChipSelector.tsx`**: `FAMILY_ACCENT['ESP8266']` plus its `LIGHT_ACCENT`
  shade. The tab sits after ESP32-H2 and before Boards.
- **SEO**: ESP8266 added to the `<title>`, meta description, JSON-LD
  `SoftwareApplication` description, and the `<noscript>` module list in
  `index.html`; a new FAQ entry on the D0-D8 numbering trap; `llms.txt` gains the
  three URLs and the ESP8266 pin facts; `FAMILY_REPS` in
  `scripts/postbuild-seo.ts` gains `esp8266` so it generates per-pin pages. The
  product name stays "ESP32 Pinout Studio" and the domain does not change.
- **Attribution**: KiCad's libraries are CC-BY-SA 4.0 with the design exception.
  They get an attribution block in `LICENSE`, `README.md`, and `CONTRIBUTING.md`
  next to the existing Espressif and esp-gpio-tool entries.

## Tests

New:

- `chip-data.test.ts`: schema validity for all three entries; GPIO6-8/11 are
  danger, GPIO9/10 are warning, GPIO16 carries `no_interrupt`, A0 exists at
  gpio 17 with `adc1`.
- `boards.test.ts`: the full D0-D8 map for both boards, asserted explicitly so a
  future edit cannot silently move a label.
- `esphomeConfig.test.ts`: an ESP8266 board emits `esp8266:` with the right
  board key and never emits `esp32:` or a `variant:`.
- `flashing.test.ts`: the bare ESP-12F gets the GPIO0 manual sequence and is not
  described as having native USB.
- `specs.test.ts`: the ESP8266 family entry resolves.

Guards on existing suites:

- `espressif-crosscheck.test.ts` must skip ESP8266. The vendored esp-gpio-tool
  dataset has no ESP8266 target, so the cross-check has nothing to compare
  against and would otherwise fail on a missing key.
- `routing.test.ts` asserts which families expose JTAG. ESP8266 has none and
  needs an entry.

## Deferred, with reasoning

- **Boards tab crowding.** NodeMCU and D1 Mini join 14 existing ESP32 boards in
  one flat tab with no family grouping. The `(ESP8266)` name suffix is the
  minimal fix. Revisit grouping only if the tab keeps growing.
- **Espressif portal article.** The article at espressif/developer-portal#787 is
  in review and describes the site as an ESP32 reference. Adding ESP8266 does
  not contradict it. Leave the article alone until it merges rather than editing
  mid-review.
- **Further ESP8266 parts.** ESP-01S, ESP-07S, NodeMCU v3, D1 Mini Pro. Each is
  a board JSON or a small generator entry once this lands.
