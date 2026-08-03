// Post-build SEO pass: per-chip OG card images + prerendered per-chip HTML.
// Vercel serves dist/<id>/index.html for /<id> before the SPA rewrite, so
// crawlers and link unfurlers get chip-specific meta while the app is unchanged.
// Run via: tsx scripts/postbuild-seo.ts (wired into `npm run build`).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { CHIPS } from '../src/data/chips'
import { hasGpioMatrix } from '../src/data/routing'
import type { Chip } from '../src/types/chip'

const DIST = join(import.meta.dirname, '..', 'dist')
const SITE = 'https://esp32pin.com'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

function trapPinCount(chip: Chip): number {
  return chip.pins.filter(p => p.constraints && p.constraints.length > 0).length
}

function ogSvg(chip: Chip): string {
  const accent = chip.module?.accent ?? '#3b82f6'
  const name = chip.module?.name ?? chip.name
  // keep the name inside the left column (module glyph starts at x=810)
  const nameSize = Math.min(88, Math.floor(690 / (0.58 * name.length)))
  const radios = chip.module?.radios ?? ''
  const traps = trapPinCount(chip)
  // right-hand module glyph: PCB with castellated pads + antenna region
  const pads = []
  for (let i = 0; i < 9; i++) {
    pads.push(`<circle cx="828" cy="${205 + i * 30}" r="7" fill="#d4d4d8"/>`)
    pads.push(`<circle cx="1132" cy="${205 + i * 30}" r="7" fill="#d4d4d8"/>`)
  }
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#030712"/>
  <rect x="0" y="0" width="1200" height="6" fill="${accent}"/>
  <text x="72" y="110" font-family="sans-serif" font-size="26" letter-spacing="4" fill="#6b7280">ESP32 PINOUT STUDIO</text>
  <text x="72" y="${110 + nameSize + 60}" font-family="sans-serif" font-size="${nameSize}" font-weight="bold" fill="#f9fafb">${esc(name)}</text>
  <text x="72" y="340" font-family="sans-serif" font-size="30" fill="${accent}">${esc(chip.family)}${radios ? '  ·  ' + esc(radios) : ''}</text>
  <text x="72" y="420" font-family="sans-serif" font-size="28" fill="#9ca3af">${chip.totalGpio} GPIOs  ·  ${traps} trap pins flagged  ·  live conflict check</text>
  <text x="72" y="560" font-family="monospace" font-size="30" fill="#e5e7eb">${SITE.replace('https://', '')}/${chip.id}</text>
  <g>
    <rect x="810" y="160" rx="14" width="340" height="330" fill="#0f172a" stroke="#1f2937" stroke-width="3"/>
    <rect x="810" y="160" rx="14" width="340" height="70" fill="${accent}" opacity="0.25"/>
    <path d="M 840 180 h 40 v 30 h -40 v -12 h 28 v -8 h -28 z" fill="${accent}" opacity="0.8"/>
    <rect x="880" y="270" width="200" height="140" rx="6" fill="#111827" stroke="#374151" stroke-width="2"/>
    <text x="980" y="348" font-family="monospace" font-size="22" fill="#6b7280" text-anchor="middle">${esc(chip.family)}</text>
    ${pads.join('\n    ')}
  </g>
</svg>`
}

function chipTitle(chip: Chip): string {
  const name = chip.module?.name ?? chip.name
  return `${name} Pinout - GPIOs, strapping pins, ADC | ESP32 Pinout Studio`
}

function chipDescription(chip: Chip): string {
  const name = chip.module?.name ?? chip.name
  const traps = trapPinCount(chip)
  const source = chip.family === 'ESP8266' ? "KiCad's own stock symbols" : "Espressif's official KiCad symbols"
  return `Interactive ${name} pinout: all ${chip.totalGpio} GPIOs with ADC, touch, PWM and bus functions, ${traps} trap pins flagged (strapping, flash, input-only), live conflict checking and Arduino export. Data from ${source}.`
}

function prerenderHtml(base: string, chip: Chip): string {
  const url = `${SITE}/${chip.id}`
  const og = `${SITE}/og/${chip.id}.png`
  const title = esc(chipTitle(chip))
  const desc = esc(chipDescription(chip))
  let html = base
  const subs: Array<[RegExp, string]> = [
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${desc}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${title}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${desc}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
    [/(<meta property="og:image" content=")[^"]*/, `$1${og}`],
    [/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`],
    [/(<meta name="twitter:description" content=")[^"]*/, `$1${desc}`],
    [/(<meta name="twitter:image" content=")[^"]*/, `$1${og}`],
  ]
  for (const [re, replacement] of subs) {
    if (!re.test(html)) throw new Error(`postbuild-seo: pattern not found in index.html: ${re}`)
    html = html.replace(re, replacement)
  }
  return html
}

