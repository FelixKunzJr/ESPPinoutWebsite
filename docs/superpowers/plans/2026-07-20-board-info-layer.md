# Board Info Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-chip/board reference content (specs, flashing/wiring, minimal ESPHome config) as collapsible sections below the pinout diagram.

**Architecture:** Authoritative family specs live in a new `specs.ts` table (we own). Board-specific flashing + ESPHome content lives in a community-contributable `contrib/info/<id>.json` overlay, loaded via `import.meta.glob`. A `resolveInfo(chip)` function merges them; three React sections render the result, with contribute buttons where content is absent.

**Tech Stack:** Vite 8 + React 18 + TypeScript + Tailwind 3 + Vitest + @testing-library/react.

## Global Constraints

- No en/em dashes anywhere in UI text, code, or content — plain hyphens only.
- Do not commit a Claude co-author trailer on commits in this repo.
- Do not hand-edit `src/data/chips/generated.ts` — it is regenerated.
- Family strings (exact, from `FAMILIES` in `catalog.ts`): `ESP32`, `ESP32-S2`, `ESP32-S3`, `ESP32-C3`, `ESP32-C6`, `ESP32-C5`, `ESP32-H2`.
- Run `npx tsc --noEmit` and `npm test -- --run` green before every commit.

---

### Task 1: Specs data table

**Files:**
- Create: `src/data/chips/specs.ts`
- Test: `tests/specs.test.ts`

**Interfaces:**
- Produces: `interface ChipSpecs { cores: number; arch: string; cpuMaxMhz: number; sramKb: number; romKb: number; flash?: string; psram?: string; notable?: string[] }`
- Produces: `FAMILY_SPECS: Record<string, ChipSpecs>` (keyed by family string)
- Produces: `SKU_OVERRIDES: Record<string, { flash?: string; psram?: string }>` (keyed by chip id)

- [ ] **Step 1: Write the failing test**

```ts
// tests/specs.test.ts
import { describe, it, expect } from 'vitest'
import { FAMILY_SPECS } from '../src/data/chips/specs'
import { CHIPS } from '../src/data/chips'

describe('chip specs', () => {
  it('has a spec entry for every family present in the catalog', () => {
    const families = [...new Set(CHIPS.map(c => c.family))]
    for (const fam of families) {
      expect(FAMILY_SPECS[fam], `missing specs for ${fam}`).toBeDefined()
      expect(FAMILY_SPECS[fam].cpuMaxMhz).toBeGreaterThan(0)
      expect(FAMILY_SPECS[fam].sramKb).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/specs.test.ts`
Expected: FAIL — cannot find module `../src/data/chips/specs`.

- [ ] **Step 3: Write the implementation**

Values below are datasheet figures. Before committing, verify each against the
official Espressif datasheet for that family (SRAM/ROM/clock especially) and
correct any that differ.

