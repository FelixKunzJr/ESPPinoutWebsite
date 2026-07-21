// Regenerates src/data/chips/generated.ts (authoritative pin names + physical
// pad layouts) from Espressif's official KiCad libraries.
//
//   git clone --depth 1 https://github.com/espressif/kicad-libraries
//   KICAD_LIB=./kicad-libraries node scripts/generate-chip-data.mjs
//
// Set KICAD_LIB to the cloned repo (defaults to /tmp/esp-kicad).
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const KICAD = process.env.KICAD_LIB || '/tmp/esp-kicad'
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'chips', 'generated.ts')
const SYM = fs.readFileSync(`${KICAD}/symbols/Espressif.kicad_sym`, 'utf8')
const FP_DIR = `${KICAD}/footprints/Espressif.pretty`

function symbolPins(n) {
  const s = SYM.indexOf(`(symbol "${n}"`)
  if (s < 0) throw new Error('no sym ' + n)
  const re = /\n\t\(symbol "/g; re.lastIndex = s + 1
  let m, e = SYM.length; if (m = re.exec(SYM)) e = m.index
  const r = SYM.slice(s, e)
  const p = /\(pin\b[\s\S]*?\(at ([-0-9.]+) ([-0-9.]+) ([0-9]+)\)[\s\S]*?\(name "([^"]*)"[\s\S]*?\(number "([^"]*)"/g
  const o = {}; let x
  while (x = p.exec(r)) o[x[5]] = x[4]
  return o
}

// The symbol's own pin geometry: which body side each pin sits on, in drawn
// order. angle 0 = points right (LEFT side), 180 = RIGHT, 90 = BOTTOM, 270 = TOP.
// Pins stacked at the same coordinate (hidden duplicate power pins) are merged.
function symbolGeometry(n) {
  const s = SYM.indexOf(`(symbol "${n}"`)
  if (s < 0) throw new Error('no sym ' + n)
  const re = /\n\t\(symbol "/g; re.lastIndex = s + 1
  let m, e = SYM.length; if (m = re.exec(SYM)) e = m.index
  const r = SYM.slice(s, e)
  const p = /\(pin\b[\s\S]*?\(at ([-0-9.]+) ([-0-9.]+) ([0-9]+)\)[\s\S]*?\(name "([^"]*)"[\s\S]*?\(number "([^"]*)"/g
  const byPos = new Map()
  let x
  while (x = p.exec(r)) {
    const [, xs, ys, as_, name, num] = x
    const key = `${xs},${ys}`
    const numN = +num
    if (!Number.isFinite(numN)) continue
    if (byPos.has(key)) { byPos.get(key).nums.push(numN); continue }
    byPos.set(key, { x: +xs, y: +ys, angle: +as_, name, nums: [numN] })
  }
  const sides = { left: [], right: [], bottom: [], top: [] }
  for (const pin of byPos.values()) {
    const side = pin.angle === 0 ? 'left' : pin.angle === 180 ? 'right' : pin.angle === 90 ? 'bottom' : 'top'
    sides[side].push(pin)
  }
  sides.left.sort((a, b) => b.y - a.y); sides.right.sort((a, b) => b.y - a.y)
  sides.bottom.sort((a, b) => a.x - b.x); sides.top.sort((a, b) => a.x - b.x)
  const sp = pin => {
    const g = pin.name.toUpperCase().match(/GPIO(\d+)|(?:^|\/)IO(\d+)/)
    pin.nums.sort((a, b) => a - b)
    return g
      ? { pins: pin.nums, gpio: +(g[1] ?? g[2]), name: pin.name }
      : { pins: pin.nums, label: specialLabel(pin.name), name: pin.name }
  }
  return {
    left: sides.left.map(sp), right: sides.right.map(sp),
    bottom: sides.bottom.map(sp), top: sides.top.map(sp),
  }
}
function fpPads(f) {
  const t = fs.readFileSync(`${FP_DIR}/${f}.kicad_mod`, 'utf8')
  const re = /\(pad "([^"]*)"\s+\S+\s+\S+\s+\(at ([-0-9.]+) ([-0-9.]+)/g
  const o = {}; let m
  while (m = re.exec(t)) { const n = m[1]; if (!n) continue; (o[n] ??= []).push({ x: +m[2], y: +m[3] }) }
  return o
}
// Physical module outline in mm, from the footprint's courtyard bounding box
// (falls back to silkscreen / fab outline). Drives true on-screen proportions.
function fpOutline(f) {
  const t = fs.readFileSync(`${FP_DIR}/${f}.kicad_mod`, 'utf8')
  for (const layer of ['F.CrtYd', 'F.SilkS', 'F.Fab']) {
    const xs = [], ys = []
    const re = /\((?:start|end|xy|center)\s+(-?[\d.]+)\s+(-?[\d.]+)\)/g
    for (const item of t.split(/\(fp_(?=line|rect|poly|circle|arc)/).slice(1)) {
      if (!item.includes(`"${layer}"`)) continue
      let m; while (m = re.exec(item)) { xs.push(+m[1]); ys.push(+m[2]) }
    }
    if (!xs.length) continue
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
    if (w > 5 && h > 5) return { w: +w.toFixed(1), h: +h.toFixed(1), y0: Math.min(...ys) }
  }
  return undefined
}
function fpBodyMm(f) {
  const o = fpOutline(f)
  return o && { w: o.w, h: o.h }
}
// The antenna keep-out: the strip at the top of the module outline that carries
// no pads at all. Measured rather than assumed - it is 6.25 mm on a C3-MINI-1
// but 17.16 mm on the dual-antenna WROOM-DA, so a per-form constant puts pin 1
// well up alongside the antenna on the parts that need the clearance most.
//
// bodyMm may be overridden where the courtyard is larger than the module (again
// WROOM-DA, whose courtyard includes the keep-out region); the gap is rebased
// onto that outline so it stays a fraction of the body actually drawn.
function fpAntennaMm(f, pads, bodyMm) {
  const o = fpOutline(f)
  if (!o || !bodyMm) return undefined
  const ys = Object.values(pads).flat().map(p => p.y)
  if (!ys.length) return undefined
  const gap = Math.min(...ys) - o.y0 - (o.h - bodyMm.h)
  return gap > 2 ? +gap.toFixed(2) : undefined
}
const specialLabel = name => {
  const u = (name || '').toUpperCase()
  if (/CHIP[_/]?PU|RESET|^EN$|^RST$/.test(u)) return 'EN'
  if (/3V3|3\.3V|VDD3P3/.test(u)) return '3V3'
  if (/VBUS|^5V|^VIN/.test(u)) return '5V'
  if (/VBAT/.test(u)) return 'VBAT'
  if (/GND|VSS/.test(u)) return 'GND'
  if (/^NC$|^$/.test(u)) return 'NC'
  return (name || 'NC').split('/')[0]
}
function nameTokens(raw) {
  let toks = raw.split('/').map(s => s.trim()).filter(Boolean)
  const gi = toks.findIndex(t => /^GPIO\d+$/.test(t))
  if (gi > 0) { const [g] = toks.splice(gi, 1); toks.unshift(g) }
  return toks
}
function caps(toks, inputOnly) {
  const c = new Set(['gpio'])
  for (const t of toks) {
    const u = t.toUpperCase()
    if (/^ADC1/.test(u)) c.add('adc1')
    if (/^ADC2/.test(u)) c.add('adc2')
    if (/^TOUCH/.test(u)) c.add('touch')
    if (/DAC/.test(u)) c.add('dac')
    if (/(^U\d?(TXD|RXD|RTS|CTS))|U0RXD|U0TXD|TXD|RXD/.test(u)) c.add('uart')
    if (/SPI|MOSI|MISO|SCK|FSPI|SPIQ|SPID|SPIWP|SPIHD|SPICS|SPICLK/.test(u)) c.add('spi')
    if (/SDA|SCL/.test(u)) c.add('i2c')
    if (/USB_D/.test(u)) c.add('usb')
    if (/MT(CK|DO|MS|DI)|JTAG/.test(u)) c.add('jtag')
    if (/I2S/.test(u)) c.add('i2s')
    if (/XTAL_32K|RTC/.test(u)) c.add('rtc')
  }
  if (!inputOnly) c.add('pwm')
  const order = ['gpio', 'adc1', 'adc2', 'dac', 'touch', 'pwm', 'i2c', 'spi', 'uart', 'i2s', 'rtc', 'usb', 'jtag']
  return order.filter(o => c.has(o))
}
function buildLayout(pins, pads) {
  const cand = Object.entries(pads).filter(([, p]) => p.length === 1)
    .map(([num, p]) => ({ num: +num, x: p[0].x, y: p[0].y })).filter(c => Number.isFinite(c.num))
  const xs = cand.map(c => c.x), ys = cand.map(c => c.y)
  const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys), eps = 0.7
  const L = [], R = [], B = [], T = []
  for (const c of cand) {
    if (Math.abs(c.x - minx) < eps) L.push(c)
    else if (Math.abs(c.x - maxx) < eps) R.push(c)
    else if (Math.abs(c.y - maxy) < eps) B.push(c)
    else if (Math.abs(c.y - miny) < eps) T.push(c)
  }
  L.sort((a, b) => a.y - b.y); R.sort((a, b) => a.y - b.y); B.sort((a, b) => a.x - b.x); T.sort((a, b) => a.x - b.x)
  const lp = c => {
    const raw = pins[String(c.num)] || ''
    const g = raw.toUpperCase().match(/GPIO(\d+)/)
    return g ? { pinNumber: c.num, gpio: +g[1] } : { pinNumber: c.num, label: specialLabel(raw) }
  }
  return { left: L.map(lp), bottom: B.map(lp), right: R.map(lp), top: T.map(lp) }
}
function buildModule(mod, fam) {
  const pins = symbolPins(mod.sym), pads = fpPads(mod.fp)
  const seen = new Map()
  for (const raw of Object.values(pins)) {
    const g = (raw || '').toUpperCase().match(/GPIO(\d+)/)
    if (!g) continue
    const gpio = +g[1]
    if (!seen.has(gpio)) seen.set(gpio, raw)
  }
  // Classic-ESP32 flash bus: GPIO6-11 wire to the SPI flash. 6/7/8/11 are
  // always off-limits; 9/10 only when the module exposes the full bus
  // (WROOM-32 pads / DevKitC headers). PICO/MINI SiP parts keep 9/10 free.
  const fullFlashBus = fam.flashBus && seen.has(6)
  const pinObjs = [...seen.entries()].sort((a, b) => a[0] - b[0]).map(([gpio, raw]) => {
    const toks = nameTokens(raw)
    const inputOnly = fam.inputOnly?.includes(gpio)
    const flashReserved = fam.flashBus && ([6, 7, 8, 11].includes(gpio) || (fullFlashBus && [9, 10].includes(gpio)))
    const cs = []
    if (flashReserved) cs.push('FLASH')
    if (mod.ospi && [35, 36, 37].includes(gpio)) cs.push('OSPI')
    if (inputOnly) cs.push('INPUT_ONLY')
    if (fam.strapping?.includes(gpio)) cs.push('STRAP')
    if (fam.adc2Wifi && toks.some(t => /^ADC2/i.test(t))) cs.push('ADC2_WIFI')
    if (toks.some(t => /USB_D/i.test(t))) cs.push('USB')
    return { gpio, names: toks, capabilities: flashReserved ? [] : caps(toks, inputOnly), constraints: cs, usable: !flashReserved }
  })
  // mm override for footprints whose courtyard is not the module outline
  // (WROOM-DA's courtyard includes the dual-antenna keep-out region).
  const bodyMm = mod.mm ? { w: mod.mm[0], h: mod.mm[1] } : fpBodyMm(mod.fp)
  const antennaMm = fpAntennaMm(mod.fp, pads, bodyMm)
  return { pins: pinObjs, layout: { name: mod.name, ...buildLayout(pins, pads), bodyMm, antennaMm } }
}

// Per-family boot/strapping rules (the lore KiCad doesn't encode).
const FAM = {
  esp32: { strapping: [0, 2, 5, 12, 15], inputOnly: [34, 35, 36, 37, 38, 39], adc2Wifi: true, flashBus: true },
  s2:    { strapping: [0, 45, 46], inputOnly: [46], adc2Wifi: true },
  s3:    { strapping: [0, 3, 45, 46], inputOnly: [], adc2Wifi: false },
  c3:    { strapping: [2, 8, 9], inputOnly: [], adc2Wifi: false },
  c6:    { strapping: [8, 9, 15], inputOnly: [], adc2Wifi: false },
  h2:    { strapping: [2, 3, 8, 9], inputOnly: [], adc2Wifi: false },
  c5:    { strapping: [7, 25, 26, 27, 28], inputOnly: [], adc2Wifi: false },
  c2:    { strapping: [8, 9], inputOnly: [], adc2Wifi: false },
}

// One entry per distinct module pinout. prefix → exported const names.
// symOnly: emit only the schematic SymbolLayout (pins/pads stay hand-authored).
const MODULES = [
  { prefix: 'ESP32_WROOM_32', name: 'ESP32-WROOM-32', sym: 'ESP32-WROOM-E', symOnly: true },
  { prefix: 'ESP32_WROVER_E', name: 'ESP32-WROVER-E', sym: 'ESP32-WROVER-E', symOnly: true },
  { prefix: 'ESP32_WROOM_DA', name: 'ESP32-WROOM-DA', sym: 'ESP32-WROOM-DA', fp: 'ESP32-WROOM-DA', fam: 'esp32', mm: [18, 31.4] },
  { prefix: 'ESP32_MINI_1', name: 'ESP32-MINI-1', sym: 'ESP32-MINI-1', fp: 'ESP32-MINI-1', fam: 'esp32' },
  { prefix: 'ESP32_PICO_MINI_02', name: 'ESP32-PICO-MINI-02', sym: 'ESP32-PICO-MINI-02', fp: 'ESP32-PICO-MINI-02', fam: 'esp32' },
  { prefix: 'S2_WROOM', name: 'ESP32-S2-WROOM', sym: 'ESP32-S2-WROOM', fp: 'ESP32-S2-WROOM', fam: 's2' },
  { prefix: 'S2_MINI_1', name: 'ESP32-S2-MINI-1', sym: 'ESP32-S2-MINI-1', fp: 'ESP32-S2-MINI-1', fam: 's2' },
  { prefix: 'S2_SOLO', name: 'ESP32-S2-SOLO', sym: 'ESP32-S2-SOLO', fp: 'ESP32-S2-SOLO', fam: 's2' },
  { prefix: 'S2_WROVER', name: 'ESP32-S2-WROVER', sym: 'ESP32-S2-WROVER', fp: 'ESP32-S2-WROVER', fam: 's2' },
  { prefix: 'S3_WROOM_1', name: 'ESP32-S3-WROOM-1', sym: 'ESP32-S3-WROOM-1', fp: 'ESP32-S3-WROOM-1', fam: 's3', ospi: true },
  { prefix: 'S3_WROOM_2', name: 'ESP32-S3-WROOM-2', sym: 'ESP32-S3-WROOM-2', fp: 'ESP32-S3-WROOM-2', fam: 's3' },
  { prefix: 'S3_MINI_1', name: 'ESP32-S3-MINI-1', sym: 'ESP32-S3-MINI-1', fp: 'ESP32-S3-MINI-1', fam: 's3' },
  { prefix: 'C3_MINI_1', name: 'ESP32-C3-MINI-1', sym: 'ESP32-C3-MINI-1', fp: 'ESP32-C3-MINI-1', fam: 'c3' },
  { prefix: 'C3_WROOM_02', name: 'ESP32-C3-WROOM-02', sym: 'ESP32-C3-WROOM-02', fp: 'ESP32-C3-WROOM-02', fam: 'c3' },
  { prefix: 'C6_MINI_1', name: 'ESP32-C6-MINI-1', sym: 'ESP32-C6-MINI-1/U', fp: 'ESP32-C6-MINI-1', fam: 'c6' },
  { prefix: 'C6_WROOM_1', name: 'ESP32-C6-WROOM-1', sym: 'ESP32-C6-WROOM-1', fp: 'ESP32-C6-WROOM-1', fam: 'c6' },
  { prefix: 'C5_WROOM_1', name: 'ESP32-C5-WROOM-1', sym: 'ESP32-C5-WROOM-1', fp: 'ESP32-C5-WROOM-1', fam: 'c5' },
  { prefix: 'C5_MINI_1', name: 'ESP32-C5-MINI-1', sym: 'ESP32-C5-MINI-1', fp: 'ESP32-C5-MINI-1', fam: 'c5' },
  { prefix: 'H2_MINI_1', name: 'ESP32-H2-MINI-1', sym: 'ESP32-H2-MINI-1', fp: 'ESP32-H2-MINI-1', fam: 'h2' },
  // ESP8685 is ESP32-C3 silicon; ESP8684 is the ESP32-C2 group.
  { prefix: 'ESP8685_WROOM_06', name: 'ESP8685-WROOM-06', sym: 'ESP8685-WROOM-06', fp: 'ESP8685-WROOM-06', fam: 'c3' },
  { prefix: 'ESP8684_WROOM_02C', name: 'ESP8684-WROOM-02C', sym: 'ESP8684-WROOM-02C/U', fp: 'ESP8684-WROOM-02C', fam: 'c2' },
  // Common development boards (two breakout header rows)
  { prefix: 'ESP32_DEVKITC', name: 'ESP32-DevKitC', sym: 'ESP32-DevKitC', fp: 'ESP32-DevKitC', fam: 'esp32' },
  { prefix: 'ESP32_DEVKITM_1', name: 'ESP32-DevKitM-1', sym: 'ESP32-DevKitM-1', fp: 'ESP32-DevKitM-1', fam: 'esp32' },
  { prefix: 'S2_DEVKITC_1', name: 'ESP32-S2-DevKitC-1', sym: 'ESP32-S2-DevKitC-1', fp: 'ESP32-S2-DevKitC-1', fam: 's2' },
  { prefix: 'S3_DEVKITC', name: 'ESP32-S3-DevKitC-1', sym: 'ESP32-S3-DevKitC', fp: 'ESP32-S3-DevKitC', fam: 's3', ospi: true },
  { prefix: 'C3_DEVKITM', name: 'ESP32-C3-DevKitM-1', sym: 'ESP32-C3-DevKitM-1', fp: 'ESP32-C3-DevKitM-1', fam: 'c3' },
  { prefix: 'C3_DEVKITC_02', name: 'ESP32-C3-DevKitC-02', sym: 'ESP32-C3-DevKitC-02', fp: 'ESP32-C3-DevKitC-02', fam: 'c3' },
  { prefix: 'C6_DEVKITC', name: 'ESP32-C6-DevKitC-1', sym: 'ESP32-C6-DevKitC-1', fp: 'ESP32-C6-DevKitC-1', fam: 'c6' },
  { prefix: 'C6_DEVKITM_1', name: 'ESP32-C6-DevKitM-1', sym: 'ESP32-C6-DevKitM-1', fp: 'ESP32-C6-DevKitM-1', fam: 'c6' },
  { prefix: 'C5_DEVKITC_1', name: 'ESP32-C5-DevKitC-1', sym: 'ESP32-C5-DevKitC-1', fp: 'ESP32-C5-DevKitC-1', fam: 'c5' },
]

function fmtSymPin(p) {
  const nums = `[${p.pins.join(',')}]`
  const nm = JSON.stringify(p.name)
  return p.gpio !== undefined
    ? `{ pins: ${nums}, gpio: ${p.gpio}, name: ${nm} }`
    : `{ pins: ${nums}, label: '${p.label}', name: ${nm} }`
}
function fmtSym(sym) {
  let s = `{\n  left: [${sym.left.map(fmtSymPin).join(', ')}],\n  right: [${sym.right.map(fmtSymPin).join(', ')}],\n`
  if (sym.bottom.length) s += `  bottom: [${sym.bottom.map(fmtSymPin).join(', ')}],\n`
  if (sym.top.length) s += `  top: [${sym.top.map(fmtSymPin).join(', ')}],\n`
  return s + '}'
}
function fmtPin(p) {
  return `  { gpio: ${p.gpio}, names: ${JSON.stringify(p.names)}, capabilities: ${JSON.stringify(p.capabilities)} as Capability[], constraints: [${p.constraints.join(', ')}], isUsable: ${p.usable !== false} }`
}
function fmtArr(a) {
  return '[' + a.map(p => p.gpio !== undefined ? `{ pinNumber: ${p.pinNumber}, gpio: ${p.gpio} }` : `{ pinNumber: ${p.pinNumber}, label: '${p.label}' }`).join(', ') + ']'
}

let out = `// AUTO-GENERATED from Espressif's official KiCad libraries (symbols + footprints).\n// Do NOT edit by hand - run: KICAD_LIB=./kicad-libraries node scripts/generate-chip-data.mjs\n// Pin names and physical pad layout are authoritative (datasheet-equivalent).\nimport type { Capability, Pin, PackageLayout, SymbolLayout } from '../../types/chip'\n\n`
out += `const INPUT_ONLY = { id: 'input_only' as const, severity: 'warning' as const, title: 'Input only', description: 'This pin has no output driver or internal pull resistors. Use only as a digital/analog input.' }\n`
out += `const STRAP = { id: 'strapping_pin' as const, severity: 'warning' as const, title: 'Strapping pin', description: 'Sampled at boot to set boot mode / configuration. Avoid driving it at reset unless you know the required level.' }\n`
out += `const ADC2_WIFI = { id: 'adc2_no_wifi' as const, severity: 'warning' as const, title: 'ADC2 unusable with Wi-Fi', description: 'ADC2 is claimed by the Wi-Fi driver; analogRead() on this pin fails while Wi-Fi is active. Prefer ADC1 pins.' }\n`
out += `const USB = { id: 'usb_jtag' as const, severity: 'warning' as const, title: 'USB / Serial-JTAG', description: 'Part of the native USB (Serial/JTAG) interface. Avoid repurposing while USB is in use.' }\n`
out += `const FLASH = { id: 'flash_reserved' as const, severity: 'danger' as const, title: 'Reserved for flash', description: 'Wired to the SPI flash of the module. Using it for anything else will crash the chip.' }\n`
out += `const OSPI = { id: 'ospi_reserved' as const, severity: 'warning' as const, title: 'OSPI PSRAM', description: 'On modules with Octal SPI PSRAM (ESP32-S3R8 / R16V based, e.g. N8R8/N16R8 variants), IO35, IO36 and IO37 are connected to the PSRAM and are not available for other uses. Free on quad-PSRAM and no-PSRAM variants.' }\n\n`

const keys = []
for (const mod of MODULES) {
  const sym = symbolGeometry(mod.sym)
  if (!mod.symOnly) {
    const { pins, layout } = buildModule(mod, FAM[mod.fam])
    out += `export const ${mod.prefix}_PINS: Pin[] = [\n${pins.map(fmtPin).join(',\n')},\n]\n\n`
    out += `export const ${mod.prefix}_LAYOUT: PackageLayout = {\n  name: '${layout.name}',\n  left: ${fmtArr(layout.left)},\n  bottom: ${fmtArr(layout.bottom)},\n  right: ${fmtArr(layout.right)},\n`
    if (layout.top.length) out += `  top: ${fmtArr(layout.top)},\n`
    if (layout.bodyMm) out += `  bodyMm: { w: ${layout.bodyMm.w}, h: ${layout.bodyMm.h} },\n`
    if (layout.antennaMm) out += `  antennaMm: ${layout.antennaMm},\n`
    out += `}\n\n`
    console.error(`${mod.name}: ${pins.length} pins | pads L${layout.left.length} B${layout.bottom.length} R${layout.right.length} T${layout.top.length} | sym L${sym.left.length} R${sym.right.length} B${sym.bottom.length} T${sym.top.length}`)
  } else {
    console.error(`${mod.name}: symbol only | sym L${sym.left.length} R${sym.right.length} B${sym.bottom.length} T${sym.top.length}`)
  }
  out += `export const ${mod.prefix}_SYMBOL: SymbolLayout = ${fmtSym(sym)}\n\n`
  keys.push(mod.prefix)
}
fs.writeFileSync(OUT, out)
console.error(`\nWROTE ${keys.length} modules → generated.ts`)
