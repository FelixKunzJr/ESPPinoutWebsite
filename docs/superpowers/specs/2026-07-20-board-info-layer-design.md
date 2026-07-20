# Board Info Layer — Design

Date: 2026-07-20
Status: Approved (design), pending implementation plan

## Summary

Add a "Board Info" layer to ESP32 Pinout Studio: per-chip/board reference content
beyond the pinout, addressing the recurring "I keep re-googling this" pain. Three
content types, shown as collapsible sections below the pinout diagram:

1. **Specs** — CPU, memory, radios (authoritative, filled everywhere).
2. **Flashing / wiring** — how to put the board into download mode.
3. **ESPHome config** — a minimal copyable `esp32:` YAML stanza.

Specs are seeded for all entries by us (datasheet-sourced). Flashing and ESPHome
are optional, seeded on a few flagship entries, and grow via community
contribution (prefilled GitHub issue flow, same as the existing report-mistake /
board-request loop).

## Goals

- A quick-glance spec table for every chip/board.
- Board-specific flashing/wiring steps where they matter (bare modules, buttons).
- A minimal ESPHome starting config, with room for camera/ethernet notes later.
- Empty sections drive contributions rather than looking broken.

## Non-goals (YAGNI)

- No per-board photos or renders beyond the existing module drawing.
- No full ESPHome example projects — only the minimal platform stanza.
- No pricing, purchase links, or vendor comparisons.
- No new flash/PSRAM SKU database beyond a typical value + a "varies by SKU" note.

## Placement

New collapsible sections in the existing stack below the pinout diagram, adjacent
to the current "Peripheral routing — GPIO matrix & IO MUX" section:

```
[ Pinout diagram        ]
[ Peripheral routing  ▾ ]   (existing)
[ Specs               ▾ ]   (new, always shown)
[ Flashing / wiring   ▾ ]   (new)
[ ESPHome config      ▾ ]   (new)
[ Pin table             ]
```

## Data model

Chosen approach: **one content overlay keyed by chip/board id**, mirroring the
existing `contrib/boards/*.board.json` + `src/data/chips/enrich.ts` patterns.
Generated data (`generated.ts`) stays untouched and regenerable.

### Specs

Family-level spec facts live in a specs table keyed by family (most entries share
a die), with an optional per-module override for the fields that vary by SKU
(Flash, PSRAM).

```ts
interface ChipSpecs {
  cores: number
  arch: string            // e.g. 'RISC-V single-core', 'Dual-core Xtensa LX7'
  cpuMaxMhz: number       // e.g. 240, 160, 96
  sramKb: number          // total on-chip SRAM
  romKb: number           // mask ROM
  flash?: string          // typical + SKU note, e.g. '4 MB (up to 16 MB SKUs)'
  psram?: string          // e.g. 'None' | 'Up to 8 MB (WROVER)' | '2 MB (SiP)'
  radios: string          // reuse existing FAMILIES.radios
  notable?: string[]      // e.g. ['Native USB-OTG', '802.15.4 (Zigbee/Thread)']
}
```

- Family specs table: `src/data/chips/specs.ts` (authoritative, we fill).
- Per-module Flash/PSRAM overrides carried in the module/board definition
  (module SKU is the only spec that legitimately varies per entry).
- Resolved onto the `Chip` at build time in `catalog.ts` (like `enrichPins`).

### Flashing / wiring

Optional structured content per id:

```ts
interface FlashingInfo {
  autoFlash: boolean        // true = onboard USB-serial + auto-reset (most DevKits)
  manualSteps?: string[]    // ordered steps to enter download mode
  wiring?: string           // e.g. 'Pull GPIO0 to GND, pulse EN, release GPIO0'
  note?: string             // free-form caveat
}
```

- DevKit default (autoFlash true) renders: "USB auto-flash — hold BOOT and tap EN
  if it won't enter download mode."
- Bare module renders the explicit manual sequence.

### ESPHome config

Optional per id:

```ts
interface EsphomeInfo {
  yaml: string              // minimal `esp32:` platform stanza
  notes?: string[]          // camera/ethernet/board-specific caveats
}
```

### Overlay storage

- `src/data/chips/specs.ts` — family specs (authoritative, we own).
- Flash/PSRAM SKU values live with the module/board definition (they are a
  hardware fact of that specific module), as optional `flash`/`psram` fields on
  the module spec — not in the community content overlay.
- `contrib/info/<id>.json` — optional `{ flashing?, esphome? }` procedural
  content, community-contributable, keyed by chip/board id. Merged in `catalog.ts`.
- A resolver (`resolveInfo(id)`) returns `{ specs, flashing?, esphome? }`, with
  `specs` always present (family specs + any module Flash/PSRAM) and the other
  two undefined when no overlay content exists.

## Components

- `SpecsSection.tsx` — renders the spec table from resolved `ChipSpecs`. Always shown.
- `FlashingSection.tsx` — renders steps or the auto-flash default; when absent,
  an "Add flashing steps →" contribute button.
- `EsphomeSection.tsx` — renders a copyable YAML block (reuse the export copy
  button pattern); when absent, an "Add ESPHome config →" contribute button.
- Contribute buttons reuse `src/utils/github.ts` to open a prefilled GitHub issue
  templated for the specific board and section.

Each section is an independent, self-contained component reading from the
resolved info object; they can be built and tested in isolation.

## Content seeding at launch

- Specs: all families (ESP32, S2, S3, C3, C5, C6, H2), datasheet-sourced, verified.
- Flashing: the auto-flash default applies to all DevKits automatically; explicit
  manual steps seeded for the bare modules and the Elegoo/generic board.
- ESPHome: minimal stanza seeded for 3-4 flagship entries (DevKitC, S3-DevKitC,
  C3-DevKitM, Elegoo). Others show the contribute prompt.

## Testing

- Unit: `resolveInfo` returns specs for every chip id; returns undefined
  flashing/esphome when no overlay exists; merges overlay correctly when present.
- Unit: specs table has an entry for every family in `FAMILIES`.
- Component: empty flashing/esphome sections render the contribute button;
  populated ones render content.
- Existing test suite stays green.

## SEO / build integration

- The new sections are crawlable text (specs, flashing steps) → more indexable
  content per chip page, reinforcing the programmatic-SEO work.
- No change to sitemap/OG generation required.

## Open questions (resolve during planning)

- Exact spec field values per family (sourced + verified during implementation).
- Which 3-4 entries get seeded ESPHome configs (default: the four DevKits + Elegoo).
- GitHub issue template shape for the two contribute buttons.
