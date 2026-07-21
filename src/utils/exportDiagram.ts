import { toCanvas } from 'html-to-image'
import type { Chip, PinAssignment } from '../types/chip'

export type DiagramView = 'schematic' | 'module'

async function drawWatermark(canvas: HTMLCanvasElement, scale: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const pad = 10 * scale
  ctx.font = `${11 * scale}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.fillStyle = 'rgba(156, 163, 175, 0.9)'
  try {
    // Stacked brand logo bottom right, ink matching the themed canvas.
    const light = document.documentElement.classList.contains('light')
    const logo = new Image()
    await new Promise<void>((res, rej) => {
      logo.onload = () => res()
      logo.onerror = () => rej(new Error('logo load failed'))
      logo.src = light ? '/brand/logo-stacked.svg' : '/brand/logo-stacked-dark.svg'
    })
    const h = 76 * scale
    const w = h * (300 / 292)
    const x = canvas.width - pad - w
    const y = canvas.height - pad - h
    ctx.drawImage(logo, x, y, w, h)
    // Site name in the opposite (bottom-left) corner.
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText('esp32pin.com', pad, canvas.height - pad)
  } catch {
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('esp32pin.com', canvas.width - pad, canvas.height - pad)
  }
}

function download(canvas: HTMLCanvasElement, chip: Chip) {
  const a = document.createElement('a')
  a.download = `${chip.id}-pinout.png`
  a.href = canvas.toDataURL('image/png')
  a.click()
}

// A printed sheet has nothing to click. Strip the interactive attributes and
// the pointer cursor from the cloned DOM/SVG so the PDF does not ship pins
// that look actionable but do nothing.
export function deinteractivize<T extends Element>(root: T): T {
  for (const el of root.querySelectorAll('[role="button"], [tabindex], [data-pin-anchor]')) {
    el.removeAttribute('role')
    el.removeAttribute('tabindex')
    el.removeAttribute('data-pin-anchor')
    el.removeAttribute('aria-label')
    el.classList.remove('pin-row', 'pin-pad', 'sch-row')
  }
  for (const el of root.querySelectorAll<HTMLElement>('.pin-row, .pin-pad, .sch-row')) {
    el.classList.remove('pin-row', 'pin-pad', 'sch-row')
  }
  return root
}

export async function exportPng(chip: Chip, view: DiagramView) {
  const scale = 2
  if (view === 'schematic') {
    // The schematic is a self-contained SVG sheet - rasterize it directly.
    // Full sheet regardless of zoom/scroll, no UI chrome, crisp at 2x, and
    // the sheet's own title block already carries the site credit.
    const svg = document.querySelector<SVGSVGElement>('#pinout-diagram-export svg')
    if (!svg) return
    const vb = svg.viewBox.baseVal
    const w = vb?.width || svg.clientWidth
    const h = vb?.height || svg.clientHeight
    const clone = deinteractivize(svg.cloneNode(true) as SVGSVGElement)
    clone.setAttribute('width', String(w))
    clone.setAttribute('height', String(h))
    const url = URL.createObjectURL(new Blob(
      [new XMLSerializer().serializeToString(clone)],
      { type: 'image/svg+xml;charset=utf-8' },
    ))
    try {
      const img = new Image()
      await new Promise<void>((res, rej) => {
        img.onload = () => res()
        img.onerror = () => rej(new Error('svg rasterize failed'))
        img.src = url
      })
      const canvas = document.createElement('canvas')
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#fdfcf6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, w, h)
      download(canvas, chip)
    } finally {
      URL.revokeObjectURL(url)
    }
    return
  }
  // Module view is HTML - capture the diagram content itself (full intrinsic
  // width, not the scroll-clipped card with its buttons and legend).
  // html-to-image renders through the browser's own SVG foreignObject
  // pipeline, so vertical writing-mode labels and text baselines come out
  // exactly as on screen (html2canvas garbled both).
  const target = document.getElementById('module-diagram-canvas')
    ?? document.getElementById('pinout-diagram-export')
  if (!target) return
  // Match the themed diagram card background (dark canvas or light paper).
  const dgBg = getComputedStyle(document.documentElement).getPropertyValue('--dg-bg').trim() || '#060b12'
  const canvas = await toCanvas(target, { backgroundColor: dgBg, pixelRatio: scale })
  await drawWatermark(canvas, scale)
  download(canvas, chip)
}

export function openPrintSheet(chip: Chip, view: DiagramView, mapping: PinAssignment[]) {
  // A dedicated document tab the user can inspect, print or save as PDF.
  // The diagram is the live DOM plus the site's stylesheets - the browser
  // renders it natively (no html2canvas artifacts), scaled to fit A4.
  const w = window.open('', '_blank', 'width=920,height=760')
  if (!w) return
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const name = chip.module?.name ?? chip.name
  // A4 printable width at 96dpi with 12mm margins is ~700px.
  let diagramHtml: string
  let moduleCss = ''
  if (view === 'schematic') {
    const svg = document.querySelector<SVGSVGElement>('#pinout-diagram-export svg')
    if (!svg) { w.close(); return }
    const clone = deinteractivize(svg.cloneNode(true) as SVGSVGElement)
    clone.removeAttribute('width')
    clone.removeAttribute('height')
    clone.setAttribute('style', 'width:100%;height:auto')
    diagramHtml = clone.outerHTML
  } else {
    const source = document.getElementById('module-diagram-canvas')
    if (!source) { w.close(); return }
    // Explicit measured dimensions + standard transform scale: Safari
    // mis-lays-out the zoom/fit-content shortcut. Measure the live node,
    // then print from a de-interactivized clone.
    const mw = source.scrollWidth
    const mh = source.scrollHeight
    const target = deinteractivize(source.cloneNode(true) as HTMLElement)
    const scale = Math.min(1, 700 / mw)
    moduleCss = `
    .module-outer { width: ${Math.round(mw * scale)}px; height: ${Math.round(mh * scale)}px;
                    margin: 0 auto; overflow: hidden; }
    .module-print { width: ${mw}px; transform: scale(${scale}); transform-origin: top left; }`
    diagramHtml = `<div class="module-outer"><div class="module-print">${target.outerHTML}</div></div>`
  }
  // Carry the app's stylesheets over so the cloned module DOM renders 1:1.
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(n => n.tagName === 'LINK'
      ? `<link rel="stylesheet" href="${(n as HTMLLinkElement).href}">`
      : `<style>${n.textContent}</style>`)
    .join('\n')
  const gotchas = chip.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')
  const rows = mapping.map(a =>
    `<tr><td>GPIO${a.gpio}</td><td>${escapeHtml(a.role)}</td><td>${escapeHtml(a.label)}</td></tr>`).join('')
  // Touch devices view this page zoomed out (no viewport meta, ~980px layout
  // width on iOS), so the button must be CSS-large to be finger-sized.
  const touchCss = navigator.maxTouchPoints > 0 ? `
    .toolbar { padding: 16px 0; }
    .toolbar button { font-size: 34px; padding: 22px 0; width: min(90%, 640px); border-radius: 16px; }` : ''
  // class="light": the print sheet is white paper, so the diagram's themed
  // CSS variables must resolve to their light values regardless of app theme.
  w.document.write(`<!doctype html><html class="light"><head><title>${escapeHtml(name)} pinout</title>
  ${styles}
  <style>
    @page { size: A4; margin: 12mm; }
    html, body { all: revert; height: auto; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    /* Nothing on a sheet of paper is clickable - the app's pin affordances
       must not survive into the print view. */
    .sheet * { cursor: default !important; }
    /* On screen: a PDF-viewer look - the A4 sheet floats on a gray backdrop.
       In print, the sheet IS the page: backdrop and shadow disappear. */
    body { font: 12px/1.45 -apple-system, "Segoe UI", sans-serif; color: #111; margin: 0; background: #4a4f56; }
    main.sheet { width: 210mm; min-height: 297mm; box-sizing: border-box; padding: 12mm;
                 margin: 18px auto 40px; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.45);
                 position: relative; }
    /* Brandmark rides right under the content, right-aligned - pinning it to
       the bottom of the A4 sheet left it stranded in empty space. */
    .brandrow { margin-top: 18px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
    .brandmark { display: flex; justify-content: space-between; align-items: center; text-decoration: none; }
    .brandmark img { width: 22mm; height: auto; }
    .brandmark span { font: 600 11px -apple-system, "Segoe UI", sans-serif; color: #555; letter-spacing: 0.4px; }
    h1 { font-size: 20px; margin: 0 0 2px; }
    .sub { color: #555; margin: 0 0 10px; font-size: 11px; }
    svg { max-width: 100%; height: auto; display: block; }
    /* Paper is white - the module sits directly on it, no dark app card. */${moduleCss}
    h2 { font-size: 13px; margin: 12px 0 4px; }
    ul.gotchas { margin: 0; padding-left: 18px; list-style: disc; }
    ul.gotchas li { margin: 2px 0; }
    table.map { border-collapse: collapse; margin-top: 4px; font-size: 11px; }
    table.map td, table.map th { border: 1px solid #bbb; padding: 3px 8px; text-align: left; }
    .foot { margin-top: 10px; color: #555; font-size: 10px; }
    .toolbar { position: sticky; top: 0; z-index: 10; text-align: center; padding: 10px 0;
               background: rgba(38, 41, 46, 0.92); backdrop-filter: blur(4px); }
    .toolbar button { font: 600 13px -apple-system, "Segoe UI", sans-serif; padding: 7px 16px;
                      border-radius: 7px; border: none; background: #1d4ed8; color: #fff; cursor: pointer; }${touchCss}
    @media print {
      body { background: #fff; }
      .toolbar { display: none; }
      main.sheet { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
      .foot { margin-bottom: 0; }
    }
  </style></head><body>
  <div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button></div>
  <main class="sheet">
    <h1>${escapeHtml(name)} pinout</h1>
    <p class="sub">ESP32 Pinout Studio - esp32pin.com/${chip.id} - ${new Date().toISOString().slice(0, 10)}</p>
    ${diagramHtml}
    <h2>Known gotchas</h2><ul class="gotchas">${gotchas}</ul>
    ${rows ? `<h2>Pin mapping</h2><table class="map"><tr><th>GPIO</th><th>Role</th><th>Label</th></tr>${rows}</table>` : ''}
    <p class="foot">Interactive version with live conflict checking: https://esp32pin.com/${chip.id}</p>
    <div class="brandrow">
      <a class="brandmark" href="https://esp32pin.com/${chip.id}">
        <span>esp32pin.com</span>
        <img src="${window.location.origin}/brand/logo-stacked.svg" alt="ESP32 Pinout Studio">
      </a>
    </div>
  </main>
  </body></html>`)
  w.document.close()
}
