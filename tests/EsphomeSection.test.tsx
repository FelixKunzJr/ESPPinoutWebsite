// tests/EsphomeSection.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { EsphomeSection } from '../src/components/info/EsphomeSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><EsphomeSection /></AppContext.Provider>)
}

describe('EsphomeSection', () => {
  it('renders the seeded YAML for the DevKitC', async () => {
    renderWith('esp32devkitc')
    await userEvent.click(screen.getByRole('button', { name: /ESPHome/i }))
    expect(screen.getByText(/board: esp32dev/)).toBeInTheDocument()
  })
  it('shows a slim contribute line (no card) when there is no config', () => {
    renderWith('esp32h2')
    // Empty state is a slim always-visible line, not a collapsible card - no toggle button.
    expect(screen.queryByRole('button', { name: /ESPHome/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add esphome/i })).toBeInTheDocument()
    expect(screen.getByText(/not documented yet/i)).toBeInTheDocument()
  })
})
