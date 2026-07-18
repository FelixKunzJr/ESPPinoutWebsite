# Contributing to ESP32 Pinout Studio

Thanks for helping build a pin reference people can actually trust. This project lives or dies on **accuracy**, so the workflow is built around one rule:

> **Every pin fact needs a source.** Cite a datasheet section, an errata note, or a KiCad library. Unsourced pin data is what every wrong pinout on the internet is made of — we don't add to the pile.

You do **not** need to write code to help. Most contributions are issues.

## Ways to contribute

| You have... | Do this |
| --- | --- |
| A wrong/missing pin, constraint, or warning | [Report incorrect data or a gotcha](../../issues/new/choose) |
| A board you'd like added | [Request a board](../../issues/new/choose) |
| Pin data, KiCad files, or gotchas (one board or many) | [Submit board data or gotchas](../../issues/new/choose) |
| The skills and time to wire a board end-to-end | Open a pull request — read the rest of this guide first |

The most valuable thing you can give us is a **gotcha**: the "GPIO12 as a button bricks boot" knowledge you only learn by getting burned. Pin layouts can be generated; that lore cannot.

## House rules for data

- **Verbatim Espressif names.** Pin names match the official symbol exactly (`SENSOR_VP/GPIO36/ADC1_CH0`), not a cleaned-up version.
- **Plain hyphens only.** No en dashes or em dashes anywhere in UI text or data.
- **Constraints are plain English.** A warning says what breaks and how to avoid it, e.g. "GPIO0 must be HIGH/floating at boot to boot from flash; LOW enters download mode."
- **Severity is honest.** `danger` = it will break your project (flash pins, ADC2 read while Wi-Fi is on). `warning` = it can bite you (strapping pins, USB/JTAG lines).

## How the data is built

Pin names, physical pad layouts, and schematic symbols are **generated from [Espressif's official KiCad libraries](https://github.com/espressif/kicad-libraries)**, not hand-copied from datasheets.

```sh
git clone --depth 1 https://github.com/espressif/kicad-libraries
KICAD_LIB=./kicad-libraries node scripts/generate-chip-data.mjs
```

- `src/data/chips/generated.ts` is the **output — never hand-edit it.** A hand edit is overwritten on the next regenerate, and hand-copied datasheet data is exactly the drift we're avoiding.
- Family-level lore KiCad doesn't encode (strapping pins, boot modes, ADC2/Wi-Fi arbitration, flash-bus rules) lives in the generator's `FAM` table in `scripts/generate-chip-data.mjs` and in `src/data/chips/catalog.ts`.
- The two original hand-authored chips, `src/data/chips/esp32.ts` and `esp32wrover.ts`, are the exception; everything else flows through the generator.

## Adding a board

1. **Espressif module or dev board** (in Espressif's KiCad lib): add an entry to the `MODULES` array in `scripts/generate-chip-data.mjs` pointing at the KiCad `sym`/`fp` names, add the matching catalog entry in `src/data/chips/catalog.ts`, then regenerate.
2. **Third-party board that ships KiCad** (Seeed, Waveshare, LILYGO, etc.): if the vendor's symbol/footprint format matches Espressif's, point the generator at their library the same way. Formats vary, so open a [board data issue](../../issues/new/choose) with the KiCad link first — confirming the format is the only hard part.
3. **Board with no KiCad**: hand-author a `Chip` in `src/data/chips/` implementing the `Chip` interface (see `esp32.ts` as the reference), then register it in `catalog.ts`.

After adding a chip, update `public/sitemap.xml`, `public/llms.txt`, and the fallback module list in `index.html`.

## Adding or fixing a gotcha

Constraints live on each pin as objects with a `severity` and a plain-English `description` (see the reusable ones at the top of `src/data/chips/esp32.ts`). Family-wide notes live in the generator's `FAM` table and surface as the "Known Gotchas" banner. Attach a source in the PR description.

## Dev setup

```sh
npm install
npm run dev      # local dev server
npm test         # vitest (keep it green)
npx tsc --noEmit # typecheck
npm run build    # production build
```

## Pull request checklist

- [ ] `npm test`, `npx tsc --noEmit`, and `npm run build` all pass
- [ ] `generated.ts` was regenerated, not hand-edited
- [ ] New/changed pin facts cite a source
- [ ] Verbatim pin names, plain hyphens, honest severity
- [ ] Sitemap / llms.txt / index.html updated if you added a chip

## License

By contributing you agree your work is released under the project's [MIT license](LICENSE). Pin data and symbols derive from Espressif's KiCad libraries (Apache 2.0). Always verify against the official datasheet before committing hardware.
