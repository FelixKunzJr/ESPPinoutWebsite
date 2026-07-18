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