```ts
// src/data/chips/specs.ts
export interface ChipSpecs {
  cores: number
  arch: string
  cpuMaxMhz: number
  sramKb: number
  romKb: number
  flash?: string     // typical + SKU note
  psram?: string
  notable?: string[]
}

export const FAMILY_SPECS: Record<string, ChipSpecs> = {
  'ESP32': {
    cores: 2, arch: 'Dual-core Xtensa LX6', cpuMaxMhz: 240, sramKb: 520, romKb: 448,
    flash: '4 MB typical; SKUs up to 16 MB', psram: 'None on WROOM; up to 8 MB on WROVER',
    notable: ['Ethernet MAC (RMII)', '10 touch channels', '2x DAC'],
  },
  'ESP32-S2': {
    cores: 1, arch: 'Single-core Xtensa LX7', cpuMaxMhz: 240, sramKb: 320, romKb: 128,
    flash: 'Up to 4 MB (module SKU)', psram: 'Up to 2 MB (module SKU)',
    notable: ['Native USB-OTG', '14 touch channels', '1x DAC'],
  },
  'ESP32-S3': {
    cores: 2, arch: 'Dual-core Xtensa LX7', cpuMaxMhz: 240, sramKb: 512, romKb: 384,
    flash: 'Up to 16 MB (module SKU)', psram: 'Up to 8 MB (module SKU)',
    notable: ['Native USB-OTG', 'AI vector instructions', '14 touch channels'],
  },
  'ESP32-C3': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 160, sramKb: 400, romKb: 384,
    flash: 'Up to 4 MB (module SKU)', psram: 'None',
    notable: ['USB Serial/JTAG'],
  },
  'ESP32-C6': {
    cores: 1, arch: 'Single-core RISC-V (HP) + LP core', cpuMaxMhz: 160, sramKb: 512, romKb: 320,
    flash: 'Up to 8 MB (module SKU)', psram: 'None',
    notable: ['Wi-Fi 6', '802.15.4 (Zigbee/Thread)', 'USB Serial/JTAG'],
  },
  'ESP32-C5': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 240, sramKb: 384, romKb: 320,
    flash: 'Up to 8 MB (module SKU)', psram: 'None',
    notable: ['Dual-band Wi-Fi 6 (2.4 + 5 GHz)', '802.15.4', 'USB Serial/JTAG'],
  },
  'ESP32-H2': {
    cores: 1, arch: 'Single-core RISC-V', cpuMaxMhz: 96, sramKb: 320, romKb: 128,
    flash: 'Up to 4 MB (module SKU)', psram: 'None',
    notable: ['No Wi-Fi', '802.15.4 + BLE 5 (Zigbee/Thread/Matter)'],
  },
}

// Per-module SKU overrides where flash/PSRAM differ from the family default.
export const SKU_OVERRIDES: Record<string, { flash?: string; psram?: string }> = {
  esp32wrover: { psram: '8 MB PSRAM (WROVER-E)' },
  esp32pico: { flash: '4 MB in-package (PICO-MINI-02)' },
  esp32s2wrover: { psram: '2 MB PSRAM' },
  esp32s3wroom2: { flash: '16 MB', psram: '8 MB Octal PSRAM' },
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/specs.test.ts`
Expected: PASS.

- [ ] **Step 5: Verify values, then commit**

Verify each `FAMILY_SPECS` figure against the Espressif datasheet; fix mismatches.

```bash
git add src/data/chips/specs.ts tests/specs.test.ts
git commit -m "feat: datasheet spec table for every ESP32 family"
```

---

### Task 2: Info types and resolveInfo

**Files:**
- Create: `src/data/info/types.ts`
- Create: `src/data/info/resolveInfo.ts`
- Test: `tests/resolveInfo.test.ts`

**Interfaces:**
- Consumes: `ChipSpecs`, `FAMILY_SPECS`, `SKU_OVERRIDES` from Task 1; `Chip` from `src/types/chip`.
- Produces: `interface FlashingInfo { autoFlash: boolean; manualSteps?: string[]; wiring?: string; note?: string }`
- Produces: `interface EsphomeInfo { yaml: string; notes?: string[] }`
- Produces: `interface InfoOverlay { flashing?: FlashingInfo; esphome?: EsphomeInfo }`
- Produces: `interface BoardInfo { specs: ChipSpecs; flashing?: FlashingInfo; esphome?: EsphomeInfo }`
- Produces: `function resolveInfo(chip: Chip): BoardInfo`

- [ ] **Step 1: Write the failing test**

```ts
// tests/resolveInfo.test.ts
import { describe, it, expect } from 'vitest'
import { resolveInfo } from '../src/data/info/resolveInfo'
import { getChip } from '../src/data/chips'

describe('resolveInfo', () => {
  it('returns specs for every chip', () => {
    const esp32 = getChip('esp32')!
    const info = resolveInfo(esp32)
    expect(info.specs.cpuMaxMhz).toBe(240)
    expect(info.specs.cores).toBe(2)
  })

  it('applies SKU overrides for flash/psram', () => {
    const wrover = getChip('esp32wrover')!
    expect(resolveInfo(wrover).specs.psram).toMatch(/WROVER/)
  })

  it('leaves flashing and esphome undefined when no overlay exists', () => {
    // esp32h2 has no seeded overlay in Task 3
    const info = resolveInfo(getChip('esp32h2')!)
    expect(info.flashing).toBeUndefined()
    expect(info.esphome).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/resolveInfo.test.ts`
Expected: FAIL — cannot find module `resolveInfo`.

- [ ] **Step 3: Write the implementation**

```ts
// src/data/info/types.ts
export interface FlashingInfo {
  autoFlash: boolean
  manualSteps?: string[]
  wiring?: string
  note?: string
}

export interface EsphomeInfo {
  yaml: string
  notes?: string[]
}

export interface InfoOverlay {
  flashing?: FlashingInfo
  esphome?: EsphomeInfo
}
```

