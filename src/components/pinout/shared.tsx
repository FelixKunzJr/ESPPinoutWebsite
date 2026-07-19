import type { Pin, Chip, ModuleInfo, ConstraintId, Severity } from '../../types/chip'

export const ROW_H = 30

// ─── Function colors: single source of truth ──────────────────────────────────
// Every view (schematic text, module badges, connector dots) and the legend
// derive their colors from this one map, so they can never drift apart.
// Tones are chosen to read both as badges on the dark UI and as text on the
// light schematic sheet.

export type FnCategory =
  | 'power' | 'gnd' | 'adc1' | 'adc2' | 'dac' | 'touch'
  | 'gpio' | 'spi' | 'i2c' | 'uart' | 'clock' | 'enrtc'
  | 'usb' | 'sd' | 'jtag' | 'strap' | 'nc' | 'other'

export const FN_COLOR: Record<FnCategory, string> = {
  power: '#dc2626',
  gnd:   '#111827',
  adc1:  '#ea580c',
  adc2:  '#d97706',
  dac:   '#a16207',
  touch: '#15803d',
  gpio:  '#475569',
  spi:   '#2563eb',
  i2c:   '#7c3aed',
  uart:  '#0891b2',
  clock: '#0369a1',
  enrtc: '#0f766e',
  usb:   '#be185d',
  sd:    '#4338ca',
  jtag:  '#57534e',
  strap: '#eab308',
  nc:    '#6b7280',
  other: '#6b7280',
}

// Classify a single pin-function name token into a color category.
export function fnCategory(name: string): FnCategory {
  const u = name.toUpperCase()
  if (/^GND$/.test(u))                                               return 'gnd'
  if (/^3V3$|^VCC$|^3\.3V$|^VIN$|^VBUS$|^5V$/.test(u))             return 'power'
  if (/^EN$|^RST$|^RESET$|^ENABLE$/.test(u))                       return 'enrtc'
  if (/^NC$/.test(u))                                                return 'nc'
  if (/^ADC1/.test(u))                                               return 'adc1'
  if (/^ADC2/.test(u))                                               return 'adc2'
  if (/^DAC\d?$/.test(u))                                            return 'dac'
  if (/^TOUCH/.test(u))                                              return 'touch'
  if (/^RTC/.test(u))                                                return 'enrtc'
  if (/USB|JTAG/.test(u))                                            return 'usb'
  if (/^MT(DI|CK|MS|DO)$/.test(u))                                  return 'jtag'
  if (/MOSI$|MISO$|^SCK$|VSPI|HSPI/.test(u))                       return 'spi'
  if (/SDA$|SCL$/.test(u))                                           return 'i2c'
  if (/^U[0-9]?(TXD?|RXD?|CTS|RTS)$|^TX\d?$|^RX\d?$/.test(u))      return 'uart'
  if (/^SD_|^CMD$|^SD[0-9]$/.test(u))                              return 'sd'
  if (/CLK|XTAL|^32K/.test(u))                                      return 'clock'
  if (/^GPIO\d/.test(u))                                             return 'gpio'
  return 'other'
}

