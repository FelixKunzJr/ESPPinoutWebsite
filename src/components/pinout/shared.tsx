import type { Pin, Chip, ModuleInfo, ConstraintId, Severity } from '../../types/chip'

export const ROW_H = 30

// ─── Badge helpers ────────────────────────────────────────────────────────────

export function getBadge(name: string): { bg: string; text: string } {
  const u = name.toUpperCase()
  if (u === 'GND')                                                        return { bg: '#111827', text: '#9ca3af' }
  if (/^3V3$|^VCC$|^3\.3V$/.test(u))                                    return { bg: '#dc2626', text: '#fff' }
  if (/^VIN$|^VBUS$|^5V$/.test(u))                                       return { bg: '#b91c1c', text: '#fff' }
  if (/^EN$|^RST$|^RESET$|^ENABLE$/.test(u))                            return { bg: '#0f766e', text: '#fff' }
  if (/^NC$/.test(u))                                                      return { bg: '#1f2937', text: '#6b7280' }
  if (/^ADC1/.test(u))                                                    return { bg: '#ea580c', text: '#fff' }
  if (/^ADC2/.test(u))                                                    return { bg: '#d97706', text: '#fff' }
  if (/^DAC\d?$/.test(u))                                                 return { bg: '#ca8a04', text: '#fff' }
  if (/^TOUCH/.test(u))                                                   return { bg: '#16a34a', text: '#fff' }
  if (/^RTC/.test(u))                                                     return { bg: '#0f766e', text: '#fff' }
  if (/MOSI$|MISO$|^SCK$|VSPI|HSPI/.test(u))                            return { bg: '#2563eb', text: '#fff' }
  if (/SDA$|SCL$/.test(u))                                                return { bg: '#7c3aed', text: '#fff' }
  if (/^U[0-9]?(TXD?|RXD?|CTS|RTS)$|^TX\d?$|^RX\d?$/.test(u))        return { bg: '#0891b2', text: '#fff' }
  if (/^GPIO\d/.test(u))                                                  return { bg: '#6d28d9', text: '#fff' }
  if (/^SD_/.test(u))                                                     return { bg: '#4338ca', text: '#fff' }
  if (/USB|JTAG/.test(u))                                                 return { bg: '#be185d', text: '#fff' }
  if (/CLK|XTAL/.test(u))                                                 return { bg: '#0369a1', text: '#fff' }
  if (/^MT(DI|CK|MS|DO)$/.test(u))                                       return { bg: '#292524', text: '#a8a29e' }
  if (/^VP$|^VN$/.test(u))                                                return { bg: '#374151', text: '#d1d5db' }
  return                                                                          { bg: '#374151', text: '#9ca3af' }
}

export function connectorColor(pin: Pin): string {
  if (!pin.isUsable || pin.constraints.some(c => c.severity === 'danger')) return '#374151'
  if (pin.capabilities.includes('adc1'))   return '#ea580c'
  if (pin.capabilities.includes('adc2'))   return '#d97706'
  if (pin.capabilities.includes('dac'))    return '#ca8a04'
  if (pin.capabilities.includes('touch'))  return '#16a34a'
  if (pin.capabilities.includes('i2c'))    return '#7c3aed'
  if (pin.capabilities.includes('spi'))    return '#2563eb'
  if (pin.capabilities.includes('uart'))   return '#0891b2'
  if (pin.constraints.some(c => c.id === 'strapping_pin')) return '#eab308'
  return '#6b7280'
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
          style={{ background: 'rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: 10, lineHeight: '17px', height: 17, padding: '0 5px' }}>
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

export const LEGEND = [
  { bg: '#dc2626', text: '#fff',     label: 'Power' },
  { bg: '#111827', text: '#9ca3af',  label: 'GND' },
  { bg: '#ea580c', text: '#fff',     label: 'ADC1 (WiFi-safe)' },
  { bg: '#d97706', text: '#fff',     label: 'ADC2 (WiFi conflict)' },
  { bg: '#ca8a04', text: '#fff',     label: 'DAC' },
  { bg: '#16a34a', text: '#fff',     label: 'Touch' },
  { bg: '#6d28d9', text: '#fff',     label: 'GPIO' },
  { bg: '#2563eb', text: '#fff',     label: 'SPI' },
  { bg: '#7c3aed', text: '#fff',     label: 'I2C' },
  { bg: '#0891b2', text: '#fff',     label: 'UART' },
  { bg: '#0369a1', text: '#fff',     label: 'Clock' },
  { bg: '#0f766e', text: '#fff',     label: 'EN / RTC' },
  { bg: '#7f1d1d', text: '#fca5a5',  label: '✕ Danger' },
  { bg: '#78350f', text: '#fde68a',  label: '⚠ Warning' },
] as const
