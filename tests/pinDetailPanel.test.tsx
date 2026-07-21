// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '../src/context/AppContext'
import { PinTable } from '../src/components/PinTable'
import { PinDetailPanel } from '../src/components/PinDetailPanel'
import { deinteractivize } from '../src/utils/exportDiagram'

afterEach(cleanup)

function Studio() {
  return (
    <AppProvider>
      <PinTable />
      <PinDetailPanel />
    </AppProvider>
  )
}

const panel = () => screen.queryByRole('dialog')

describe('pin detail popover', () => {
  it('opens on a pin click and closes when the same pin is clicked again', async () => {
    const user = userEvent.setup()
    render(<Studio />)

    const row = document.querySelector('[data-pin-anchor]') as HTMLElement
    expect(row).toBeTruthy()
    expect(panel()).toBeNull()

    await user.click(row)
    expect(panel()).not.toBeNull()

    // The regression: the panel's outside-mousedown handler used to clear the
    // selection before the row's click could toggle it, so the second click
    // re-opened the panel instead of dismissing it.
    await user.click(row)
    expect(panel()).toBeNull()
  })

  it('switches straight to another pin without an intermediate close', async () => {
    const user = userEvent.setup()
    render(<Studio />)

    const rows = document.querySelectorAll<HTMLElement>('[data-pin-anchor]')
    await user.click(rows[0])
    const first = panel()?.getAttribute('aria-label')

    await user.click(rows[1])
    expect(panel()).not.toBeNull()
    expect(panel()?.getAttribute('aria-label')).not.toBe(first)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Studio />)

    await user.click(document.querySelector('[data-pin-anchor]') as HTMLElement)
    expect(panel()).not.toBeNull()

    await user.keyboard('{Escape}')
    expect(panel()).toBeNull()
  })

  it('activates a pin row from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Studio />)

    const row = document.querySelector('[data-pin-anchor]') as HTMLElement
    expect(row.getAttribute('tabindex')).toBe('0')
    row.focus()
    await user.keyboard('{Enter}')
    expect(panel()).not.toBeNull()
  })
})

describe('export strips interactivity', () => {
  it('removes pin roles, tab stops and hover classes from the printed clone', () => {
    const src = document.createElement('div')
    src.innerHTML = `
      <div class="pin-row" role="button" tabindex="0" aria-label="GPIO4" data-pin-anchor="4">x</div>
      <div class="pin-pad" role="button" tabindex="0" data-pin-anchor="5">y</div>
      <g class="sch-row" role="button" tabindex="0" data-pin-anchor="6"></g>`

    const out = deinteractivize(src.cloneNode(true) as HTMLElement)

    expect(out.querySelectorAll('[role="button"]')).toHaveLength(0)
    expect(out.querySelectorAll('[tabindex]')).toHaveLength(0)
    expect(out.querySelectorAll('[data-pin-anchor]')).toHaveLength(0)
    expect(out.querySelectorAll('.pin-row, .pin-pad, .sch-row')).toHaveLength(0)
    // The content itself must survive - only the affordances are stripped.
    expect(out.textContent).toContain('x')
    expect(out.textContent).toContain('y')
  })
})

describe('pin table on a phone', () => {
  function mockPhone(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: () => ({ matches, addEventListener() {}, removeEventListener() {} }),
    })
  }

  it('renders stacked cards instead of the five-column table', () => {
    mockPhone(true)
    const { container } = render(<Studio />)
    // The table cut the constraints column off the right edge on a phone.
    expect(container.querySelector('table')).toBeNull()
    expect(container.querySelectorAll('[data-pin-anchor]').length).toBeGreaterThan(0)
  })

  it('still renders the table on wider screens', () => {
    mockPhone(false)
    const { container } = render(<Studio />)
    expect(container.querySelector('table')).not.toBeNull()
  })

  it('opens pin details as a modal bottom sheet, not the side panel', async () => {
    mockPhone(true)
    const user = userEvent.setup()
    render(<Studio />)

    await user.click(document.querySelector('[data-pin-anchor]') as HTMLElement)
    const dialog = screen.getByRole('dialog')
    // A tall narrow side panel is the wrong shape for a phone; the sheet is
    // modal and shares the shell the bottom action bar already uses.
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.className).not.toContain('right-0')
  })

  it('keeps the docked side panel on desktop', async () => {
    mockPhone(false)
    const user = userEvent.setup()
    render(<Studio />)

    await user.click(document.querySelector('[data-pin-anchor]') as HTMLElement)
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBeNull()
    expect(dialog.className).toContain('right-0')
  })
})
