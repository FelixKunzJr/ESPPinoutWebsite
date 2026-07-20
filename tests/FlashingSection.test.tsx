// tests/FlashingSection.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { FlashingSection } from '../src/components/info/FlashingSection'
import { AppContext, type AppState } from '../src/context/AppContext'
import { getChip } from '../src/data/chips'

function renderWith(id: string) {
  const chip = getChip(id)!
  const value = { chip } as unknown as AppState
  return render(<AppContext.Provider value={value}><FlashingSection /></AppContext.Provider>)
}

describe('FlashingSection', () => {
  it('renders seeded manual steps for a bare module', async () => {
    renderWith('esp32')
    await userEvent.click(screen.getByRole('button', { name: /Flashing/i }))
    expect(screen.getByText(/Connect GPIO0 to GND/)).toBeInTheDocument()
  })
  it('shows the auto-flash default for a devkit with no overlay', async () => {
    renderWith('esp32c6devkitc')
    await userEvent.click(screen.getByRole('button', { name: /Flashing/i }))
    expect(screen.getByText(/auto-reset|BOOT/i)).toBeInTheDocument()
  })
  it('shows a slim contribute line (no card) for a bare module family with no overlay', () => {
    renderWith('esp32h2')
    // Empty state is a slim always-visible line, not a collapsible card - no toggle button.
    expect(screen.queryByRole('button', { name: /Flashing/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add flashing/i })).toBeInTheDocument()
    expect(screen.getByText(/not documented yet/i)).toBeInTheDocument()
  })
})