```ts
// src/data/info/resolveInfo.ts
import type { Chip } from '../../types/chip'
import type { ChipSpecs } from '../chips/specs'
import { FAMILY_SPECS, SKU_OVERRIDES } from '../chips/specs'
import type { InfoOverlay } from './types'

export interface BoardInfo {
  specs: ChipSpecs
  flashing?: InfoOverlay['flashing']
  esphome?: InfoOverlay['esphome']
}

// Community-contributable content: one JSON file per chip/board id under
// contrib/info/. Dropping in a file is enough - no code edit needed.
const modules = import.meta.glob<{ default: InfoOverlay }>(
  '../../../contrib/info/*.json',
  { eager: true },
)
const OVERLAY: Record<string, InfoOverlay> = {}
for (const [path, mod] of Object.entries(modules)) {
  const id = path.split('/').pop()!.replace(/\.json$/, '')
  OVERLAY[id] = mod.default
}

export function resolveInfo(chip: Chip): BoardInfo {
  const base = FAMILY_SPECS[chip.family]
  const sku = SKU_OVERRIDES[chip.id]
  const specs: ChipSpecs = { ...base, ...(sku ?? {}) }
  const overlay = OVERLAY[chip.id]
  return { specs, flashing: overlay?.flashing, esphome: overlay?.esphome }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/resolveInfo.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/info/types.ts src/data/info/resolveInfo.ts tests/resolveInfo.test.ts
git commit -m "feat: resolveInfo merges family specs with the contrib/info overlay"
```

---

### Task 3: Contribute URL + seed overlay content

**Files:**
- Modify: `src/utils/github.ts` (append one function)
- Create: `contrib/info/esp32.json`, `contrib/info/esp32wrover.json`, `contrib/info/esp32devkitc.json`, `contrib/info/esp32s3devkitc.json`, `contrib/info/esp32c3devkitm.json`, `contrib/info/esp32devkit38.json`
- Test: `tests/boardInfoSeed.test.ts`

**Interfaces:**
- Consumes: `resolveInfo` from Task 2; `REPO_URL`, `Chip` from existing `github.ts`.
- Produces: `function boardInfoIssueUrl(chip: Chip, section: 'flashing' | 'esphome'): string`

- [ ] **Step 1: Write the failing test**

```ts
// tests/boardInfoSeed.test.ts
import { describe, it, expect } from 'vitest'
import { resolveInfo } from '../src/data/info/resolveInfo'
import { getChip } from '../src/data/chips'
import { boardInfoIssueUrl } from '../src/utils/github'

describe('seeded board info', () => {
  it('bare WROOM-32 has manual flashing steps', () => {
    const f = resolveInfo(getChip('esp32')!).flashing
    expect(f?.autoFlash).toBe(false)
    expect(f?.wiring).toMatch(/GPIO0/)
  })

  it('DevKitC has a minimal ESPHome config', () => {
    const e = resolveInfo(getChip('esp32devkitc')!).esphome
    expect(e?.yaml).toMatch(/esp32:/)
    expect(e?.yaml).toMatch(/board:/)
  })

  it('builds a prefilled contribute issue url', () => {
    const url = boardInfoIssueUrl(getChip('esp32c6')!, 'esphome')
    expect(url).toMatch(/github\.com/)
    expect(decodeURIComponent(url)).toMatch(/esp32c6/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/boardInfoSeed.test.ts`
Expected: FAIL — `boardInfoIssueUrl` is not exported / seed files missing.

- [ ] **Step 3a: Append the contribute-url helper to `src/utils/github.ts`**

```ts
// Prefilled issue asking a contributor to supply flashing or ESPHome content
// for a specific board.
export function boardInfoIssueUrl(chip: Chip, section: 'flashing' | 'esphome'): string {
  const label = section === 'flashing' ? 'flashing / wiring steps' : 'a minimal ESPHome config'
  const title = `[info] ${chip.name}: ${section}`
  const body = [
    '**Chip / module:** ' + chip.name + ' (`' + chip.id + '`)',
    '**Section:** ' + section,
    '**Page:** ' + (typeof window !== 'undefined' ? window.location.href : 'https://esp32pin.com'),
    '',
    `Please add ${label} for this board.`,
    '',
    section === 'flashing'
      ? 'How do you put it into download mode? (auto over USB, hold BOOT + tap EN, pull GPIO0 to GND, etc.)'
      : '```yaml\n# minimal esp32: stanza that boots on this board\n```',
    '',
  ].join('\n')
  return `${REPO_URL}/issues/new?labels=info&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}
```

