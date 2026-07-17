import { useApp } from '../../context/AppContext'
import { filterPins } from '../../utils/filterPins'
import type { Pin, Chip, LayoutPin } from '../../types/chip'
import { ROW_H, connectorColor, SpecialBadge, ConstraintChips, FunctionBadges, resolveModule } from './shared'

const BODY_W = 190

// One row of the schematic symbol. Either a real pad (pin / special label with
// its physical pad number) or a collapsed group (all GND pads, all NC pads).
interface SchemRow {
  key: string
  pinNumber?: number
  pin?: Pin
  label?: string
  pads?: number[]      // collapsed group: every physical pad number in it
}

// Fold the physical package (all four edges) into two logically-ordered banks:
// power & control on the top-left, then GPIOs in ascending order flowing
// left → right, with GND / NC collapsed at the bottom-right.
function buildBanks(chip: Chip): { left: SchemRow[]; right: SchemRow[] } {
  const pinByGpio = new Map(chip.pins.map(p => [p.gpio, p]))

  let pads: LayoutPin[]
  if (chip.packageLayout) {
    const L = chip.packageLayout
    pads = [...L.left, ...L.bottom, ...L.right, ...(L.top ?? [])]
  } else {
    pads = [...chip.pins].sort((a, b) => a.gpio - b.gpio).map((p, i) => ({ pinNumber: i + 1, gpio: p.gpio }))
  }

  const gpioRows: SchemRow[] = []
  const powerRows: SchemRow[] = []
  const ctrlRows: SchemRow[] = []
  const otherRows: SchemRow[] = []
  const gndPads: number[] = []
  const ncPads: number[] = []
  const seen = new Set<number>()

  for (const lp of pads) {
    if (lp.gpio !== undefined) {
      if (seen.has(lp.gpio)) continue
      seen.add(lp.gpio)
      gpioRows.push({ key: `g${lp.gpio}`, pinNumber: lp.pinNumber, pin: pinByGpio.get(lp.gpio) })
      continue
    }
    const l = (lp.label ?? 'NC').toUpperCase()
    if (l === 'GND')                                     gndPads.push(lp.pinNumber)
    else if (l === 'NC')                                 ncPads.push(lp.pinNumber)
    else if (/^3V3$|^VCC|^5V$|^VIN|^VBUS|^3\.3V$/.test(l)) powerRows.push({ key: `s${lp.pinNumber}`, pinNumber: lp.pinNumber, label: lp.label })
    else if (/^EN$|^RST|^RESET|^CHIP_PU/.test(l))        ctrlRows.push({ key: `s${lp.pinNumber}`, pinNumber: lp.pinNumber, label: lp.label })
    else                                                 otherRows.push({ key: `s${lp.pinNumber}`, pinNumber: lp.pinNumber, label: lp.label })
  }

  gpioRows.sort((a, b) => (a.pin?.gpio ?? 999) - (b.pin?.gpio ?? 999))

  const leftExtras = [...powerRows, ...ctrlRows]
  const rightExtras: SchemRow[] = [...otherRows]
  if (gndPads.length) rightExtras.push({ key: 'gnd', label: 'GND', pads: gndPads.sort((a, b) => a - b) })
  if (ncPads.length)  rightExtras.push({ key: 'nc',  label: 'NC',  pads: ncPads.sort((a, b) => a - b) })

  // Balance total rows across the two banks.
  const G = gpioRows.length
  let leftG = Math.ceil((G + rightExtras.length - leftExtras.length) / 2)
  leftG = Math.max(0, Math.min(G, leftG))

  return {
    left:  [...leftExtras, ...gpioRows.slice(0, leftG)],
    right: [...gpioRows.slice(leftG), ...rightExtras],
  }
}

interface SchemRowProps {
  row: SchemRow
  side: 'left' | 'right'
  isSelected: boolean
  isFiltered: boolean
  mappingLabel?: string
  onClick: () => void
}