// ---------- per-pin pages (programmatic SEO) ----------
// Only one representative chip per family: the same GPIO exists on every
// module of a family, and near-duplicate pages would hurt more than help.
const FAMILY_REPS = ['esp32', 'esp32s2', 'esp32s3', 'esp32c3', 'esp32c5wroom1', 'esp32c6', 'esp32h2', 'esp8266']

// Capability badge copy, family-aware: families with no GPIO matrix (the
// ESP8266) have neither LEDC PWM nor matrix-routed SPI/UART/I2C, so the label
// must not claim either. hasGpioMatrix() is the same signal RoutingCard and
// SchematicDiagram use for this distinction.
function capLabel(cap: string, family: string): string {
  const matrix = hasGpioMatrix(family)
  switch (cap) {
    case 'gpio':  return 'Digital input/output'
    case 'adc1':  return 'ADC1 analog input (works while Wi-Fi is active)'
    case 'adc2':  return 'ADC2 analog input (unusable while Wi-Fi is active)'
    case 'dac':   return 'DAC analog output'
    case 'touch': return 'Capacitive touch sensing'
    case 'pwm':   return matrix ? 'PWM output (LEDC)' : 'PWM output (software)'
    case 'i2c':   return matrix ? 'I2C (via GPIO matrix)' : 'I2C (software, bit-banged)'
    case 'spi':   return matrix ? 'SPI (via GPIO matrix)' : 'SPI (fixed IO MUX pins)'
    case 'uart':  return matrix ? 'UART (via GPIO matrix)' : 'UART (fixed IO MUX pins)'
    case 'rtc':   return 'RTC GPIO (usable in deep sleep, wake source)'
    case 'usb':   return 'Native USB'
    default:      return cap
  }
}

// Espressif is the source for every family except the ESP8266, which has no
// published Espressif KiCad data (see LICENSE / README).
function dataSourceNote(chip: Chip): string {
  return chip.family === 'ESP8266'
    ? "Pin data generated from KiCad's own stock symbol and footprint libraries (Espressif publishes no ESP8266 KiCad data)."
    : "Pin data generated from Espressif's official KiCad libraries."
}

// The URL slug and display name for one pin. Real GPIOs carry the 'gpio'
// capability (the same "is this a real GPIO" signal MappingBuilder and
// resolveBoard use); the ESP8266's synthetic analog input does not, so it
// must render under its real name (A0) rather than the internal GPIO17 id -
// that id does not exist on the chip and must never reach a URL, title, h1 or
// sibling link.
function pinSlug(pin: Chip['pins'][number]): string {
  return pin.capabilities.includes('gpio') ? `gpio${pin.gpio}` : pin.names[0].toLowerCase()
}
function pinDisplayName(pin: Chip['pins'][number]): string {
  return pin.capabilities.includes('gpio') ? `GPIO${pin.gpio}` : pin.names[0]
}

function pinVerdict(pin: { isUsable: boolean; constraints: { severity: string }[] }) {
  if (!pin.isUsable || pin.constraints.some(c => c.severity === 'danger'))
    return { text: 'Avoid this pin', color: '#f87171', detail: 'It has a hard conflict - pick a different GPIO.' }
  if (pin.constraints.length > 0)
    return { text: 'Use with care', color: '#fbbf24', detail: 'Fine for many uses, but check the warnings below first.' }
  return { text: 'Safe to use', color: '#4ade80', detail: 'No boot, flash or radio conflicts known for this pin.' }
}

