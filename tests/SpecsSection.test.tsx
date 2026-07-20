import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SpecsSection } from '../src/components/info/SpecsSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><SpecsSection /></AppContext.Provider>)
}

describe('SpecsSection', () => {
  it('shows CPU clock and SRAM for the current chip', () => {
    renderWith('esp32')
    expect(screen.getByText(/240 MHz/)).toBeInTheDocument()
    expect(screen.getByText(/520 KB/)).toBeInTheDocument()
  })
})