function SchematicRowView({ row, side, isSelected, isFiltered, mappingLabel, onClick }: SchemRowProps) {
  const { pin } = row
  const color = pin ? connectorColor(pin) : '#4b5563'

  const hasDanger  = !!pin?.constraints.some(c => c.severity === 'danger')
  const hasWarning = !hasDanger && !!pin?.constraints.length
  const rowBg = hasDanger ? 'rgba(239,68,68,0.07)' : hasWarning ? 'rgba(245,158,11,0.07)' : undefined

  // Collapsed-group note ("×3 · pads 1, 15, 38")
  const groupNote = row.pads ? (
    <span className="font-mono flex-shrink-0" style={{ fontSize: 9, color: '#5a6b80' }}>
      ×{row.pads.length} · pad{row.pads.length > 1 ? 's' : ''} {row.pads.join(', ')}
    </span>
  ) : null

  const content = pin
    ? (side === 'left'
        ? <><ConstraintChips pin={pin} /><FunctionBadges pin={pin} side="left" mappingLabel={mappingLabel} /></>
        : <><FunctionBadges pin={pin} side="right" mappingLabel={mappingLabel} /><ConstraintChips pin={pin} /></>)
    : (side === 'left'
        ? <>{groupNote}<SpecialBadge label={row.label ?? 'NC'} /></>
        : <><SpecialBadge label={row.label ?? 'NC'} />{groupNote}</>)

  const pinNumBox = (
    <div className="flex-shrink-0 flex items-center justify-center font-mono"
      title={row.pads ? `pads ${row.pads.join(', ')}` : undefined}
      style={{ width: 19, height: 17, background: '#0d1520', border: '1px solid #24344c', borderRadius: 2, fontSize: 7.5, fontWeight: 700, color: '#4d6484' }}>
      {row.pads ? `×${row.pads.length}` : row.pinNumber}
    </div>
  )

  // Square pad + stub line — schematic-style pin
  const pad  = <div className="flex-shrink-0" style={{ width: 7, height: 7, background: color, borderRadius: 1 }} />
  const stub = <div className="flex-shrink-0" style={{ width: 16, height: 1.5, background: color + '90' }} />

  const isActive = isFiltered || !pin

  return (
    <div
      onClick={onClick}
      className={`flex items-center select-none transition-colors
        ${pin ? 'cursor-pointer' : ''}
        ${isActive ? '' : 'opacity-[0.07]'}
        ${isSelected ? 'bg-violet-950/40' : 'hover:bg-white/[0.03]'}
      `}
      style={{ height: ROW_H, borderBottom: '1px solid #050a10', background: isSelected ? undefined : rowBg }}
    >
      {side === 'left' ? (
        <>
          <div className="flex-1 flex items-center justify-end gap-[3px] min-w-0 overflow-hidden pr-1.5">{content}</div>
          {pad}{stub}{pinNumBox}
        </>
      ) : (
        <>
          {pinNumBox}{stub}{pad}
          <div className="flex-1 flex items-center justify-start gap-[3px] min-w-0 overflow-hidden pl-1.5">{content}</div>
        </>
      )}
    </div>
  )
}

// ─── IC symbol body ───────────────────────────────────────────────────────────

function SymbolBody({ chip, height }: { chip: Chip; height: number }) {
  const m = resolveModule(chip)
  return (
    <div className="flex-shrink-0 relative" style={{ width: BODY_W, height, background: '#0b1322', border: '1.5px solid #3b557d', borderRadius: 6 }}>
      {/* top notch (pin-1 orientation mark, like a DIP symbol) */}
      <div style={{
        position: 'absolute', top: -1.5, left: '50%', transform: 'translateX(-50%)',
        width: 26, height: 13, background: '#060b12',
        border: '1.5px solid #3b557d', borderTop: 'none', borderRadius: '0 0 13px 13px',
      }} />
      {/* pin-1 dot */}
      <div style={{ position: 'absolute', top: 9, left: 9, width: 7, height: 7, borderRadius: 99, background: '#3b557d' }} />
      {/* centred identity */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2" style={{ gap: 4 }}>
        <span className="font-mono font-bold" style={{ fontSize: 12.5, color: '#cbd5e1', letterSpacing: 0.3 }}>{m.name}</span>
        <span className="font-mono" style={{ fontSize: 8.5, color: '#64748b' }}>{m.arch}</span>
        <span className="font-mono font-bold" style={{ fontSize: 8.5, color: m.accent }}>{m.radios}</span>
        <span className="font-mono" style={{ fontSize: 7.5, color: '#3d5068', letterSpacing: 2, marginTop: 4 }}>TOP VIEW</span>
      </div>
    </div>
  )
}

// ─── Schematic diagram ────────────────────────────────────────────────────────

export function SchematicDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const filteredSet = new Set(filterPins(chip.pins, filter).map(p => p.gpio))
  const { left, right } = buildBanks(chip)
  const bodyH = Math.max(left.length, right.length) * ROW_H

  const toggle = (pin: Pin | undefined) => {
    if (!pin) return
    setSelectedPin(selectedPin?.gpio === pin.gpio ? null : pin)
  }

  const renderBank = (rows: SchemRow[], side: 'left' | 'right') => (
    <div className="flex flex-col" style={{ minWidth: 230 }}>
      {rows.map(row => (
        <SchematicRowView
          key={row.key}
          row={row}
          side={side}
          isSelected={!!row.pin && selectedPin?.gpio === row.pin.gpio}
          isFiltered={!row.pin || filteredSet.has(row.pin.gpio)}
          mappingLabel={row.pin ? mapping.find(a => a.gpio === row.pin!.gpio)?.label : undefined}
          onClick={() => toggle(row.pin)}
        />
      ))}
    </div>
  )

  return (
    <div className="p-4 pb-2 overflow-x-auto">
      <div className="flex items-start justify-center min-w-fit mx-auto" style={{ paddingTop: 8 }}>
        {renderBank(left, 'left')}
        <SymbolBody chip={chip} height={bodyH} />
        {renderBank(right, 'right')}
      </div>
      <p className="text-center font-mono" style={{ fontSize: 9, color: '#3d5068', marginTop: 8 }}>
        Logical view — pins grouped by function, GPIOs in ascending order. Numbers show the physical pad on the module.
      </p>
    </div>
  )
}
