// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'
import { RoutingCard } from '../src/components/RoutingCard'
import { matrixPeripherals, hasGpioMatrix } from '../src/data/routing'

afterEach(cleanup)

const ctx = (chipId: string): AppState => ({
  chip: getChip(chipId)!, setChip: () => {}, page: 'studio', navigate: () => {},
  view: 'module', setView: () => {}, theme: 'dark', toggleTheme: () => {},
  selectedPin: null, setSelectedPin: () => {},
  filter: 'all', setFilter: () => {}, mapping: [], assignPin: () => {},
  unassignPin: () => {}, clearMapping: () => {}, shareUrl: '',
})

const renderCard = (chipId: string) =>
  render(
    <AppContext.Provider value={ctx(chipId)}>
      <RoutingCard />
    </AppContext.Provider>,
  )

describe('routing data: matrixPeripherals / hasGpioMatrix', () => {
  it('the ESP8266 has no GPIO matrix and no LEDC/RMT/pulse-counter/sigma-delta peripherals', () => {
    expect(hasGpioMatrix('ESP8266')).toBe(false)
    const list = matrixPeripherals('ESP8266').join(' ')
    expect(list).not.toMatch(/GPIO matrix|LEDC|RMT|Sigma-delta/)
  })

  it('ESP32 keeps its GPIO matrix and LEDC (regression guard)', () => {
    expect(hasGpioMatrix('ESP32')).toBe(true)
    const list = matrixPeripherals('ESP32').join(' ')
    expect(list).toContain('LEDC')
  })
})

describe('RoutingCard rendered text', () => {
  it('never claims a GPIO matrix, LEDC, RMT or sigma-delta for the ESP8266', () => {
    const { container } = renderCard('esp8266')
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/GPIO matrix/)
    expect(text).not.toMatch(/LEDC/)
    expect(text).not.toMatch(/RMT/)
    expect(text).not.toMatch(/Sigma-delta/)
  })

  it('still claims a GPIO matrix and LEDC for the ESP32 (regression guard)', () => {
    const { container } = renderCard('esp32')
    const text = container.textContent ?? ''
    expect(text).toMatch(/GPIO matrix/)
    expect(text).toMatch(/LEDC/)
  })

  it('does not over-claim "never repurpose" for the ESP8266 flash bus, since GPIO9/10 are DIO-only, not always off-limits', () => {
    const { container } = renderCard('esp8266')
    const text = container.textContent ?? ''
    expect(text).toMatch(/Wired inside the module/)
    expect(text).not.toMatch(/never repurpose them/)
  })

  it('still says "never repurpose them" for the ESP32, whose whole flash bus is always off-limits (regression guard)', () => {
    const { container } = renderCard('esp32')
    const text = container.textContent ?? ''
    expect(text).toMatch(/never repurpose them/)
  })
})