- [ ] **Step 3b: Create the seed files**

```json
// contrib/info/esp32.json
{
  "flashing": {
    "autoFlash": false,
    "wiring": "Pull GPIO0 to GND, hold EN (reset) LOW then HIGH while GPIO0 stays low, then release GPIO0 to enter download mode.",
    "manualSteps": [
      "Wire a USB-to-serial adapter: TX to GPIO3 (U0RXD), RX to GPIO1 (U0TXD), GND to GND, 3V3 to 3V3.",
      "Connect GPIO0 to GND.",
      "Pulse EN (reset) low then high.",
      "Flash, then disconnect GPIO0 from GND and reset to run."
    ],
    "note": "A bare module has no USB or auto-reset - use a carrier board or wire an adapter as above."
  }
}
```

```json
// contrib/info/esp32wrover.json
{
  "flashing": {
    "autoFlash": false,
    "wiring": "Pull GPIO0 to GND, pulse EN (reset), then release GPIO0 to enter download mode.",
    "note": "Same procedure as the WROOM-32; the WROVER adds PSRAM but the flashing pins are identical."
  }
}
```

```json
// contrib/info/esp32devkitc.json
{
  "esphome": {
    "yaml": "esphome:\n  name: my-device\n\nesp32:\n  board: esp32dev\n  framework:\n    type: esp-idf",
    "notes": ["ESPHome board key: esp32dev. Works for most classic ESP32 dev boards."]
  }
}
```

```json
// contrib/info/esp32s3devkitc.json
{
  "esphome": {
    "yaml": "esphome:\n  name: my-device\n\nesp32:\n  board: esp32-s3-devkitc-1\n  framework:\n    type: esp-idf",
    "notes": ["For USB-CDC logging add: logger:\n  hardware_uart: USB_SERIAL_JTAG"]
  }
}
```

```json
// contrib/info/esp32c3devkitm.json
{
  "esphome": {
    "yaml": "esphome:\n  name: my-device\n\nesp32:\n  board: esp32-c3-devkitm-1\n  framework:\n    type: esp-idf",
    "notes": ["RISC-V C3. For USB logging add: logger:\n  hardware_uart: USB_SERIAL_JTAG"]
  }
}
```

```json
// contrib/info/esp32devkit38.json
{
  "esphome": {
    "yaml": "esphome:\n  name: my-device\n\nesp32:\n  board: esp32dev\n  framework:\n    type: esp-idf",
    "notes": ["Generic 38-pin board (Elegoo / NodeMCU-32S). ESPHome board key: esp32dev."]
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run tests/boardInfoSeed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/github.ts contrib/info tests/boardInfoSeed.test.ts
git commit -m "feat: seed board-info content and add the contribute-issue helper"
```

---

### Task 4: CollapsibleCard + SpecsSection, wired into the page

**Files:**
- Create: `src/components/CollapsibleCard.tsx`
- Create: `src/components/info/SpecsSection.tsx`
- Modify: `src/App.tsx` (destructure already has `chip`; insert sections after `<RoutingCard />`)
- Test: `tests/SpecsSection.test.tsx`

**Interfaces:**
- Consumes: `resolveInfo` (Task 2), `useApp` from context.
- Produces: `CollapsibleCard({ title, defaultOpen, children })`, `SpecsSection()`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/SpecsSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SpecsSection } from '../src/components/info/SpecsSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><SpecsSection /></AppContext.Provider>)
}

