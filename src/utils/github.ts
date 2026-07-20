import type { Chip, Pin } from '../types/chip'

export const REPO_URL = 'https://github.com/FelixKunzJr/ESPPinoutWebsite'

// Pick-a-template chooser and the full contributor guide.
export const ISSUE_CHOOSE_URL = `${REPO_URL}/issues/new/choose`
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`

// Prefilled GitHub issue for reporting wrong pin data, with enough context
// that the report is actionable without a follow-up round-trip.
export function reportMistakeUrl(chip: Chip, pin?: Pin | null): string {
  const title = pin
    ? `[data] ${chip.name}: GPIO${pin.gpio}`
    : `[data] ${chip.name}: `
  const body = [
    '**Chip / module:** ' + chip.name + ' (`' + chip.id + '`)',
    pin ? `**Pin:** GPIO${pin.gpio} (${pin.names.join(' / ')})` : '**Pin:** ',
    '**Page:** ' + (typeof window !== 'undefined' ? window.location.href : 'https://esp32pin.com'),
    '',
    '**What is wrong?**',
    '',
    '',
    '**What should it be? (datasheet section or link if possible)**',
    '',
  ].join('\n')
  return `${REPO_URL}/issues/new?labels=data&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}

// Prefilled issue carrying a BoardSpec JSON built in the Board Builder.
export function boardDataIssueUrl(name: string, json: string): string {
  const title = `[board data] ${name || 'new board'}`
  const body = [
    '**Board:** ' + (name || '(unnamed)'),
    '',
    'Built with the Board Builder. Please spot-check against the schematic before merging.',
    '',
    '```json',
    json,
    '```',
    '',
    '**Source (schematic / pinout link):**',
    '',
    '**Gotchas not captured above:**',
    '',
  ].join('\n')
  return `${REPO_URL}/issues/new?labels=board,data&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}

export function newChipUrl(): string {
  const title = '[new chip] '
  const body = [
    '**Module / board name:**',
    '',
    '**Datasheet link:**',
    '',
    '**Pin data (JSON, if you have it):**',
    '```json',
    '```',
  ].join('\n')
  return `${REPO_URL}/issues/new?labels=data&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}

// Prefilled issue asking a contributor to supply flashing or ESPHome content
// for a specific board.
export function boardInfoIssueUrl(chip: Chip, section: 'flashing' | 'esphome'): string {
  const label = section === 'flashing' ? 'flashing / wiring steps' : 'a minimal ESPHome config'
  const title = `[info] ${chip.name}: ${section}`
  const body = [
    '**Chip / module:** ' + chip.name + ' (`' + chip.id + '`)',
    '**Section:** ' + section,
    '**Page:** ' + (typeof window !== 'undefined' ? window.location.href : 'https://esp32pin.com'),
    '',
    `Please add ${label} for this board.`,
    '',
    section === 'flashing'
      ? 'How do you put it into download mode? (auto over USB, hold BOOT + tap EN, pull GPIO0 to GND, etc.)'
      : '```yaml\n# minimal esp32: stanza that boots on this board\n```',
    '',
  ].join('\n')
  return `${REPO_URL}/issues/new?labels=info&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}
