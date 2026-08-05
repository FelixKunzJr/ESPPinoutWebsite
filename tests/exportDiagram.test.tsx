// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'
import { PinoutDiagram } from '../src/components/PinoutDiagram'
import { schematicSheet } from '../src/utils/exportDiagram'

afterEach(cleanup)

const ctx = (chipId: string): AppState => ({
  chip: getChip(chipId)!, setChip: () => {}, page: 'studio', navigate: () => {},
  view: 'schematic', setView: () => {}, theme: 'dark', toggleTheme: () => {},
  selectedPin: null, setSelectedPin: () => {},
  filter: 'all', setFilter: () => {}, mapping: [], assignPin: () => {},
  unassignPin: () => {}, clearMapping: () => {}, shareUrl: '',
})

// Renders the diagram inside the same #pinout-diagram-export wrapper the app
// and the board builder both use, because that wrapper is what the exporters
// query against.
const renderExportable = (chipId: string) =>
  render(
    <div id="pinout-diagram-export">
      <AppContext.Provider value={ctx(chipId)}>
        <PinoutDiagram />
      </AppContext.Provider>
    </div>,
    { container: document.body.appendChild(document.createElement('div')) },
  )

describe('schematic PNG/PDF export target (issue #18)', () => {
  // Both downloads shipped a full-page exclamation triangle because the
  // exporter took the first <svg> in the export container, and the header's
  // "Report mistake" warning glyph is an <svg> that precedes the sheet.
  it('picks the schematic sheet, not the header warning icon', () => {
    renderExportable('esp32')
    const all = document.querySelectorAll('#pinout-diagram-export svg')
    // Guard the premise: if the header icon ever stops being an inline <svg>
    // this test would pass for the wrong reason.
    expect(all.length).toBeGreaterThan(1)

    const sheet = schematicSheet()
    expect(sheet).not.toBeNull()
    expect(sheet).not.toBe(all[0])
    // The sheet is the one carrying the real drawing.
    expect(sheet!.getAttribute('viewBox')).toMatch(/^0 0 \d+(\.\d+)? \d+(\.\d+)?$/)
    expect(sheet!.textContent).toContain('GPIO')
  })

  it('resolves the sheet for an ESP8266 module too', () => {
    renderExportable('esp8266')
    expect(schematicSheet()).not.toBeNull()
  })
})
