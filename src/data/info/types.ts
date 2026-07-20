export interface FlashingInfo {
  autoFlash: boolean
  manualSteps?: string[]
  wiring?: string
  note?: string
}

export interface InfoOverlay {
  flashing?: FlashingInfo
}
