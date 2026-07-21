import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { filterPins } from '../../utils/filterPins'
import type { Pin, Chip, LayoutPin, SymbolPin } from '../../types/chip'
import { AFFECTED_WORD, resolveModule, fnColor, fnCategory, pinAriaLabel } from './shared'

// ─── EDA sheet palette (KiCad Eeschema classic) ───────────────────────────────

const SHEET_BG    = '#fdfcf6'
const GRID_DOT    = '#dcd8ca'
const FRAME       = '#6b6455'
const BODY_FILL   = '#fff9c9'
const BODY_STROKE = '#8a1c00'
const PIN_COLOR   = '#8a1c00'
const PINNUM      = '#a83200'
const NAME_TEAL   = '#0e7476'
const TEXT_DARK   = '#3a362e'
const DIM         = '#a09a8a'

const PITCH  = 26         // horizontal-pin pitch
const HPITCH = 30         // vertical-pin pitch along top/bottom edges
const PL     = 46         // pin (stub) length
const VPL    = 36         // vertical pin length
const FONT   = "'Segoe UI','Helvetica Neue',Arial,sans-serif"

// Pin-name color inside the body.
function pinNameColor(label: string): string {
  const u = label.toUpperCase()
  if (/^3V3$|^VCC|^5V$|^VIN|^VBUS/.test(u)) return '#b91c1c'
  if (u === 'GND')                            return '#44403c'
  if (u === 'NC')                             return DIM
  return NAME_TEAL
}

// ─── Rows ─────────────────────────────────────────────────────────────────────

interface SchemRow {
  key: string
  pinNums: number[]
  pin?: Pin
  label?: string
  name?: string        // verbatim symbol pin name, e.g. 'SENSOR_VP/GPIO36/ADC1_CH0'
  solderPad?: boolean  // wire-solder-only pad (front surface or underside), not a header pin
  divider?: string     // section divider row inside the symbol (e.g. 'front solder pads')
}

function toRow(sp: SymbolPin, pinByGpio: Map<number, Pin>, i: number): SchemRow {
  return sp.gpio !== undefined
    ? { key: `g${sp.gpio}-${i}`, pinNums: sp.pins, pin: pinByGpio.get(sp.gpio), name: sp.name, label: !pinByGpio.get(sp.gpio) ? `GPIO${sp.gpio}` : undefined }
    : { key: `s${sp.pins[0]}-${i}`, pinNums: sp.pins, label: sp.label ?? 'NC', name: sp.name }
}