function pinPageHtml(chip: Chip, pin: Chip['pins'][number]): string {
  const fam = chip.family
  const n = pin.gpio
  const slug = pinSlug(pin)
  const display = pinDisplayName(pin)
  const url = `${SITE}/${chip.id}/${slug}`
  const verdict = pinVerdict(pin)
  const title = `${fam} ${display}: functions, boot behavior, is it safe? | ESP32 Pinout Studio`
  const desc = `${fam} ${display} (${pin.names.join(', ')}): ${verdict.text.toLowerCase()}. ${
    pin.constraints.length
      ? pin.constraints.map(c => c.title).join(', ') + '.'
      : 'No known conflicts.'
  } Full interactive ${fam} pinout with live conflict checking.`
  const caps = pin.capabilities.map(c => `<li>${esc(capLabel(c, fam))}</li>`).join('')
  const constraints = pin.constraints.map(c =>
    `<h3 style="margin:14px 0 4px;color:${c.severity === 'danger' ? '#f87171' : '#fbbf24'}">${esc(c.title)}</h3><p style="margin:0;color:#9ca3af">${esc(c.description)}</p>`).join('')
  const siblings = chip.pins.map(p =>
    p.gpio === n
      ? `<span style="color:#f9fafb">${esc(pinDisplayName(p))}</span>`
      : `<a href="/${chip.id}/${pinSlug(p)}" style="color:#60a5fa;text-decoration:none">${esc(pinDisplayName(p))}</a>`).join(' · ')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="ESP32 Pinout Studio">
  <meta property="og:title" content="${esc(`${fam} ${display}: ${verdict.text}`)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/og/${chip.id}.png">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body style="margin:0;background:#030712;color:#e5e7eb;font-family:-apple-system,'Segoe UI',sans-serif;line-height:1.55">
  <main style="max-width:720px;margin:0 auto;padding:40px 20px">
    <p style="margin:0 0 4px"><a href="/${chip.id}" style="color:#60a5fa;text-decoration:none">&larr; ${esc(chip.module?.name ?? chip.name)} pinout</a></p>
    <h1 style="margin:0 0 6px;font-size:32px;color:#f9fafb">${esc(fam)} ${esc(display)}</h1>
    <p style="margin:0 0 18px;color:#6b7280;font-family:monospace">${esc(pin.names.join(' / '))}</p>
    <div style="border:1px solid ${verdict.color};border-radius:8px;padding:12px 16px;margin-bottom:22px">
      <strong style="color:${verdict.color}">${verdict.text}</strong>
      <span style="color:#9ca3af"> - ${esc(verdict.detail)}</span>
    </div>
    ${caps ? `<h2 style="font-size:18px;margin:0 0 6px;color:#f9fafb">What ${esc(display)} can do</h2><ul style="margin:0 0 18px;padding-left:20px;color:#d1d5db">${caps}</ul>` : ''}
    ${constraints ? `<h2 style="font-size:18px;margin:18px 0 0;color:#f9fafb">Warnings for ${esc(display)}</h2>${constraints}` : ''}
    ${pin.notes ? `<p style="margin:16px 0 0;color:#9ca3af">${esc(pin.notes)}</p>` : ''}
    <a href="/${chip.id}" style="display:inline-block;margin:26px 0 0;background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Open the interactive ${esc(fam)} pinout &rarr;</a>
    <h2 style="font-size:14px;margin:34px 0 6px;color:#6b7280">All ${esc(fam)} pins</h2>
    <p style="font-size:13px;margin:0">${siblings}</p>
    <p style="margin:34px 0 0;font-size:12px;color:#4b5563">ESP32 Pinout Studio - free interactive pinout reference. ${dataSourceNote(chip)} <a href="/" style="color:#60a5fa">esp32pin.com</a></p>
  </main>
</body>
</html>`
}

function sitemapXml(pinUrls: string[]): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    `${SITE}/`,
    `${SITE}/contribute`,
    `${SITE}/build`,
    ...CHIPS.map(c => `${SITE}/${c.id}`),
    ...pinUrls,
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')
  }\n</urlset>\n`
}

async function main() {
  const base = readFileSync(join(DIST, 'index.html'), 'utf8')
  mkdirSync(join(DIST, 'og'), { recursive: true })
  for (const chip of CHIPS) {
    await sharp(Buffer.from(ogSvg(chip))).png().toFile(join(DIST, 'og', `${chip.id}.png`))
    mkdirSync(join(DIST, chip.id), { recursive: true })
    writeFileSync(join(DIST, chip.id, 'index.html'), prerenderHtml(base, chip))
  }
  const pinUrls: string[] = []
  for (const id of FAMILY_REPS) {
    const chip = CHIPS.find(c => c.id === id)
    if (!chip) throw new Error(`postbuild-seo: family rep chip not found: ${id}`)
    for (const pin of chip.pins) {
      const slug = pinSlug(pin)
      const dir = join(DIST, chip.id, slug)
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'index.html'), pinPageHtml(chip, pin))
      pinUrls.push(`${SITE}/${chip.id}/${slug}`)
    }
  }
  writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml(pinUrls))
  console.log(`postbuild-seo: ${CHIPS.length} chip pages, ${pinUrls.length} pin pages, sitemap + OG images generated`)
}

main()
