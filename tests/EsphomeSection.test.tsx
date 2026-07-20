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
  it('shows a contribute button when there is no config', async () => {
    renderWith('esp32h2')
    await userEvent.click(screen.getByRole('button', { name: /ESPHome/i }))
    expect(screen.getByRole('link', { name: /add esphome/i })).toBeInTheDocument()
  })
})