// Fallback for chips without an official symbol: power/EN left-top, GPIOs ascending.
function fallbackBanks(chip: Chip): { left: SchemRow[]; right: SchemRow[]; top: SchemRow[]; bottom: SchemRow[] } {
  const pinByGpio = new Map(chip.pins.map(p => [p.gpio, p]))
  let pads: LayoutPin[]
  if (chip.packageLayout) {
    const L = chip.packageLayout
    pads = [...L.left, ...L.bottom, ...L.right, ...(L.top ?? [])]
  } else {
    pads = [...chip.pins].sort((a, b) => a.gpio - b.gpio).map((p, i) => ({ pinNumber: i + 1, gpio: p.gpio }))
  }
  const gpioRows: SchemRow[] = []
  const frontRows: SchemRow[] = []
  const backRows: SchemRow[] = []
  const extras: SchemRow[] = []
  const gnd: number[] = []
  const nc: number[] = []
  const seen = new Set<number>()
  for (const lp of pads) {
    if (lp.gpio !== undefined) {
      if (seen.has(lp.gpio)) continue
      seen.add(lp.gpio)
      const row: SchemRow = {
        key: `g${lp.gpio}`, pinNums: [lp.pinNumber], pin: pinByGpio.get(lp.gpio),
        solderPad: !!(lp.isSurfacePad || lp.isBacksidePad),
      }
      if (lp.isSurfacePad) frontRows.push(row)
      else if (lp.isBacksidePad) backRows.push(row)
      else gpioRows.push(row)
      continue
    }
    const l = (lp.label ?? 'NC').toUpperCase()
    if (l === 'GND') gnd.push(lp.pinNumber)
    else if (l === 'NC') nc.push(lp.pinNumber)
    else extras.push({ key: `s${lp.pinNumber}`, pinNums: [lp.pinNumber], label: lp.label })
  }
  const byGpio = (a: SchemRow, b: SchemRow) => (a.pin?.gpio ?? 999) - (b.pin?.gpio ?? 999)
  gpioRows.sort(byGpio); frontRows.sort(byGpio); backRows.sort(byGpio)
  const tail: SchemRow[] = []
  if (gnd.length) tail.push({ key: 'gnd', pinNums: gnd.sort((a, b) => a - b), label: 'GND' })
  if (nc.length)  tail.push({ key: 'nc',  pinNums: nc.sort((a, b) => a - b),  label: 'NC' })
  // Solder-only pads are grouped apart from the header pins, behind a divider.
  const leftPadGroup: SchemRow[] = frontRows.length
    ? [{ key: 'div-front', pinNums: [], divider: 'front solder pads' }, ...frontRows] : []
  const rightPadGroup: SchemRow[] = backRows.length
    ? [{ key: 'div-back', pinNums: [], divider: 'underside solder pads' }, ...backRows] : []
  const G = gpioRows.length
  const leftG = Math.max(0, Math.min(G,
    Math.ceil((G + tail.length + rightPadGroup.length - extras.length - leftPadGroup.length) / 2)))
  return {
    left: [...extras, ...gpioRows.slice(0, leftG), ...leftPadGroup],
    right: [...gpioRows.slice(leftG), ...tail, ...rightPadGroup],
    top: [], bottom: [],
  }
}

// ─── Annotation segments (net-label style text outside the pin) ───────────────

interface Seg {
  text: string
  color: string
  bold?: boolean
  chipFill?: string    // filled warning-chip background (drawn as a rect)
}

function rowSegments(row: SchemRow, mappingLabel?: string): Seg[] {
  const segs: Seg[] = []
  if (mappingLabel) segs.push({ text: mappingLabel, color: '#fff', bold: true, chipFill: '#15803d' })
  const { pin } = row
  if (!pin) return segs
  const seenWords = new Set<string>()
  for (const c of pin.constraints) {
    const word = AFFECTED_WORD[c.id] ?? 'Note'
    if (seenWords.has(word)) continue
    seenWords.add(word)
    segs.push({
      text: `${c.severity === 'danger' ? '✕' : '⚠'} ${word}`,
      color: '#fff',
      bold: true,
      chipFill: c.severity === 'danger' ? '#7f1d1d' : '#dc2626',
    })
  }
  // Annotate every function name next to the pin - even ones that already
  // appear in the body name. Only the bare GPIOxx token is skipped (it is the
  // pin's identity, not a function).
  for (const n of pin.names) {
    if (/^GPIO\d+$/i.test(n)) continue
    segs.push({ text: n, color: fnColor(n) })
  }
  // A bare pin is not a useless pin - it is a fully free one. Say so instead
  // of leaving it blank (the GPIO matrix routes I2C/UART/PWM/SPI/... anywhere).
  if (segs.length === 0 && pin.isUsable) {
    segs.push({ text: '✓ routes any peripheral', color: '#4f7d53' })
  }
  return segs
}

const segW = (s: Seg) => s.text.length * 6.1 + (s.chipFill ? 16 : 9)
const segsW = (segs: Seg[]) => segs.reduce((a, s) => a + segW(s), 0)

// Name shown inside the body. For official symbol pins this is the verbatim
// Espressif name up to and including the GPIO token ('SENSOR_VP/GPIO36');
// the remaining function tokens stay outside as annotations.
function rowName(row: SchemRow): string {
  if (row.name) {
    const toks = row.name.split('/')
    const gi = toks.findIndex(t => /^(GPIO|IO)\d+$/i.test(t))
    return gi > 0 ? toks.slice(0, gi + 1).join('/') : toks[0]
  }
  return row.pin
    ? (row.pin.names.find(n => /^GPIO\d/.test(n)) ?? row.pin.names[0] ?? `IO${row.pin.gpio}`)
    : (row.label ?? 'NC')
}

