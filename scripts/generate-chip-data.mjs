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
const SYM = fs.readFileSync(`${KICAD}/symbols/Espressif.kicad_sym`,'utf8')
const FP_DIR=`${KICAD}/footprints/Espressif.pretty`
function symbolPins(n){const s=SYM.indexOf(`(symbol "${n}"`);if(s<0)throw new Error('no sym '+n);const re=/\n\t\(symbol "/g;re.lastIndex=s+1;let m,e=SYM.length;if(m=re.exec(SYM))e=m.index;const r=SYM.slice(s,e);const p=/\(pin\b[\s\S]*?\(name "([^"]*)"[\s\S]*?\(number "([^"]*)"/g;const o={};let x;while(x=p.exec(r))o[x[2]]=x[1];return o}
function fpPads(f){const t=fs.readFileSync(`${FP_DIR}/${f}.kicad_mod`,'utf8');const re=/\(pad "([^"]*)"\s+\S+\s+\S+\s+\(at ([-0-9.]+) ([-0-9.]+)/g;const o={};let m;while(m=re.exec(t)){const n=m[1];if(!n)continue;(o[n]??=[]).push({x:+m[2],y:+m[3]})}return o}
const specialLabel = name => {
  const u=(name||'').toUpperCase()
  if(/CHIP[_/]?PU|RESET|^EN$/.test(u))return 'EN'
  if(/3V3|3\.3V|VDD3P3/.test(u))return '3V3'
  if(/VBUS|^5V|^VIN/.test(u))return '5V'
  if(/VBAT/.test(u))return 'VBAT'
  if(/GND|VSS/.test(u))return 'GND'
  if(/^NC$|^$/.test(u))return 'NC'
  return (name||'NC').split('/')[0]
}
function nameTokens(raw){ // → ordered names array, gpio first
  let toks = raw.split('/').map(s=>s.trim()).filter(Boolean)
  const gi = toks.findIndex(t=>/^GPIO\d+$/.test(t))
  if(gi>0){ const [g]=toks.splice(gi,1); toks.unshift(g) }
  return toks
}
function caps(toks, inputOnly){
  const c=new Set(['gpio'])
  for(const t of toks){const u=t.toUpperCase()
    if(/^ADC1/.test(u))c.add('adc1')
    if(/^ADC2/.test(u))c.add('adc2')
    if(/^TOUCH/.test(u))c.add('touch')
    if(/DAC/.test(u))c.add('dac')
    if(/(^U\d?(TXD|RXD|RTS|CTS))|U0RXD|U0TXD|TXD|RXD/.test(u))c.add('uart')
    if(/SPI|MOSI|MISO|SCK|FSPI|SPIQ|SPID|SPIWP|SPIHD|SPICS|SPICLK/.test(u))c.add('spi')
    if(/SDA|SCL/.test(u))c.add('i2c')
    if(/USB_D/.test(u))c.add('usb')
    if(/MT(CK|DO|MS|DI)|JTAG/.test(u))c.add('jtag')
    if(/I2S/.test(u))c.add('i2s')
    if(/XTAL_32K|RTC/.test(u))c.add('rtc')
  }
  if(!inputOnly)c.add('pwm')
  // stable order
  const order=['gpio','adc1','adc2','dac','touch','pwm','i2c','spi','uart','i2s','rtc','usb','jtag']
  return order.filter(o=>c.has(o))
}

function buildLayout(pins,pads){
  const cand=Object.entries(pads).filter(([,p])=>p.length===1).map(([num,p])=>({num:+num,x:p[0].x,y:p[0].y})).filter(c=>Number.isFinite(c.num))
  const xs=cand.map(c=>c.x),ys=cand.map(c=>c.y)
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys),eps=0.7
  const L=[],R=[],B=[],T=[]
  for(const c of cand){if(Math.abs(c.x-minx)<eps)L.push(c);else if(Math.abs(c.x-maxx)<eps)R.push(c);else if(Math.abs(c.y-maxy)<eps)B.push(c);else if(Math.abs(c.y-miny)<eps)T.push(c)}
  L.sort((a,b)=>a.y-b.y);R.sort((a,b)=>a.y-b.y);B.sort((a,b)=>a.x-b.x);T.sort((a,b)=>a.x-b.x)
  const lp=c=>{const raw=pins[String(c.num)]||'';const g=raw.toUpperCase().match(/GPIO(\d+)/);return g?{pinNumber:c.num,gpio:+g[1]}:{pinNumber:c.num,label:specialLabel(raw)}}
  return {left:L.map(lp),bottom:B.map(lp),right:R.map(lp),top:T.map(lp)}
}

function buildChip(cfg){
  const pins=symbolPins(cfg.sym), pads=fpPads(cfg.fp)
  // collect exposed GPIO pads (unique gpio), in gpio order
  const seen=new Map()
  for(const [num,raw] of Object.entries(pins)){
    const g=(raw||'').toUpperCase().match(/GPIO(\d+)/)
    if(!g)continue
    const gpio=+g[1]
    if(!seen.has(gpio)) seen.set(gpio, raw)
  }
  const pinObjs=[...seen.entries()].sort((a,b)=>a[0]-b[0]).map(([gpio,raw])=>{
    const toks=nameTokens(raw)
    const inputOnly=cfg.inputOnly?.includes(gpio)
    const cs=[]
    if(inputOnly)cs.push('INPUT_ONLY')
    if(cfg.strapping?.includes(gpio))cs.push('STRAP')
    if(cfg.adc2Wifi && toks.some(t=>/^ADC2/i.test(t)))cs.push('ADC2_WIFI')
    if(toks.some(t=>/USB_D/i.test(t)))cs.push('USB')
    return {gpio,names:toks,capabilities:caps(toks,inputOnly),constraints:cs,isUsable:true}
  })
  return {pins:pinObjs, layout:{name:cfg.name, ...buildLayout(pins,pads)}}
}

const CFG=[
  {id:'esp32s2',name:'ESP32-S2-WROOM',sym:'ESP32-S2-WROOM',fp:'ESP32-S2-WROOM',inputOnly:[46],strapping:[0,45,46],adc2Wifi:true},
  {id:'esp32s3',name:'ESP32-S3-WROOM-1',sym:'ESP32-S3-WROOM-1',fp:'ESP32-S3-WROOM-1',strapping:[0,3,45,46],adc2Wifi:false},
  {id:'esp32c3',name:'ESP32-C3-MINI-1',sym:'ESP32-C3-MINI-1',fp:'ESP32-C3-MINI-1',strapping:[2,8,9],adc2Wifi:false},
  {id:'esp32c6',name:'ESP32-C6-MINI-1',sym:'ESP32-C6-MINI-1/U',fp:'ESP32-C6-MINI-1',strapping:[8,9,15],adc2Wifi:false},
  {id:'esp32h2',name:'ESP32-H2-MINI-1',sym:'ESP32-H2-MINI-1',fp:'ESP32-H2-MINI-1',strapping:[8,9,2,3],adc2Wifi:false},
]

function fmtPin(p){
  const names=JSON.stringify(p.names)
  const caps=JSON.stringify(p.capabilities)
  const cons='['+p.constraints.join(', ')+']'
  return `  { gpio: ${p.gpio}, names: ${names}, capabilities: ${caps} as Capability[], constraints: ${cons}, isUsable: ${p.isUsable} }`
}
function fmtLayoutArr(a){return '['+a.map(p=>p.gpio!==undefined?`{ pinNumber: ${p.pinNumber}, gpio: ${p.gpio} }`:`{ pinNumber: ${p.pinNumber}, label: '${p.label}' }`).join(', ')+']'}

let out=`// AUTO-GENERATED from Espressif KiCad libraries (symbols + footprints).\n// Do not edit by hand — regenerate. Pin names & physical pad layout are authoritative.\nimport type { Capability, Pin, PackageLayout } from '../../types/chip'\n\n`
out+=`const INPUT_ONLY = { id: 'input_only' as const, severity: 'warning' as const, title: 'Input only', description: 'This pin has no output driver or internal pull resistors. Use only as a digital/analog input.' }\n`
out+=`const STRAP = { id: 'strapping_pin' as const, severity: 'warning' as const, title: 'Strapping pin', description: 'Sampled at boot to set boot mode / configuration. Avoid driving it at reset unless you know the required level.' }\n`
out+=`const ADC2_WIFI = { id: 'adc2_no_wifi' as const, severity: 'warning' as const, title: 'ADC2 unusable with Wi-Fi', description: 'ADC2 is claimed by the Wi-Fi driver; analogRead() on this pin fails while Wi-Fi is active. Prefer ADC1 pins.' }\n`
out+=`const USB = { id: 'usb_jtag' as const, severity: 'warning' as const, title: 'USB / Serial-JTAG', description: 'Part of the native USB (Serial/JTAG) interface. Avoid repurposing while USB is in use.' }\n\n`
for(const cfg of CFG){
  const {pins,layout}=buildChip(cfg)
  const V=cfg.id.toUpperCase()
  out+=`export const ${V}_PINS: Pin[] = [\n${pins.map(fmtPin).join(',\n')},\n]\n\n`
  out+=`export const ${V}_LAYOUT: PackageLayout = {\n  name: '${layout.name}',\n  left: ${fmtLayoutArr(layout.left)},\n  bottom: ${fmtLayoutArr(layout.bottom)},\n  right: ${fmtLayoutArr(layout.right)},\n`
  if(layout.top.length)out+=`  top: ${fmtLayoutArr(layout.top)},\n`
  out+=`}\n\n`
  console.error(`${cfg.id}: ${pins.length} pins | L${layout.left.length} B${layout.bottom.length} R${layout.right.length} T${layout.top.length}`)
}
fs.writeFileSync(OUT, out)
console.error('WROTE generated.ts')