describe('SpecsSection', () => {
  it('shows CPU clock and SRAM for the current chip', () => {
    renderWith('esp32')
    expect(screen.getByText(/240 MHz/)).toBeInTheDocument()
    expect(screen.getByText(/520 KB/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/SpecsSection.test.tsx`
Expected: FAIL — cannot find modules.

- [ ] **Step 3a: Create `CollapsibleCard`**

```tsx
// src/components/CollapsibleCard.tsx
import { useState, type ReactNode } from 'react'

export function CollapsibleCard({ title, defaultOpen = true, children }: {
  title: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-xs font-semibold text-gray-300">{title}</span>
        <span className="text-gray-500 text-xs">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 3b: Create `SpecsSection`**

```tsx
// src/components/info/SpecsSection.tsx
import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { CollapsibleCard } from '../CollapsibleCard'

export function SpecsSection() {
  const { chip } = useApp()
  const { specs } = resolveInfo(chip)
  const rows: Array<[string, string]> = [
    ['CPU', `${specs.cores}x ${specs.arch}, up to ${specs.cpuMaxMhz} MHz`],
    ['SRAM', `${specs.sramKb} KB`],
    ['ROM', `${specs.romKb} KB`],
    ...(specs.flash ? [['Flash', specs.flash] as [string, string]] : []),
    ...(specs.psram ? [['PSRAM', specs.psram] as [string, string]] : []),
    ['Radios', chip.module?.radios ?? ''],
  ]
  return (
    <CollapsibleCard title={`\u{1F4CB} Specs - ${chip.name}`}>
      <table className="w-full text-xs">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-gray-800/60 first:border-t-0">
              <td className="py-1.5 pr-3 text-gray-500 font-medium align-top whitespace-nowrap">{k}</td>
              <td className="py-1.5 text-gray-200">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {specs.notable && specs.notable.length > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          <span className="text-gray-500">Notable: </span>{specs.notable.join(' · ')}
        </p>
      )}
    </CollapsibleCard>
  )
}
```

- [ ] **Step 3c: Wire into `src/App.tsx`**

Add the import near the other component imports:

```tsx
import { SpecsSection } from './components/info/SpecsSection'
```

Insert directly after `<RoutingCard />` in the left column:

```tsx
            <RoutingCard />

            <SpecsSection />
```

- [ ] **Step 4: Run test + typecheck**

Run: `npm test -- --run tests/SpecsSection.test.tsx && npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/CollapsibleCard.tsx src/components/info/SpecsSection.tsx src/App.tsx tests/SpecsSection.test.tsx
git commit -m "feat: specs section below the pinout diagram"
```

---

### Task 5: FlashingSection

**Files:**
- Create: `src/components/info/FlashingSection.tsx`
- Modify: `src/App.tsx` (insert after `<SpecsSection />`)
- Test: `tests/FlashingSection.test.tsx`

**Interfaces:**
- Consumes: `resolveInfo` (Task 2), `boardInfoIssueUrl` (Task 3), `CollapsibleCard` (Task 4), `useApp`.
- Rendering rules: overlay flashing present -> render it; else if `chip.module?.form === 'board'` -> generic auto-flash default; else -> contribute button.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/FlashingSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FlashingSection } from '../src/components/info/FlashingSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><FlashingSection /></AppContext.Provider>)
}

describe('FlashingSection', () => {
  it('renders seeded manual steps for a bare module', () => {
    renderWith('esp32')
    expect(screen.getByText(/GPIO0/)).toBeInTheDocument()
  })
  it('shows the auto-flash default for a devkit with no overlay', () => {
    renderWith('esp32c6devkitc')
    expect(screen.getByText(/auto-reset|BOOT/i)).toBeInTheDocument()
  })
  it('shows a contribute button for a bare module family with no overlay', () => {
    renderWith('esp32h2')
    expect(screen.getByRole('link', { name: /add flashing/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/FlashingSection.test.tsx`
Expected: FAIL — cannot find module.

- [ ] **Step 3a: Create `FlashingSection`**

```tsx
// src/components/info/FlashingSection.tsx
import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { boardInfoIssueUrl } from '../../utils/github'
import { CollapsibleCard } from '../CollapsibleCard'

export function FlashingSection() {
  const { chip } = useApp()
  const { flashing } = resolveInfo(chip)
  const isBoard = chip.module?.form === 'board'

  return (
    <CollapsibleCard title="\u{1F517} Flashing / wiring" defaultOpen={false}>
      {flashing ? (
        <div className="space-y-2 text-xs text-gray-300">
          {flashing.autoFlash
            ? <p>USB auto-flash: connect USB and upload. If it will not enter download mode, hold BOOT, tap EN/RST, then release BOOT.</p>
            : flashing.wiring && <p className="text-gray-200">{flashing.wiring}</p>}
          {flashing.manualSteps && (
            <ol className="list-decimal pl-4 space-y-1 text-gray-400">
              {flashing.manualSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          {flashing.note && <p className="text-gray-500">{flashing.note}</p>}
        </div>
      ) : isBoard ? (
        <p className="text-xs text-gray-300">
          Most dev boards have an onboard USB-serial chip with auto-reset: just connect USB and upload. If it will not enter download mode, hold BOOT, tap EN/RST, then release BOOT.
        </p>
      ) : (
        <a
          href={boardInfoIssueUrl(chip, 'flashing')}
          target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs font-semibold rounded-md px-3 py-1.5"
          style={{ color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.25)' }}
        >
          Add flashing steps for this board →
        </a>
      )}
    </CollapsibleCard>
  )
}
```

- [ ] **Step 3b: Wire into `src/App.tsx`**

Add import and insert after `<SpecsSection />`:

```tsx
import { FlashingSection } from './components/info/FlashingSection'
```
```tsx
            <SpecsSection />

            <FlashingSection />
```

- [ ] **Step 4: Run test + typecheck**

Run: `npm test -- --run tests/FlashingSection.test.tsx && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/info/FlashingSection.tsx src/App.tsx tests/FlashingSection.test.tsx
git commit -m "feat: flashing / wiring section with auto-flash default and contribute fallback"
```

---

### Task 6: EsphomeSection

**Files:**
- Create: `src/components/info/EsphomeSection.tsx`
- Modify: `src/App.tsx` (insert after `<FlashingSection />`)
- Test: `tests/EsphomeSection.test.tsx`

**Interfaces:**
- Consumes: `resolveInfo` (Task 2), `boardInfoIssueUrl` (Task 3), `CollapsibleCard` (Task 4), `useApp`.

- [ ] **Step 1: Write the failing test**

```tsx
// tests/EsphomeSection.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EsphomeSection } from '../src/components/info/EsphomeSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><EsphomeSection /></AppContext.Provider>)
}

describe('EsphomeSection', () => {
  it('renders the seeded YAML for the DevKitC', () => {
    renderWith('esp32devkitc')
    expect(screen.getByText(/board: esp32dev/)).toBeInTheDocument()
  })
  it('shows a contribute button when there is no config', () => {
    renderWith('esp32h2')
    expect(screen.getByRole('link', { name: /add esphome/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/EsphomeSection.test.tsx`
Expected: FAIL — cannot find module.

- [ ] **Step 3a: Create `EsphomeSection`** (copy-button pattern mirrors `ExportPanel`)

```tsx
// src/components/info/EsphomeSection.tsx
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { resolveInfo } from '../../data/info/resolveInfo'
import { boardInfoIssueUrl } from '../../utils/github'
import { CollapsibleCard } from '../CollapsibleCard'

export function EsphomeSection() {
  const { chip } = useApp()
  const { esphome } = resolveInfo(chip)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!esphome) return
    await navigator.clipboard.writeText(esphome.yaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <CollapsibleCard title="⚙ ESPHome config" defaultOpen={false}>
      {esphome ? (
        <div className="space-y-2">
          <pre className="bg-gray-800 border border-gray-700 rounded p-3 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre">{esphome.yaml}</pre>
          <button onClick={copy} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-200 transition-colors">
            {copied ? '✓ Copied' : 'Copy config'}
          </button>
          {esphome.notes && esphome.notes.map((n, i) => (
            <p key={i} className="text-xs text-gray-500 whitespace-pre-line">{n}</p>
          ))}
        </div>
      ) : (
        <a
          href={boardInfoIssueUrl(chip, 'esphome')}
          target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs font-semibold rounded-md px-3 py-1.5"
          style={{ color: '#fbbf24', border: '1px solid #78350f', background: 'rgba(120,53,15,0.25)' }}
        >
          Add ESPHome config for this board →
        </a>
      )}
    </CollapsibleCard>
  )
}
```

- [ ] **Step 3b: Wire into `src/App.tsx`**

Add import and insert after `<FlashingSection />`:

```tsx
import { EsphomeSection } from './components/info/EsphomeSection'
```
```tsx
            <FlashingSection />

            <EsphomeSection />
```

- [ ] **Step 4: Run full suite + typecheck + build**

Run: `npx tsc --noEmit && npm test -- --run && npm run build`
Expected: all PASS, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/info/EsphomeSection.tsx src/App.tsx tests/EsphomeSection.test.tsx
git commit -m "feat: ESPHome config section with copy button and contribute fallback"
```

---

## Notes for the implementer

- Escape sequences like `▾` in the code blocks are the actual characters to type (down/right triangles, wrench, gear, clipboard, arrow); use the literal glyph if clearer, but keep to plain hyphens in prose.
- `import.meta.glob` is a Vite feature and works under Vitest; the eager form returns modules synchronously so `resolveInfo` stays synchronous.
- After Task 6, manually load `npm run dev`, pick a bare module (esp32) and a devkit (esp32c6devkitc), and confirm the three sections render and the contribute links open a prefilled issue.