// Color for a function-name token (used by the schematic annotation text).
export function fnColor(name: string): string {
  return FN_COLOR[fnCategory(name)]
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

export function getBadge(name: string): { bg: string; text: string } {
  const cat = fnCategory(name)
  if (cat === 'gnd')  return { bg: FN_COLOR.gnd, text: '#9ca3af' }
  if (cat === 'nc')   return { bg: '#1f2937',    text: '#6b7280' }
  if (cat === 'jtag') return { bg: FN_COLOR.jtag, text: '#e7e5e4' }
  if (cat === 'other') return { bg: '#374151',   text: '#9ca3af' }
  return { bg: FN_COLOR[cat], text: '#fff' }
}

export function connectorColor(pin: Pin): string {
  if (!pin.isUsable || pin.constraints.some(c => c.severity === 'danger')) return '#374151'
  if (pin.capabilities.includes('adc1'))   return FN_COLOR.adc1
  if (pin.capabilities.includes('adc2'))   return FN_COLOR.adc2
  if (pin.capabilities.includes('dac'))    return FN_COLOR.dac
  if (pin.capabilities.includes('touch'))  return FN_COLOR.touch
  if (pin.capabilities.includes('i2c'))    return FN_COLOR.i2c
  if (pin.capabilities.includes('spi'))    return FN_COLOR.spi
  if (pin.capabilities.includes('uart'))   return FN_COLOR.uart
  if (pin.constraints.some(c => c.id === 'strapping_pin')) return FN_COLOR.strap
  return FN_COLOR.gpio
}

export function sortedNames(names: string[], side: 'left' | 'right'): string[] {
  const gpio = names.filter(n => /^GPIO\d/.test(n))
  const other = names.filter(n => !/^GPIO\d/.test(n))
  return side === 'left' ? [...other, ...gpio] : [...gpio, ...other]
}

// ─── Special-pin badge (GND / 3V3 / EN / NC) ─────────────────────────────────

export function SpecialBadge({ label }: { label: string }) {
  const { bg, text } = getBadge(label)
  return (
    <span
      className="font-mono font-bold rounded-sm flex-shrink-0"
      style={{ background: bg, color: text, fontSize: 10, lineHeight: '17px', height: 17, padding: '0 6px' }}
    >
      {label}
    </span>
  )
}

// ─── Constraint → "what's affected" in one word ───────────────────────────────

// One-word summary of what each constraint affects.
export const AFFECTED_WORD: Record<ConstraintId, string> = {
  adc2_no_wifi:    'ADC2',
  input_only:      'In-only',
  strapping_pin:   'Boot',
  flash_reserved:  'Flash',
  psram_reserved:  'PSRAM',
  ospi_reserved:   'PSRAM',
  boot_must_float: 'Boot',
  boot_must_high:  'Boot',
  boot_must_low:   'Boot',
  usb_jtag:        'USB',
  limited_current: 'Current',
  no_pullup:       'Pull-up',
}

// Constraints whose ⚠ is pinned onto the specific function badge it concerns
// (e.g. the ADC2/USB badge) rather than shown as a separate word chip.
const ATTACHED_IDS = new Set<ConstraintId>(['adc2_no_wifi', 'usb_jtag'])

export function sevStyle(sev: Severity) {
  return sev === 'danger'
    ? { bg: '#7f1d1d', fg: '#fca5a5', bd: '#ef4444', icon: '✕' }
    : { bg: '#78350f', fg: '#fde68a', bd: '#f59e0b', icon: '⚠' }
}

// If a constraint attaches to this badge name, return its severity (else null).
function attachedSeverity(pin: Pin, name: string): Severity | null {
  for (const c of pin.constraints) {
    if (c.id === 'adc2_no_wifi' && /^ADC2/.test(name)) return c.severity
    if (c.id === 'usb_jtag' && /USB/i.test(name)) return c.severity
  }
  return null
}

// Word chips for constraints not tied to a specific badge, deduped by word.
function constraintWords(pin: Pin): { word: string; sev: Severity }[] {
  const m = new Map<string, Severity>()
  for (const c of pin.constraints) {
    if (ATTACHED_IDS.has(c.id)) continue
    const word = AFFECTED_WORD[c.id] ?? 'Note'
    if (m.get(word) !== 'danger') m.set(word, c.severity)
  }
  return [...m].map(([word, sev]) => ({ word, sev }))
}

// Highest-priority single constraint for the compact top/bottom columns.
export function primaryConstraint(pin: Pin): { word: string; sev: Severity; title: string } | null {
  if (!pin.constraints.length) return null
  const danger = pin.constraints.find(c => c.severity === 'danger')
  const c = danger ?? pin.constraints[0]
  return { word: AFFECTED_WORD[c.id] ?? 'Note', sev: c.severity, title: pin.constraints.map(k => k.title).join(' · ') }
}

// ─── Shared row content: constraint chips + function badges ───────────────────

export function ConstraintChips({ pin }: { pin: Pin }) {
  return (
    <>
      {constraintWords(pin).map(({ word, sev }) => {
        const s = sevStyle(sev)
        return (
          <span key={word} className="font-mono font-bold rounded-sm flex-shrink-0 flex items-center"
            style={{ background: s.bg, color: s.fg, border: `1px solid ${s.bd}`, fontSize: 10, lineHeight: '15px', height: 17, padding: '0 5px', gap: 3 }}>
            <span style={{ fontSize: 11 }}>{s.icon}</span>{word}
          </span>
        )
      })}
    </>
  )
}

export function FunctionBadges({ pin, side, mappingLabel }: { pin: Pin; side: 'left' | 'right'; mappingLabel?: string }) {
  const names = sortedNames(pin.names, side)
  return (
    <>
      {mappingLabel && (
        <span className="font-mono font-bold rounded-sm flex-shrink-0"
          style={{ background: 'var(--map-chip-bg)', color: 'var(--map-chip-text)', fontSize: 10, lineHeight: '17px', height: 17, padding: '0 5px' }}>
          {mappingLabel}
        </span>
      )}
      {names.map(name => {
        const { bg, text } = getBadge(name)
        const sev = attachedSeverity(pin, name)
        if (!sev) {
          return (
            <span key={name} className="font-mono font-bold rounded-sm flex-shrink-0"
              style={{ background: bg, color: text, fontSize: 10, lineHeight: '17px', height: 17, padding: '0 5px' }}>
              {name}
            </span>
          )
        }
        // ⚠ fused onto the affected badge (e.g. ADC2 / USB) so it's clear what's at issue.
        const s = sevStyle(sev)
        return (
          <span key={name} className="flex-shrink-0 flex items-stretch" style={{ height: 17 }}>
            <span className="font-mono font-bold flex items-center"
              style={{ background: bg, color: text, fontSize: 10, padding: '0 5px', borderRadius: '2px 0 0 2px' }}>
              {name}
            </span>
            <span className="font-mono font-bold flex items-center justify-center"
              style={{ background: s.bg, color: s.fg, fontSize: 11, padding: '0 4px', borderRadius: '0 2px 2px 0', borderLeft: `1px solid ${s.bd}` }}>
              {s.icon}
            </span>
          </span>
        )
      })}
    </>
  )
}

// ─── Module identity ──────────────────────────────────────────────────────────

// Default module identity for chips that don't declare one yet.
export function resolveModule(chip: Chip): ModuleInfo {
  if (chip.module) return chip.module
  return {
    name: chip.packageLayout?.name ?? chip.family,
    form: 'wroom',
    arch: `${chip.cores}-core`,
    pcb: 'green',
    accent: '#3b82f6',
    radios: [chip.hasWifi && 'Wi-Fi', chip.hasBluetooth && 'BT', chip.hasBle && 'BLE'].filter(Boolean).join(' · '),
  }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

export interface LegendItem { bg: string; text: string; label: string }

// Legend entries for the active view, derived from FN_COLOR so the swatches
// always match what the diagram actually draws. Only the categories a given
// view renders are shown.
export function legendFor(view: 'schematic' | 'module'): LegendItem[] {
  const C = FN_COLOR
  const fns: LegendItem[] = [
    { bg: C.power, text: '#fff',     label: 'Power' },
    { bg: C.gnd,   text: '#9ca3af',  label: 'GND' },
    { bg: C.adc1,  text: '#fff',     label: 'ADC1 (WiFi-safe)' },
    { bg: C.adc2,  text: '#fff',     label: 'ADC2 (WiFi conflict)' },
    { bg: C.dac,   text: '#fff',     label: 'DAC' },
    { bg: C.touch, text: '#fff',     label: 'Touch' },
    { bg: C.gpio,  text: '#fff',     label: 'GPIO' },
    { bg: C.spi,   text: '#fff',     label: 'SPI' },
    { bg: C.i2c,   text: '#fff',     label: 'I2C' },
    { bg: C.uart,  text: '#fff',     label: 'UART' },
    { bg: C.clock, text: '#fff',     label: 'Clock' },
    { bg: C.enrtc, text: '#fff',     label: 'EN / RTC' },
    { bg: C.usb,   text: '#fff',     label: 'USB / JTAG' },
    { bg: C.sd,    text: '#fff',     label: 'SD' },
  ]
  // View-specific extras: the schematic labels the JTAG strap pins (MTxx);
  // the module view tints strapping pins on the connector dot.
  if (view === 'schematic') fns.push({ bg: C.jtag, text: '#e7e5e4', label: 'JTAG (MTxx)' })
  else                      fns.push({ bg: C.strap, text: '#1c1917', label: 'Strapping' })

  return [
    ...fns,
    { bg: '#7f1d1d', text: '#fca5a5', label: '✕ Danger' },
    { bg: '#78350f', text: '#fde68a', label: '⚠ Warning' },
  ]
}
