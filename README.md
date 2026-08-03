<p align="center">
  <img src="public/brand/logo-card.svg" alt="ESP32 Pinout Studio" width="440">
</p>

# ESP32 Pinout Studio

**Live at [esp32pin.com](https://esp32pin.com)** - a free, interactive pinout reference for the whole ESP32 family, built for the maker community.

![ESP32 Pinout Studio - interactive module view with per-pin constraint warnings](docs/site-screenshot.png)

Pick the wrong pin on an ESP32 and your project boots into download mode, crashes when Wi-Fi starts, or bricks the flash bus. This site exists so that doesn't happen: every pin carries its constraints (strapping pins, ADC2/Wi-Fi conflicts, flash-reserved GPIOs, input-only pins, USB/JTAG lines) right on the diagram.

## Features

- **Schematic view**: the official Espressif KiCad symbol for each module, rendered as an EDA-style sheet with verbatim pin names and high-visibility warnings.
- **Module view**: a realistic top-down rendering of the physical module with its castellated pads.
- **23 modules and dev boards** across ESP32, S2, S3, C3, C5, C6, and H2, each with its real physical pad layout.
- **Pin mapping builder** with live conflict detection, Arduino `#define` export, shareable URLs, and PNG export.
- **Filters** for Wi-Fi-safe ADC, safe outputs, touch, strapping, and unconstrained pins.

## Data provenance

Pin names, physical pad layouts, and schematic symbols are generated from [Espressif's official KiCad libraries](https://github.com/espressif/kicad-libraries) - not hand-copied from datasheets:

```sh
git clone --depth 1 https://github.com/espressif/kicad-libraries
KICAD_LIB=./kicad-libraries node scripts/generate-chip-data.mjs
```

`src/data/chips/generated.ts` is the output; do not edit it by hand. Family-level lore KiCad doesn't encode (strapping pins, boot modes, ADC2/Wi-Fi arbitration, flash-bus rules) lives in the generator's `FAM` table and in `src/data/chips/catalog.ts`.

On top of that, per-GPIO alternate functions, RTC/low-power domain flags, and strapping roles are merged from the dataset of Espressif's official [esp-gpio-tool](https://github.com/espressif/esp-gpio-tool) (Apache-2.0, vendored in `vendor/esp-gpio-tool/`, regenerated with `node scripts/import-esp-gpio-tool.mjs`). The test suite (`tests/espressif-crosscheck.test.ts`) cross-validates the entire catalog against that dataset on every run, so the site can never silently drift from Espressif's own pin data.

Espressif does not publish KiCad data for the ESP8266, so the ESP-12F's pin names, schematic symbol geometry and pad layout are derived instead from [KiCad's own stock symbol and footprint libraries](https://gitlab.com/kicad/libraries), licensed CC-BY-SA 4.0 with the KiCad library exception.

## Found a mistake?

Use the **Report mistake** button on the site (it prefills an issue with the chip and pin context), or [open an issue](https://github.com/FelixKunzJr/ESPPinoutWebsite/issues/new) directly. Corrections with a datasheet reference are merged fast.

## Development

```sh
npm install
npm run dev     # local dev server
npm test        # vitest
npm run build   # production build
```

Pushes to `main` auto-deploy via Vercel.

## License

MIT (see [LICENSE](LICENSE)). Pin data and symbols derive from Espressif's KiCad libraries (Apache 2.0) and, for the ESP8266, from KiCad's own stock libraries (CC-BY-SA 4.0 with the KiCad library exception). ESP32 is a trademark of Espressif Systems; this project is not affiliated with or endorsed by Espressif.

Always verify pinouts against the official datasheet before committing hardware.
