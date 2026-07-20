import { describe, it, expect } from 'vitest'
import { resolveInfo } from '../src/data/info/resolveInfo'
import { getChip } from '../src/data/chips'
import { boardInfoIssueUrl } from '../src/utils/github'

describe('seeded board info', () => {
  it('bare WROOM-32 has manual flashing steps', () => {
    const f = resolveInfo(getChip('esp32')!).flashing
    expect(f?.autoFlash).toBe(false)
    expect(f?.wiring).toMatch(/GPIO0/)
  })

  it('DevKitC has a minimal ESPHome config', () => {
    const e = resolveInfo(getChip('esp32devkitc')!).esphome
    expect(e?.yaml).toMatch(/esp32:/)
    expect(e?.yaml).toMatch(/board:/)
  })

  it('builds a prefilled contribute issue url', () => {
    const url = boardInfoIssueUrl(getChip('esp32c6')!, 'esphome')
    expect(url).toMatch(/github\.com/)
    expect(decodeURIComponent(url)).toMatch(/esp32c6/)
  })
})
