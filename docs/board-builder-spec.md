# Spec: in-browser Board Builder (proposed, tier 2)

## Problem

The KiCad generator is the right tool for Espressif's own modules (anti-drift, exact official symbols), but it is a wall for outside contributors, especially for third-party boards that are not in Espressif's KiCad library at all. Tier 1 (the [BoardSpec + validator](adding-a-board.md)) lowers the barrier to "edit a JSON file and run the tests." The Board Builder removes the barrier entirely: add a board in the browser, no repo, no JSON, no local dev.

## What it is

A page at `/build` (or `/boards/new`) where someone:

1. Picks a base ESP32 chip from the existing catalog.
2. Sets board name and PCB color.
3. Adds header pads on each side and assigns each to a GPIO from a dropdown that only offers real pins of the base chip (or marks it as a power/GND/NC pad).
4. Optionally gives a GPIO a board silk label and a gotcha note.
5. Sees a live preview rendered by the existing `ModuleDiagram` / `SchematicDiagram` as they edit.
6. Exports: download the `*.board.json`, copy it, or open a prefilled GitHub issue/PR with it attached.

## Why it is feasible

- The output format and the resolver already exist: `src/data/boards/{types,resolveBoard}.ts`. The builder is a UI that produces a `BoardSpec` and calls `resolveBoard` for live validation and preview.
- Rendering is free: the preview is the current diagram components fed the resolved `Chip`.
- It is spiritually the existing `MappingBuilder`, so it reuses the app's state and styling patterns.
- Correctness is enforced by construction: GPIO options come from the base chip, so capabilities and constraints are always inherited and never hand-entered.

## Scope guardrails

- **Boards only** (header-row layouts). Castellated module symbols (WROOM pads on three sides) stay generator-only; do not try to build a general symbol editor.
- **No auto-publish.** Export produces a reviewable artifact (issue/PR). Accepted boards get registered into the catalog by a maintainer. This keeps the accuracy gate intact.
- **Local drafts** in `localStorage` so a half-built board survives a refresh.

## Data model changes

- None required for tier 1 reuse. For per-pin board gotchas to render as real pin constraints (not just chip-level notes), add a `'board_specific'` member to `ConstraintId` in `src/types/chip.ts` and have `resolveBoard` emit it from `overrides[].note`/`severity`. Optional; the current version routes board notes to the chip-level "Known Gotchas" banner.

## Rough effort

- Builder UI + state: the bulk of the work.
- Export + prefilled issue/PR: small (reuse `src/utils/github.ts`).
- Preview wiring: small (feed resolved `Chip` to existing components).
- Registering accepted boards: a maintainer step, optionally scriptable later.

## Open questions

- Public route in the header, or an unlisted `/build` linked only from `/contribute`?
- Should the builder also let people tweak an existing board (edit mode), which doubles as a "customize this dev board" feature even for non-contributors?
- Import an existing `*.board.json` back into the builder for round-tripping?
