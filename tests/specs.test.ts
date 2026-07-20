import { describe, it, expect } from 'vitest'
import { FAMILY_SPECS } from '../src/data/chips/specs'
import { CHIPS } from '../src/data/chips'

describe('chip specs', () => {
  it('has a spec entry for every family present in the catalog', () => {
    const families = [...new Set(CHIPS.map(c => c.family))]
    for (const fam of families) {
      expect(FAMILY_SPECS[fam], `missing specs for ${fam}`).toBeDefined()
      expect(FAMILY_SPECS[fam].cpuMaxMhz).toBeGreaterThan(0)
      expect(FAMILY_SPECS[fam].sramKb).toBeGreaterThan(0)
    }
  })
})
