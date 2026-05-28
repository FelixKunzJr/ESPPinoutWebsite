import type { Pin, FilterKey } from '../types/chip'

export function filterPins(pins: Pin[], filter: FilterKey): Pin[] {
  switch (filter) {
    case 'all':          return pins
    case 'safe_output':  return pins.filter(p => p.isUsable && !p.constraints.some(c => c.id === 'input_only'))
    case 'adc_wifi_safe':return pins.filter(p => p.capabilities.includes('adc1'))
    case 'pwm':          return pins.filter(p => p.capabilities.includes('pwm'))
    case 'touch':        return pins.filter(p => p.capabilities.includes('touch'))
    case 'free':         return pins.filter(p => p.constraints.length === 0)
    case 'strapping':    return pins.filter(p => p.constraints.some(c => c.id === 'strapping_pin'))
    default:             return pins
  }
}