const numText = (row: SchemRow) => (row.pinNums.length > 3 ? `×${row.pinNums.length}` : row.pinNums.join(','))

// Body-name tokens carrying a recognizable function (U0TXD, MTDI, DAC_1...)
// render in their function color so "which pin is TX?" is answerable at a
// glance; the GPIO token and unclassified names keep the KiCad teal.
function nameTspans(name: string): ReactNode {
  return name.split('/').map((t, i) => {
    const cat = fnCategory(t)
    const plain = cat === 'gpio' || cat === 'other' || cat === 'gnd' || cat === 'nc'
    return (
      <tspan key={i}>
        {i > 0 && <tspan fill="#b0a98f">/</tspan>}
        <tspan fill={plain ? undefined : fnColor(t)}>{t}</tspan>
      </tspan>
    )
  })
}

// ─── Diagram ──────────────────────────────────────────────────────────────────

export function SchematicDiagram() {
  const { chip, selectedPin, setSelectedPin, filter, mapping } = useApp()
  const filteredSet = new Set(filterPins(chip.pins, filter).map(p => p.gpio))
  const m = resolveModule(chip)
  const pinByGpio = new Map(chip.pins.map(p => [p.gpio, p]))

  const sym = chip.symbolLayout
  const banks = sym
    ? {
        left:   sym.left.map((p, i) => toRow(p, pinByGpio, i)),
        right:  sym.right.map((p, i) => toRow(p, pinByGpio, i)),
        top:    (sym.top ?? []).map((p, i) => toRow(p, pinByGpio, i)),
        bottom: (sym.bottom ?? []).map((p, i) => toRow(p, pinByGpio, i)),
      }
    : fallbackBanks(chip)

  const mapLabel = (row: SchemRow) => (row.pin ? mapping.find(a => a.gpio === row.pin!.gpio)?.label : undefined)

  const leftAW  = Math.min(330, Math.max(140, ...banks.left.map(r => segsW(rowSegments(r, mapLabel(r))))))
  const rightAW = Math.min(330, Math.max(140, ...banks.right.map(r => segsW(rowSegments(r, mapLabel(r))))))

  const FRAME_I = 22
  const CX0 = FRAME_I + 24

  const hasTop = banks.top.length > 0
  const hasBottom = banks.bottom.length > 0
  const TOPY = FRAME_I + 40 + (hasTop ? VPL + 14 : 8)

  const maxRows = Math.max(banks.left.length, banks.right.length)
  const bodyH = maxRows * PITCH + 26
  const nameW = (r: SchemRow) => rowName(r).length * 6.6 + 16
  const BW = Math.max(
    216,
    Math.max(60, ...banks.left.map(nameW)) + Math.max(60, ...banks.right.map(nameW)) + 16,
    (Math.max(banks.top.length, banks.bottom.length) + 1) * HPITCH,
  )
  const bodyX = CX0 + leftAW + PL
  const rowCY = (i: number) => TOPY + 20 + i * PITCH
  const colCX = (i: number, count: number) => bodyX + BW / 2 + (i - (count - 1) / 2) * HPITCH

  const TB_W = 292, TB_H = 66
  const svgW = bodyX + BW + PL + rightAW + 24 + FRAME_I
  const svgH = TOPY + bodyH + (hasBottom ? VPL + 12 : 0) + 44 + TB_H + 18 + FRAME_I

  const toggle = (pin: Pin | undefined) => {
    if (!pin) return
    setSelectedPin(selectedPin?.gpio === pin.gpio ? null : pin)
  }

  // Button semantics for a schematic row's <g>. SVG elements take tabindex,
  // so the rows join the tab order alongside the rest of the page; the
  // data-pin-anchor is what the detail popover positions against.
  const rowProps = (pin: Pin | undefined) => pin
    ? {
        className: 'sch-row',
        onClick: () => toggle(pin),
        onKeyDown: (e: ReactKeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(pin) }
        },
        role: 'button',
        tabIndex: 0,
        'aria-label': pinAriaLabel(pin, ''),
        'data-pin-anchor': String(pin.gpio),
      }
    : {}

  // Default to fit-width (whole sheet visible); 1:1 stays available as a
  // zoom-in toggle and starts the scroll centered on the symbol body.
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || fit) return
    el.scrollLeft = Math.max(0, bodyX + BW / 2 + 16 - el.clientWidth / 2)
  }, [chip.id, fit, bodyX, BW])

  const rowTitle = (row: SchemRow): string | null => {
    if (row.pin) {
      return row.pin.names.join(' / ')
        + (row.pinNums.length > 1 ? ` - pads ${row.pinNums.join(', ')}` : '')
        + (row.solderPad ? ' - solder pad only, no header pin' : '')
        + (row.pin.constraints.length ? ' - ' + row.pin.constraints.map(c => c.title).join(' · ') : '')
    }
    const label = row.name ?? row.label
    if (row.pinNums.length > 1) return `${label} - pads ${row.pinNums.join(', ')}`
    if (row.name && row.name !== row.label) return `${row.name} - pad ${row.pinNums[0]}`
    return null
  }

  // ── Horizontal pin (left/right banks) ──
  const renderRow = (row: SchemRow, i: number, side: 'left' | 'right'): ReactNode => {
    const cy = rowCY(i)
    const isLeft = side === 'left'
    const edgeX = isLeft ? bodyX : bodyX + BW
    const tipX  = isLeft ? edgeX - PL : edgeX + PL

    // Section divider inside the symbol (separates solder-only pads from headers)
    if (row.divider) {
      const x0 = isLeft ? edgeX + 6 : edgeX - 6
      const x1 = isLeft ? edgeX + 96 : edgeX - 96
      return (
        <g key={row.key}>
          <line x1={x0} y1={cy + 6} x2={x1} y2={cy + 6} stroke="#8a6d1f" strokeWidth="1" strokeDasharray="3 2" />
          <text x={x0} y={cy + 1} textAnchor={isLeft ? 'start' : 'end'} fontSize="6.5" fontFamily={FONT}
            fontWeight={700} fill="#8a6d1f" letterSpacing="1">{row.divider.toUpperCase()} - NO HEADER</text>
        </g>
      )
    }
    const segs = rowSegments(row, mapLabel(row))
    const name = rowName(row)
    const isSelected = !!row.pin && selectedPin?.gpio === row.pin.gpio
    const isActive = !row.pin || filteredSet.has(row.pin.gpio)
    const title = rowTitle(row)

    let ax = isLeft ? tipX - 8 : tipX + 8
    const annots = segs.map((s, k) => {
      const w = segW(s)
      const x0 = isLeft ? ax - w : ax
      const el = (
        <g key={k}>
          {s.chipFill && (
            <rect x={x0 + 1} y={cy - 8} width={w - 5} height={16} rx="3" fill={s.chipFill} />
          )}
          <text x={x0 + (w - 4) / 2} y={cy + 3.5} fontSize="10" fontFamily={FONT}
            fontWeight={s.bold ? 700 : 400} fill={s.color} textAnchor="middle">{s.text}</text>
        </g>
      )
      ax += (isLeft ? -1 : 1) * w
      return el
    })

    const hitX = isLeft ? CX0 - 6 : edgeX
    const hitW = isLeft ? edgeX - hitX : svgW - FRAME_I - 10 - edgeX

    return (
      <g key={row.key} {...rowProps(row.pin)} opacity={isActive ? 1 : 0.13}>
        {title && <title>{title}</title>}
        <rect className="sch-hit" x={hitX} y={cy - PITCH / 2} width={hitW} height={PITCH}
          fill={isSelected ? 'rgba(37,99,235,0.14)' : 'transparent'}
          stroke={isSelected ? '#2563eb' : 'none'} strokeWidth="1" strokeDasharray={isSelected ? '3 2' : undefined} />
        {/* solder-only pads: dashed stub + square pad tip instead of the
            round pin circle - reads as "pad, not a pin" */}
        <line x1={edgeX} y1={cy} x2={tipX} y2={cy} stroke={PIN_COLOR} strokeWidth="1.5"
          strokeDasharray={row.solderPad ? '3 2' : undefined} />
        {row.solderPad
          ? <rect x={tipX - 2.5} y={cy - 2.5} width={5} height={5} fill="#caa83a" stroke={PIN_COLOR} strokeWidth="0.8" />
          : <circle cx={tipX} cy={cy} r="1.8" fill="none" stroke={PIN_COLOR} strokeWidth="1" />}
        {/* constraint marker at the body edge - stays visible when the
            annotation chips are scrolled out of view on narrow screens */}
        {row.pin && row.pin.constraints.length > 0 && (
          <circle cx={isLeft ? edgeX - 5 : edgeX + 5} cy={cy - 6} r="2.6"
            fill={row.pin.constraints.some(c => c.severity === 'danger') ? '#7f1d1d' : '#dc2626'} />
        )}
        <text x={(edgeX + tipX) / 2} y={cy - 4} fontSize="8.5" fontFamily={FONT} fill={PINNUM}
          textAnchor="middle">{numText(row)}</text>
        <text x={isLeft ? edgeX + 7 : edgeX - 7} y={cy + 3.5} fontSize="10.5" fontFamily={FONT}
          fontWeight={600} fill={pinNameColor(name)}
          textAnchor={isLeft ? 'start' : 'end'}>
          {row.pin ? nameTspans(name) : name}
        </text>
        {annots}
      </g>
    )
  }

  // ── Vertical pin (top/bottom edges - power/GND/NC in the official symbols) ──
  const renderVRow = (row: SchemRow, i: number, edge: 'top' | 'bottom'): ReactNode => {
    const count = edge === 'top' ? banks.top.length : banks.bottom.length
    const cx = colCX(i, count)
    const isTop = edge === 'top'
    const edgeY = isTop ? TOPY : TOPY + bodyH
    const tipY  = isTop ? edgeY - VPL : edgeY + VPL
    // Short label only - long rotated names collide with the side banks;
    // the verbatim symbol name stays in the tooltip.
    const name = row.label ?? rowName(row)
    const isSelected = !!row.pin && selectedPin?.gpio === row.pin.gpio
    const isActive = !row.pin || filteredSet.has(row.pin.gpio)
    const title = rowTitle(row)

    return (
      <g key={row.key} {...rowProps(row.pin)} opacity={isActive ? 1 : 0.13}>
        {title && <title>{title}</title>}
        <rect className="sch-hit" x={cx - HPITCH / 2} y={Math.min(edgeY, tipY) - 4} width={HPITCH} height={VPL + 8}
          fill={isSelected ? 'rgba(37,99,235,0.14)' : 'transparent'} />
        <line x1={cx} y1={edgeY} x2={cx} y2={tipY} stroke={PIN_COLOR} strokeWidth="1.5" />
        <circle cx={cx} cy={tipY} r="1.8" fill="none" stroke={PIN_COLOR} strokeWidth="1" />
        <text x={cx + 4} y={isTop ? edgeY - VPL / 2 + 3 : edgeY + VPL / 2 + 3} fontSize="8.5"
          fontFamily={FONT} fill={PINNUM}>{numText(row)}</text>
        {/* pin name inside the body, rotated (KiCad-style vertical pin) */}
        <text transform={`rotate(-90 ${cx} ${isTop ? edgeY + 8 : edgeY - 8})`}
          x={cx} y={isTop ? edgeY + 8 : edgeY - 8} dy="3.5" fontSize="10.5" fontFamily={FONT}
          fontWeight={600} fill={pinNameColor(name)}
          textAnchor={isTop ? 'end' : 'start'}>{name}</text>
      </g>
    )
  }

  // ── Sheet frame coordinate bands ──
  const frameRefs: ReactNode[] = []
  {
    const innerW = svgW - 2 * FRAME_I
    const innerH = svgH - 2 * FRAME_I
    const nx = Math.max(2, Math.round(innerW / 220))
    const ny = Math.max(2, Math.round(innerH / 220))
    for (let i = 0; i < nx; i++) {
      const x0 = FRAME_I + (innerW * i) / nx
      const x1 = FRAME_I + (innerW * (i + 1)) / nx
      if (i > 0) {
        frameRefs.push(<line key={`vt${i}`} x1={x0} y1={6} x2={x0} y2={FRAME_I} stroke={FRAME} strokeWidth="0.8" />)
        frameRefs.push(<line key={`vb${i}`} x1={x0} y1={svgH - FRAME_I} x2={x0} y2={svgH - 6} stroke={FRAME} strokeWidth="0.8" />)
      }
      frameRefs.push(<text key={`nt${i}`} x={(x0 + x1) / 2} y={17} fontSize="9" fontFamily={FONT} fill={FRAME} textAnchor="middle">{i + 1}</text>)
      frameRefs.push(<text key={`nb${i}`} x={(x0 + x1) / 2} y={svgH - 9} fontSize="9" fontFamily={FONT} fill={FRAME} textAnchor="middle">{i + 1}</text>)
    }
    for (let j = 0; j < ny; j++) {
      const y0 = FRAME_I + (innerH * j) / ny
      const y1 = FRAME_I + (innerH * (j + 1)) / ny
      const letter = String.fromCharCode(65 + j)
      if (j > 0) {
        frameRefs.push(<line key={`hl${j}`} x1={6} y1={y0} x2={FRAME_I} y2={y0} stroke={FRAME} strokeWidth="0.8" />)
        frameRefs.push(<line key={`hr${j}`} x1={svgW - FRAME_I} y1={y0} x2={svgW - 6} y2={y0} stroke={FRAME} strokeWidth="0.8" />)
      }
      frameRefs.push(<text key={`lt${j}`} x={13} y={(y0 + y1) / 2 + 3} fontSize="9" fontFamily={FONT} fill={FRAME} textAnchor="middle">{letter}</text>)
      frameRefs.push(<text key={`lr${j}`} x={svgW - 13} y={(y0 + y1) / 2 + 3} fontSize="9" fontFamily={FONT} fill={FRAME} textAnchor="middle">{letter}</text>)
    }
  }

  const tbX = svgW - FRAME_I - TB_W
  const tbY = svgH - FRAME_I - TB_H
  const today = new Date().toISOString().slice(0, 10)
  const valueY = TOPY + bodyH + (hasBottom ? VPL + 12 : 0)

  return (
    <div>
      {/* zoom toggle lives outside the scroll container so it never scrolls away */}
      <div className="flex justify-end px-4 pt-2">
        <button
          onClick={() => setFit(f => !f)}
          className="font-mono rounded"
          style={{ fontSize: 10, padding: '3px 9px', color: '#7c8ba1', border: '1px solid #2a3a52', background: 'transparent' }}
        >
          {fit ? 'View 1:1' : 'Fit width'}
        </button>
      </div>
      <div ref={scrollRef} className="px-4 pb-3 pt-2 overflow-x-auto">
      <svg
        width={fit ? '100%' : svgW}
        height={fit ? undefined : svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="mx-auto block rounded-sm"
        style={fit ? { maxWidth: svgW, height: 'auto' } : { minWidth: svgW }}
        xmlns="http://www.w3.org/2000/svg">
        {/* Hover was a 7%-alpha wash on white paper - barely perceptible. It
            now carries a border too, and keyboard focus gets its own ring. */}
        <style>{`
          .sch-row{cursor:pointer}
          .sch-row:hover .sch-hit{fill:rgba(37,99,235,0.16);stroke:#2563eb;stroke-width:1}
          .sch-row:focus{outline:none}
          .sch-row:focus-visible .sch-hit{fill:rgba(37,99,235,0.14);stroke:var(--focus-ring, #1d4ed8);stroke-width:2}
        `}</style>
        <defs>
          <pattern id={`schgrid-${chip.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="0.6" cy="0.6" r="0.7" fill={GRID_DOT} />
          </pattern>
        </defs>

        {/* paper + grid */}
        <rect width={svgW} height={svgH} fill={SHEET_BG} />
        <rect width={svgW} height={svgH} fill={`url(#schgrid-${chip.id})`} />

        {/* sheet frame */}
        <rect x="6" y="6" width={svgW - 12} height={svgH - 12} fill="none" stroke={FRAME} strokeWidth="1.4" />
        <rect x={FRAME_I} y={FRAME_I} width={svgW - 2 * FRAME_I} height={svgH - 2 * FRAME_I} fill="none" stroke={FRAME} strokeWidth="0.8" />
        {frameRefs}

        {/* reference designator + symbol body */}
        <text x={bodyX - 4} y={TOPY - (hasTop ? VPL + 8 : 10)} fontSize="12" fontFamily={FONT} fontWeight={600} fill={NAME_TEAL}>U1</text>
        <rect x={bodyX} y={TOPY} width={BW} height={bodyH} fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth="2" />

        {/* value (module name) under the body */}
        <text x={bodyX + BW / 2} y={valueY + 22} fontSize="12" fontFamily={FONT} fontWeight={600}
          fill={NAME_TEAL} textAnchor="middle">{m.name}</text>
        <text x={bodyX + BW / 2} y={valueY + 37} fontSize="9" fontFamily={FONT}
          fill={FRAME} textAnchor="middle">{m.arch} · {m.radios}</text>

        {/* pins */}
        {banks.left.map((row, i) => renderRow(row, i, 'left'))}
        {banks.right.map((row, i) => renderRow(row, i, 'right'))}
        {banks.top.map((row, i) => renderVRow(row, i, 'top'))}
        {banks.bottom.map((row, i) => renderVRow(row, i, 'bottom'))}

        {/* title block */}
        <g>
          <rect x={tbX} y={tbY} width={TB_W} height={TB_H} fill={SHEET_BG} stroke={FRAME} strokeWidth="1.2" />
          <line x1={tbX} y1={tbY + 22} x2={tbX + TB_W} y2={tbY + 22} stroke={FRAME} strokeWidth="0.8" />
          <line x1={tbX} y1={tbY + 44} x2={tbX + TB_W} y2={tbY + 44} stroke={FRAME} strokeWidth="0.8" />
          <line x1={tbX + TB_W - 92} y1={tbY + 44} x2={tbX + TB_W - 92} y2={tbY + TB_H} stroke={FRAME} strokeWidth="0.8" />
          <text x={tbX + 8} y={tbY + 15} fontSize="10.5" fontFamily={FONT} fontWeight={700} fill={TEXT_DARK}>
            {m.name} - pinout
          </text>
          {/* brand icon: chip with the green signal diagonal (Logo.tsx, miniature) */}
          <g transform={`translate(${tbX + 8}, ${tbY + 26.5})`}>
            <rect width="13" height="13" rx="3" fill="#101d31" />
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
              <circle key={`${r}${c}`} cx={3.4 + c * 3.1} cy={3.4 + r * 3.1} r="1.15"
                fill={r + c === 2 ? '#22c55e' : '#f8fafc'} />
            )))}
          </g>
          <text x={tbX + 26} y={tbY + 37} fontSize="9.5" fontFamily={FONT} fill={TEXT_DARK}>
            ESP32 Pinout Studio · esp32pin.com
          </text>
          <text x={tbX + 8} y={tbY + 59} fontSize="9" fontFamily={FONT} fill={TEXT_DARK}>
            Date: {today}
          </text>
          <text x={tbX + TB_W - 84} y={tbY + 59} fontSize="9" fontFamily={FONT} fill={TEXT_DARK}>
            Sheet 1 / 1
          </text>
        </g>
      </svg>
      </div>
      <p className="text-center font-mono px-4 pb-1" style={{ fontSize: 9, color: '#3d5068' }}>
        {sym
          ? 'Official Espressif schematic symbol (KiCad library) - stacked GND pins merged; numbers are the physical pads.'
          : 'Logical symbol - GPIOs in ascending order. Pin numbers are the physical pads on the module.'}
      </p>
    </div>
  )
}
