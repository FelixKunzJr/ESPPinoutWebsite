import { esp32 }   from './esp32'
import { esp32s2 } from './esp32s2'
import { esp32s3 } from './esp32s3'
import { esp32c3 } from './esp32c3'
import { esp32c6 } from './esp32c6'
import { esp32h2 } from './esp32h2'
import type { Chip } from '../../types/chip'

export const CHIPS: Chip[] = [esp32, esp32s2, esp32s3, esp32c3, esp32c6, esp32h2]

export function getChip(id: string): Chip | undefined {
  return CHIPS.find(c => c.id === id)
}
