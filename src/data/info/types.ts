export interface FlashingInfo {
  autoFlash: boolean
  manualSteps?: string[]
  wiring?: string
  note?: string
}

export interface EsphomeInfo {
  yaml: string
  notes?: string[]
}

export interface InfoOverlay {
  flashing?: FlashingInfo
  esphome?: EsphomeInfo
}
