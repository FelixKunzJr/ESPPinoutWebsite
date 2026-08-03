// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'
import { SchematicDiagram } from '../src/components/pinout/SchematicDiagram'

afterEach(cleanup)

const ctx = (chipId: string): AppState => ({
  chip: getChip(chipId)!, setChip: () => {}, page: 'studio', navigate: () => {},
  view: 'schematic', setView: () => {}, theme: 'dark', toggleTheme: () => {},
  selectedPin: null, setSelectedPin: () => {},
  filter: 'all', setFilter: () => {}, mapping: [], assignPin: () => {},
  unassignPin: () => {}, clearMapping: () => {}, shareUrl: '',
})

const renderSchematic = (chipId: string) =>
  render(
    <AppContext.Provider value={ctx(chipId)}>
      <SchematicDiagram />
    </AppContext.Provider>,
  )

describe('SchematicDiagram symbol caption attribution', () => {
  // The ESP-12F symbol comes from KiCad's own stock RF_Module library
  // (Espressif publishes no ESP8266 part at all) - crediting Espressif for it
  // is wrong and inconsistent with LICENSE/README/CONTRIBUTING.
  it('credits KiCad, not Espressif, for the ESP8266 symbol', () => {
    const { container } = renderSchematic('esp8266')
    const text = container.textContent ?? ''
    expect(text).toMatch(/KiCad's own stock library/)
    expect(text).not.toMatch(/Official Espressif/)
  })

  it('still credits Espressif for an ESP32 module symbol (regression guard)', () => {
    const { container } = renderSchematic('esp32')
    const text = container.textContent ?? ''
    expect(text).toMatch(/Official Espressif schematic symbol/)
  })
})

describe('SchematicDiagram flash-bus danger badges on the bare ESP-12F module', () => {
  // The bug this whole task exists to prevent: the four never-usable flash
  // pins (pads 9/10/13/14 = GPIO11/7/8/6) must show a danger badge in the
  // official-symbol schematic view, not render as bare SPI-role labels with
  // no constraint shown at all.
  it('shows a Flash danger marker for the flash-bus pads', () => {
    const { container } = renderSchematic('esp8266')
    const text = container.textContent ?? ''
    expect(text).toMatch(/Flash/)
  })
})

describe('SchematicDiagram KiCad overbar stripping', () => {
  // ESP12F_SYMBOL keeps the verbatim KiCad pin name '~{RST}' (its overbar
  // notation for an active-low signal) - that fidelity is deliberate and the
  // data must not be changed to work around it. The display layer has to
  // strip it instead, everywhere the raw symbol name reaches the screen
  // (the body text via rowName(), and the row tooltip via rowTitle()), or
  // the literal KiCad markup shows up on the flagship /esp8266 page.
  it('renders the ESP-12F reset pad as RST, never the literal ~{RST} markup', () => {
    const { container } = renderSchematic('esp8266')
    const text = container.textContent ?? ''
    // Adjacent SVG <text>/<tspan> elements concatenate with no separator in
    // textContent (e.g. the pad-number "1" runs straight into the pad name),
    // so a \b-anchored check would false-negative here - a plain substring
    // check is the right tool.
    expect(text).toContain('RST')
    expect(text).not.toContain('~{')
  })
})

describe('SchematicDiagram bare-pin annotation (round 2 residual 2b)', () => {
  // A bare pin with no other annotation (GPIO4/GPIO5 on the ESP-12F) used to
  // say "routes any peripheral" regardless of family - false for the ESP8266,
  // which has no signal router and can only host software I2C/PWM there.
  it('does not claim a bare ESP8266 pin routes any peripheral, and names only the software-driven ones', () => {
    const { container } = renderSchematic('esp8266')
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/routes any peripheral/)
    expect(text).toMatch(/free \(I2C\/PWM\)/)
  })

  it('still claims a bare ESP32 pin routes any peripheral (regression guard)', () => {
    // WROOM-32 has no bare pins (every pin carries an alternate-function
    // name); WROOM-DA does, so it is the one that actually exercises this
    // fallback branch.
    const { container } = renderSchematic('esp32wroomda')
    const text = container.textContent ?? ''
    expect(text).toMatch(/routes any peripheral/)
  })
})
