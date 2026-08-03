// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'
import { MappingBuilder } from '../src/components/MappingBuilder'
import type { PinAssignment } from '../src/types/chip'

afterEach(cleanup)

const ctx = (chipId: string, mapping: PinAssignment[] = []): AppState => ({
  chip: getChip(chipId)!, setChip: () => {}, page: 'studio', navigate: () => {},
  view: 'module', setView: () => {}, theme: 'dark', toggleTheme: () => {},
  selectedPin: null, setSelectedPin: () => {},
  filter: 'all', setFilter: () => {}, mapping, assignPin: () => {},
  unassignPin: () => {}, clearMapping: () => {}, shareUrl: '',
})

const renderBuilder = (chipId: string, mapping: PinAssignment[] = []) =>
  render(
    <AppContext.Provider value={ctx(chipId, mapping)}>
      <MappingBuilder />
    </AppContext.Provider>,
  )

// Round 2, "ALSO FIX": the GPIO dropdown (and the mapped-pin list) built its
// label directly from pin.gpio, so the ESP8266's synthetic analog-pin id 17
// rendered as the literal, nonexistent "GPIO17" instead of its real name A0 -
// the same class of leak Finding 4 fixed for board notes.
describe('MappingBuilder GPIO select (ESP8266 A0 leak)', () => {
  it('labels the synthetic analog pin A0, not GPIO17, in the dropdown', () => {
    const { container } = renderBuilder('esp8266')
    const options = Array.from(container.querySelectorAll('option')).map(o => o.textContent)
    expect(options).toContain('A0')
    expect(options).not.toContain('GPIO17')
  })

  it('labels a mapped GPIO17 assignment A0 in the current-mapping list', () => {
    const { container } = renderBuilder('esp8266', [{ gpio: 17, role: 'ADC', label: 'Light sensor' }])
    const text = container.textContent ?? ''
    expect(text).toContain('A0')
    expect(text).not.toContain('GPIO17')
  })

  it('still labels every real GPIO as GPIOn on the ESP32 (regression guard)', () => {
    const { container } = renderBuilder('esp32')
    const options = Array.from(container.querySelectorAll('option')).map(o => o.textContent)
    expect(options.some(o => /^GPIO\d+$/.test(o ?? ''))).toBe(true)
    expect(options.every(o => o !== '')).toBe(true)
  })
})
